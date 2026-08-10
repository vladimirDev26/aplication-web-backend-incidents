import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import {
  CreateTicketDto,
  UpdateTicketDto,
  AsignarTicketDto,
  ResolverTicketDto,
  ConformidadTicketDto,
} from './dto/ticket.dto';
import { HistorialService } from '../historial/historial.service';
import {
  obtenerParametrosPaginacion,
  paginacionMeta,
} from '../common/paginacion.util';
import { TicketsGateway } from '../socket/tickets.gateway';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly repo: Repository<Ticket>,
    private readonly historialService: HistorialService,
    private readonly socketGateway: TicketsGateway,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(filtros: Record<string, string> = {}) {
    const { pagina, pageSize, offset } = obtenerParametrosPaginacion(
      filtros,
      10,
    );

    const qb = this.repo
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.usuario', 'usuario')
      .leftJoinAndSelect('t.responsable', 'responsable')
      .leftJoinAndSelect('t.equipo', 'equipo')
      .leftJoinAndSelect('t.categoria', 'categoria')
      .leftJoinAndSelect('t.prioridad', 'prioridad')
      .leftJoinAndSelect('t.estado', 'estado')
      .orderBy('t.fecha_creacion', 'DESC');

    this.aplicarFiltros(qb, filtros);

    const [items, total] = await qb
      .take(pageSize)
      .skip(offset)
      .getManyAndCount();

    return {
      items,
      ...paginacionMeta(pagina, pageSize, total),
    };
  }

  async obtenerPorEstado(params: {
    pagina?: string;
    pageSize?: string;
    estados?: string;
  }) {
    const pagina = Math.max(Number(params.pagina) || 1, 1);
    const pageSize = Math.max(Number(params.pageSize) || 10, 1);

    const columnasPorDefecto = [
      'Asignado',
      'En proceso',
      'Resuelto',
      'Cerrado',
    ];
    const nombres =
      params.estados
        ?.split(',')
        .map((n) => n.trim())
        .filter(Boolean) || columnasPorDefecto;

    const estados = await this.listarEstados(nombres);

    const columnas: Array<{
      id_estado: number;
      titulo: string;
      color: string | null;
      pagina: number;
      pageSize: number;
      total: number;
      totalPaginas: number;
      items: Ticket[];
    }> = [];

    for (const estado of estados) {
      const [items, total] = await this.repo.findAndCount({
        where: { id_estado: estado.id_estado },
        relations: {
          usuario: true,
          responsable: true,
          equipo: true,
          categoria: true,
          prioridad: true,
          estado: true,
        },
        order: { fecha_creacion: 'DESC' },
        take: pageSize,
        skip: (pagina - 1) * pageSize,
      });

      columnas.push({
        id_estado: estado.id_estado,
        titulo: estado.nombre.toUpperCase(),
        color: estado.color,
        pagina,
        pageSize,
        total,
        totalPaginas: Math.ceil(total / pageSize),
        items,
      });
    }

    return { columnas };
  }

  async porEstado(idEstadoParam: string, filtros: Record<string, string> = {}) {
    const limit = Math.max(Number(filtros.limit) || 5, 1);
    const offset = Math.max(Number(filtros.offset) || 0, 0);

    const idEstado = await this.resolverIdEstado(idEstadoParam);
    if (!idEstado)
      throw new NotFoundException(`Estado "${idEstadoParam}" no encontrado`);

    const qb = this.repo
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.usuario', 'usuario')
      .leftJoinAndSelect('t.responsable', 'responsable')
      .leftJoinAndSelect('t.equipo', 'equipo')
      .leftJoinAndSelect('t.categoria', 'categoria')
      .leftJoinAndSelect('t.prioridad', 'prioridad')
      .leftJoinAndSelect('t.estado', 'estado')
      .where('t.id_estado = :idEstado', { idEstado })
      .orderBy('t.fecha_creacion', 'DESC')
      .take(limit)
      .skip(offset);

    this.aplicarFiltros(qb, filtros, false);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, limit, offset };
  }

  async detalle(id: number) {
    const t = await this.findOne(id);
    return {
      id_ticket: t.id_ticket,
      codigo: t.codigo,
      asunto: t.asunto,
      descripcion: t.descripcion,
      solucion: t.solucion,
      en_proceso: t.estado ? /proceso/i.test(t.estado.nombre) : false,
      prioridad_alta: t.prioridad ? /alta/i.test(t.prioridad.nombre) : false,
      estado: t.estado,
      prioridad: t.prioridad,
      categoria: t.categoria,
      usuario: t.usuario,
      responsable: t.responsable,
      hardware: t.equipo,
      fechas: {
        fecha_creacion: t.fecha_creacion,
        fecha_asignacion: t.fecha_asignacion,
        fecha_inicio: t.fecha_inicio,
        fecha_resolucion: t.fecha_resolucion,
        fecha_cierre: t.fecha_cierre,
        fecha_conformidad: t.fecha_conformidad,
      },
      conformidad: t.conformidad,
      usuario_conformidad: t.usuario_conformidad,
      comentario_conformidad: t.comentario_conformidad,
      comentarios: t.comentarios,
      adjuntos: t.adjuntos,
      historial: t.historial,
    };
  }

  async findOne(id: number) {
    const ticket = await this.repo.findOne({
      where: { id_ticket: id },
      relations: {
        usuario: { area: true },
        responsable: true,
        equipo: true,
        categoria: true,
        prioridad: true,
        estado: true,
        usuario_conformidad: true,
        comentarios: true,
        adjuntos: true,
        historial: { usuario: true },
      },
      order: { comentarios: { fecha: 'ASC' }, historial: { fecha: 'ASC' } },
    });
    if (!ticket) throw new NotFoundException(`Ticket ${id} no encontrado`);
    return ticket;
  }

  async create(dto: CreateTicketDto, idUsuarioAccion?: number) {
    const idTicket = await this.dataSource.transaction(async (manager) => {
      const codigo = await this.generarCodigo(manager);
      const ticket = manager.create(Ticket, {
        ...dto,
        codigo,
        id_estado: dto.id_estado ?? (await this.estadoId(manager, 'Nuevo')),
      });
      const guardado = await manager.save(ticket);

      await manager.save(
        this.historialService.nuevaEntidad({
          id_ticket: guardado.id_ticket,
          id_usuario: idUsuarioAccion ?? dto.id_usuario,
          accion: 'Creación',
          detalle: `Ticket ${codigo} creado`,
        }),
      );

      return guardado.id_ticket;
    });

    const creado = await this.findOne(idTicket);
    this.socketGateway.emitirTicket('created', creado);
    return creado;
  }

  async update(id: number, dto: UpdateTicketDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    const actualizado = await this.findOne(id);
    this.socketGateway.emitirTicket('updated', actualizado);
    return actualizado;
  }

  async asignar(id: number, dto: AsignarTicketDto, idUsuarioAccion?: number) {
    await this.findOne(id);
    await this.dataSource.transaction(async (manager) => {
      await manager.update(Ticket, id, {
        id_responsable: dto.id_responsable,
        id_estado: await this.estadoId(manager, 'Asignado'),
        fecha_asignacion: new Date(),
      });
      await manager.save(
        this.historialService.nuevaEntidad({
          id_ticket: id,
          id_usuario: idUsuarioAccion,
          accion: 'Asignación',
          detalle: `Ticket asignado al responsable ${dto.id_responsable}`,
        }),
      );
    });
    const actualizado = await this.findOne(id);
    this.socketGateway.emitirTicket('updated', actualizado);
    return actualizado;
  }

  async iniciar(id: number, idUsuarioAccion?: number) {
    await this.findOne(id);
    await this.dataSource.transaction(async (manager) => {
      await manager.update(Ticket, id, {
        id_estado: await this.estadoId(manager, 'En proceso'),
        fecha_inicio: new Date(),
      });
      await manager.save(
        this.historialService.nuevaEntidad({
          id_ticket: id,
          id_usuario: idUsuarioAccion,
          accion: 'Inicio de trabajo',
        }),
      );
    });
    const actualizado = await this.findOne(id);
    this.socketGateway.emitirTicket('updated', actualizado);
    return actualizado;
  }

  async resolver(id: number, dto: ResolverTicketDto, idUsuarioAccion?: number) {
    await this.findOne(id);
    await this.dataSource.transaction(async (manager) => {
      await manager.update(Ticket, id, {
        id_estado: await this.estadoId(manager, 'Resuelto'),
        solucion: dto.solucion,
        fecha_resolucion: new Date(),
      });
      await manager.save(
        this.historialService.nuevaEntidad({
          id_ticket: id,
          id_usuario: idUsuarioAccion,
          accion: 'Resolución',
          detalle: dto.solucion,
        }),
      );
    });
    return this.findOne(id);
  }

  async cerrar(id: number, idUsuarioAccion?: number) {
    await this.findOne(id);
    await this.dataSource.transaction(async (manager) => {
      await manager.update(Ticket, id, {
        id_estado: await this.estadoId(manager, 'Cerrado'),
        fecha_cierre: new Date(),
      });
      await manager.save(
        this.historialService.nuevaEntidad({
          id_ticket: id,
          id_usuario: idUsuarioAccion,
          accion: 'Cierre',
        }),
      );
    });
    const actualizado = await this.findOne(id);
    this.socketGateway.emitirTicket('updated', actualizado);
    return actualizado;
  }

  async conformidad(
    id: number,
    dto: ConformidadTicketDto,
    idUsuarioAccion?: number,
  ) {
    const ticket = await this.findOne(id);
    const estadoActual = ticket.estado?.nombre?.toLowerCase();
    if (estadoActual !== 'resuelto') {
      throw new BadRequestException(
        'Solo se puede registrar conformidad en tickets resueltos',
      );
    }

    await this.dataSource.transaction(async (manager) => {
      const datos: Record<string, unknown> = {
        conformidad: dto.conformidad,
        id_usuario_conformidad: idUsuarioAccion ?? null,
        fecha_conformidad: new Date(),
        comentario_conformidad: dto.comentario_conformidad ?? null,
      };

      if (dto.conformidad === 'no_conforme') {
        datos.id_estado = await this.estadoId(manager, 'En proceso');
        datos.fecha_resolucion = null;
      }

      await manager.update(Ticket, id, datos);

      const conforme = dto.conformidad === 'conforme';
      await manager.save(
        this.historialService.nuevaEntidad({
          id_ticket: id,
          id_usuario: idUsuarioAccion,
          accion: conforme ? 'Conformidad aprobada' : 'Conformidad rechazada',
          detalle:
            dto.comentario_conformidad ||
            (conforme
              ? 'El area solicitante dio conformidad'
              : 'El area solicitante marco No Conforme'),
        }),
      );
    });

    const actualizado = await this.findOne(id);
    this.socketGateway.emitirTicket('updated', actualizado);
    return actualizado;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    this.socketGateway.emitirEliminado(id);
    return { message: 'Ticket eliminado' };
  }

  private async query<U>(
    manager: EntityManager,
    sql: string,
    params?: unknown[],
  ): Promise<U> {
    return await manager.query(sql, params);
  }

  private async estadoId(
    manager: EntityManager,
    nombre: string,
  ): Promise<number> {
    const id = await this.buscarEstadoId(nombre, manager);
    if (!id)
      throw new BadRequestException(
        `No existe el estado "${nombre}" en la tabla estados`,
      );
    return id;
  }

  private async buscarEstadoId(
    nombre: string,
    manager?: EntityManager,
  ): Promise<number | undefined> {
    const gestor = manager ?? this.dataSource.manager;
    const filas = await this.query<Array<{ id_estado: number }>>(
      gestor,
      `SELECT id_estado FROM estados WHERE LOWER(nombre) = LOWER($1) LIMIT 1`,
      [nombre],
    );
    if (!filas.length) return undefined;
    return Number(filas[0].id_estado);
  }

  private async resolverIdEstado(
    parametro: string,
  ): Promise<number | undefined> {
    if (/^\d+$/.test(parametro)) return Number(parametro);
    return this.buscarEstadoId(parametro);
  }

  private async listarEstados(nombres: string[]) {
    if (!nombres.length) return [];

    const parametros = nombres.map((_, i) => `LOWER($${i + 1})`).join(', ');
    const filas = await this.query<
      Array<{ id_estado: number; nombre: string; color: string | null }>
    >(
      this.dataSource.manager,
      `SELECT id_estado, nombre, color FROM estados WHERE LOWER(nombre) IN (${parametros})`,
      nombres,
    );

    const porNombre = new Map(
      filas.map((f) => [String(f.nombre).toLowerCase(), f] as const),
    );
    return nombres
      .map((n) => porNombre.get(n.toLowerCase()))
      .filter(
        (e): e is { id_estado: number; nombre: string; color: string | null } =>
          Boolean(e),
      );
  }

  private aplicarFiltros(
    qb: SelectQueryBuilder<Ticket>,
    filtros: Record<string, string>,
    incluirEstado = true,
  ) {
    if (incluirEstado && filtros.id_estado)
      qb.andWhere('t.id_estado = :idEstado', {
        idEstado: filtros.id_estado,
      });
    if (filtros.id_usuario)
      qb.andWhere('t.id_usuario = :idUsuario', {
        idUsuario: filtros.id_usuario,
      });
    if (filtros.id_responsable)
      qb.andWhere('t.id_responsable = :idResponsable', {
        idResponsable: filtros.id_responsable,
      });
    if (filtros.id_categoria)
      qb.andWhere('t.id_categoria = :idCategoria', {
        idCategoria: filtros.id_categoria,
      });
    if (filtros.id_prioridad)
      qb.andWhere('t.id_prioridad = :idPrioridad', {
        idPrioridad: filtros.id_prioridad,
      });
    if (filtros.asunto)
      qb.andWhere('LOWER(t.asunto) LIKE :asunto', {
        asunto: `%${filtros.asunto.toLowerCase()}%`,
      });
    if (filtros.codigo)
      qb.andWhere('LOWER(t.codigo) LIKE :codigo', {
        codigo: `%${filtros.codigo.toLowerCase()}%`,
      });
  }

  private async generarCodigo(manager: EntityManager): Promise<string> {
    const resultado = await this.query<Array<{ maximo: number }>>(
      manager,
      `SELECT COALESCE(MAX(CAST(SUBSTRING(codigo FROM '[0-9]+') AS INTEGER)), 0) AS maximo FROM tickets`,
    );
    const siguiente = Number(resultado[0]?.maximo || 0) + 1;
    return `TCK-${String(siguiente).padStart(6, '0')}`;
  }
}
