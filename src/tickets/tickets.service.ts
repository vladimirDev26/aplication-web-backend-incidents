import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  Not,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
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
import { NotificacionesService } from '../notificaciones/notificaciones.service';

const ROLES_GRUPO = ['Administrador', 'Jefe', 'Soporte'];

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly repo: Repository<Ticket>,
    private readonly historialService: HistorialService,
    private readonly socketGateway: TicketsGateway,
    private readonly notificacionesService: NotificacionesService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    filtros: Record<string, string> = {},
    soloActivos = true,
    idUsuarioActual?: number,
    rolActual?: string,
  ) {
    const { pagina, pageSize, offset } = obtenerParametrosPaginacion(
      filtros,
      10,
    );

    const estadoFiltro = soloActivos ? 't.estado_registro = 1' : 't.estado_registro != 0';

    const qb = this.repo
      .createQueryBuilder('t')
      .andWhere(estadoFiltro)
      .leftJoinAndSelect('t.usuario', 'usuario')
      .leftJoinAndSelect('t.responsable', 'responsable')
      .leftJoinAndSelect('t.equipo', 'equipo')
      .leftJoinAndSelect('t.categoria', 'categoria')
      .leftJoinAndSelect('t.prioridad', 'prioridad')
      .leftJoinAndSelect('t.estado', 'estado')
      .addSelect(
        (subQuery) =>
          subQuery
            .select('COUNT(a.id_adjunto)', 'count')
            .from('adjuntos', 'a')
            .where('a.id_ticket = t.id_ticket'),
        'adjuntosCount',
      )
      .addSelect(
        (subQuery) =>
          subQuery
            .select('a.url')
            .from('adjuntos', 'a')
            .where('a.id_ticket = t.id_ticket')
            .orderBy('a.fecha', 'ASC')
            .limit(1),
        'primerAdjuntoUrl',
      )
      .addSelect(
        (subQuery) =>
          subQuery
            .select('a.extension')
            .from('adjuntos', 'a')
            .where('a.id_ticket = t.id_ticket')
            .orderBy('a.fecha', 'ASC')
            .limit(1),
        'primerAdjuntoExt',
      )
      .orderBy('t.fecha_creacion', 'DESC');

    this.aplicarFiltros(qb, filtros);
    this.aplicarRestriccionVisibilidad(qb, idUsuarioActual, rolActual);

    const countQb = this.repo.createQueryBuilder('t').andWhere(estadoFiltro);
    this.aplicarFiltros(countQb, filtros);
    this.aplicarRestriccionVisibilidad(countQb, idUsuarioActual, rolActual);
    const total = await countQb.getCount();

    const result = await qb.take(pageSize).skip(offset).getRawAndEntities();
    const items = result.entities.map((e, i) => ({
      ...e,
      adjuntosCount: Number(result.raw[i]?.adjuntosCount ?? 0),
      primerAdjuntoUrl: result.raw[i]?.primerAdjuntoUrl || null,
      primerAdjuntoExt: result.raw[i]?.primerAdjuntoExt || null,
    }));

    return {
      items,
      ...paginacionMeta(pagina, pageSize, total),
    };
  }

  async obtenerPorEstado(params: {
    pagina?: string;
    pageSize?: string;
    estados?: string;
  }, soloActivos = true, idUsuarioActual?: number, rolActual?: string) {
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
      const where: Record<string, unknown> = {
        id_estado: estado.id_estado,
        estado_registro: soloActivos ? 1 : Not(0),
      };
      this.aplicarRestriccionVisibilidadObjeto(where, idUsuarioActual, rolActual);
      const [items, total] = await this.repo.findAndCount({
        where,
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

  async porEstado(idEstadoParam: string, filtros: Record<string, string> = {}, soloActivos = true, idUsuarioActual?: number, rolActual?: string) {
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
      .andWhere(
        soloActivos ? 't.estado_registro = 1' : 't.estado_registro != 0',
      )
      .orderBy('t.fecha_creacion', 'DESC')
      .take(limit)
      .skip(offset);

    this.aplicarFiltros(qb, filtros, false);
    this.aplicarRestriccionVisibilidad(qb, idUsuarioActual, rolActual);

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
    let autoasignado = false;
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

      if (!dto.id_responsable) {
        const tecnico = await this.buscarTecnicoPorCategoria(
          manager,
          dto.id_categoria,
        );
        if (tecnico) {
          autoasignado = true;
          await manager.update(Ticket, guardado.id_ticket, {
            id_responsable: tecnico.id_usuario,
            id_estado: await this.estadoId(manager, 'Asignado'),
            fecha_asignacion: new Date(),
          });
          await manager.save(
            this.historialService.nuevaEntidad({
              id_ticket: guardado.id_ticket,
              id_usuario: tecnico.id_usuario,
              accion: 'Asignación automática',
              detalle: `Ticket ${codigo} asignado automáticamente a ${tecnico.nombres} ${tecnico.apellidos} por especialidad`,
            }),
          );
        }
      }

      return guardado.id_ticket;
    });

    const creado = await this.findOne(idTicket);
    this.socketGateway.emitirTicket('created', creado);
    await this.notificar('nuevo', creado);
    if (autoasignado) await this.notificar('asignado', creado);
    return creado;
  }

  async autoasignarPendientes(idUsuario: number): Promise<number> {
    const usuario = await this.dataSource.manager.findOne(Usuario, {
      where: { id_usuario: idUsuario },
      relations: { rol: true },
    });
    if (!usuario || usuario.estado_registro !== 1) return 0;
    const rol = (usuario.rol?.nombre ?? '').toLowerCase();
    if (rol !== 'tecnico' && rol !== 'soporte') return 0;

    const filas = await this.query<Array<{ id_ticket: number }>>(
      this.dataSource.manager,
      `SELECT t.id_ticket
         FROM tickets t
         JOIN categorias c ON c.id_categoria = t.id_categoria
         JOIN estados e ON e.id_estado = t.id_estado
         JOIN usuarios_especialidades ue ON ue.id_usuario = $1
         JOIN especialidades esp ON esp.id_especialidad = ue.id_especialidad
         WHERE t.estado_registro = 1
           AND t.id_responsable IS NULL
           AND LOWER(e.nombre) = 'nuevo'
           AND LOWER(esp.nombre) = LOWER(c.nombre)
         ORDER BY t.fecha_creacion ASC`,
      [idUsuario],
    );

    let asignados = 0;
    for (const fila of filas) {
      await this.asignar(fila.id_ticket, { id_responsable: idUsuario }, idUsuario);
      asignados++;
    }
    return asignados;
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
    await this.notificar('asignado', actualizado);
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
    await this.notificar('en_proceso', actualizado);
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
    const actualizado = await this.findOne(id);
    this.socketGateway.emitirTicket('updated', actualizado);
    await this.notificar('resuelto', actualizado);
    return actualizado;
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
    await this.notificar('cerrado', actualizado);
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
    await this.notificar(
      dto.conformidad === 'conforme' ? 'conformidad' : 'no_conforme',
      actualizado,
    );
    return actualizado;
  }

  async remove(id: number) {
    await this.repo.update(id, { estado_registro: 0 });
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

  private async notificar(
    accion:
      | 'nuevo'
      | 'asignado'
      | 'en_proceso'
      | 'resuelto'
      | 'cerrado'
      | 'conformidad'
      | 'no_conforme',
    t: Ticket,
  ) {
    const solicitante = t.usuario;
    const responsable = t.responsable
      ? `${t.responsable.nombres} ${t.responsable.apellidos}`
      : '—';
    const nombreSolicitante = solicitante
      ? `${solicitante.nombres} ${solicitante.apellidos}`
      : '—';
    const area = solicitante?.area ? solicitante.area.nombre : '—';
    const prioridad = t.prioridad?.nombre ?? '—';
    const codigo = t.codigo;

    let idsDestino = new Set<number>();
    let tipoDefault = '';
    let tituloDefault = '';
    let mensajeDefault = '';

    const responsableId = t.responsable?.id_usuario;
    const solicitanteId = t.id_usuario;

    if (accion === 'nuevo') {
      const grupo = await this.notificacionesService.usuariosPorRoles(
        ROLES_GRUPO,
        solicitanteId,
      );
      idsDestino = new Set(grupo.map((u) => u.id_usuario));
      tipoDefault = 'ticket.nuevo';
      tituloDefault = 'Nueva incidencia';
      mensajeDefault = `Nueva incidencia N° ${codigo} — Solicitante: ${nombreSolicitante} · Área: ${area} · Prioridad: ${prioridad}`;
    } else if (accion === 'asignado') {
      if (responsableId) idsDestino.add(responsableId);
      if (solicitanteId) idsDestino.add(solicitanteId);
      tipoDefault = 'ticket.asignado';
      tituloDefault = 'Incidencia asignada';
      mensajeDefault = '';
    } else if (accion === 'en_proceso' || accion === 'resuelto') {
      if (solicitanteId) idsDestino.add(solicitanteId);
      const grupo = await this.notificacionesService.usuariosPorRoles(
        ROLES_GRUPO,
      );
      for (const u of grupo) idsDestino.add(u.id_usuario);
      tipoDefault =
        accion === 'en_proceso' ? 'ticket.en_proceso' : 'ticket.resuelto';
      tituloDefault =
        accion === 'en_proceso' ? 'Incidencia en proceso' : 'Incidencia resuelta';
      mensajeDefault =
        accion === 'en_proceso'
          ? `La incidencia N° ${codigo} se encuentra en proceso. Técnico: ${responsable}`
          : `La incidencia N° ${codigo} ha sido resuelta por ${responsable}. Revise la solución y registre su conformidad.`;
    } else if (accion === 'conformidad' || accion === 'no_conforme') {
      if (responsableId) idsDestino.add(responsableId);
      const grupo = await this.notificacionesService.usuariosPorRoles(
        ROLES_GRUPO,
      );
      for (const u of grupo) idsDestino.add(u.id_usuario);
      tipoDefault =
        accion === 'conformidad' ? 'ticket.conformidad' : 'ticket.no_conforme';
      tituloDefault =
        accion === 'conformidad'
          ? 'Conformidad registrada'
          : 'Incidencia no conforme';
      mensajeDefault =
        accion === 'conformidad'
          ? `${nombreSolicitante} del área ${area} ha dado su conformidad para el Ticket N° ${codigo}.`
          : `El área indicó que el problema de la incidencia N° ${codigo} aún no ha sido solucionado y regresa a En Proceso.`;
    } else {
      if (responsableId) idsDestino.add(responsableId);
      if (solicitanteId) idsDestino.add(solicitanteId);
      tipoDefault = 'ticket.cerrado';
      tituloDefault = 'Incidencia cerrada';
      mensajeDefault = '';
    }

    for (const idUsuario of idsDestino) {
      let tipo = tipoDefault;
      let titulo = tituloDefault;
      let mensaje = mensajeDefault;

      if (accion === 'asignado') {
        if (idUsuario === responsableId) {
          titulo = 'Incidencia asignada';
          mensaje = `Se te ha asignado la incidencia N° ${codigo}. Solicitante: ${nombreSolicitante} · Área: ${area} · Prioridad: ${prioridad}`;
        } else {
          titulo = 'Técnico asignado';
          mensaje = `${responsable} ha sido asignado a tu incidencia ${codigo}`;
        }
      }

      if (accion === 'cerrado') {
        if (idUsuario === solicitanteId) {
          mensaje = `La incidencia N° ${codigo} ha sido cerrada satisfactoriamente.`;
        } else {
          mensaje = `N° Ticket ${codigo} ha sido cerrada.`;
        }
      }

      const notificacion = await this.notificacionesService.crear({
        id_usuario: idUsuario,
        id_ticket: t.id_ticket,
        tipo,
        titulo,
        mensaje,
      });
      this.socketGateway.emitirNotificacion(notificacion);
    }
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

  private async buscarTecnicoPorCategoria(
    manager: EntityManager,
    idCategoria: number,
  ): Promise<Usuario | null> {
    const filas = await this.query<Array<{ id_usuario: number }>>(
      manager,
      `SELECT u.id_usuario
         FROM usuarios u
         JOIN roles r ON r.id_rol = u.id_rol
         JOIN usuarios_especialidades ue ON ue.id_usuario = u.id_usuario
         JOIN especialidades e ON e.id_especialidad = ue.id_especialidad
         JOIN categorias c ON c.id_categoria = $1
         WHERE u.estado_registro = 1
           AND LOWER(r.nombre) IN ('tecnico', 'soporte')
           AND LOWER(e.nombre) = LOWER(c.nombre)
         ORDER BY u.id_usuario ASC
         LIMIT 1`,
      [idCategoria],
    );
    if (!filas.length) return null;
    const usuario = await manager.findOne(Usuario, {
      where: { id_usuario: filas[0].id_usuario },
    });
    return usuario ?? null;
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
    if (filtros.id_area)
      qb.andWhere(
        't.id_usuario IN (SELECT u.id_usuario FROM usuarios u WHERE u.id_area = :idArea)',
        { idArea: filtros.id_area },
      );
    if (filtros.fecha_desde)
      qb.andWhere('t.fecha_creacion >= :fechaDesde', {
        fechaDesde: new Date(filtros.fecha_desde),
      });
    if (filtros.fecha_hasta)
      qb.andWhere('t.fecha_creacion <= :fechaHasta', {
        fechaHasta: new Date(filtros.fecha_hasta),
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

  private aplicarRestriccionVisibilidad(
    qb: SelectQueryBuilder<Ticket>,
    idUsuarioActual?: number,
    rolActual?: string,
  ) {
    const rol = (rolActual ?? '').toLowerCase();
    if (rol === 'usuario final') {
      if (idUsuarioActual != null) {
        qb.andWhere('t.id_usuario = :idVisor', {
          idVisor: idUsuarioActual,
        });
      }
    } else if (rol === 'tecnico' || rol === 'soporte') {
      if (idUsuarioActual != null) {
        qb.andWhere('t.id_responsable = :idVisor', {
          idVisor: idUsuarioActual,
        });
      }
    }
  }

  private aplicarRestriccionVisibilidadObjeto(
    where: Record<string, unknown>,
    idUsuarioActual?: number,
    rolActual?: string,
  ) {
    const rol = (rolActual ?? '').toLowerCase();
    if (rol === 'usuario final') {
      if (idUsuarioActual != null) {
        where.id_usuario = idUsuarioActual;
      }
    } else if (rol === 'tecnico' || rol === 'soporte') {
      if (idUsuarioActual != null) {
        where.id_responsable = idUsuarioActual;
      }
    }
  }

  async estadisticas(
    filtros: Record<string, string> = {},
    soloActivos = true,
    idUsuarioActual?: number,
    rolActual?: string,
  ) {
    const estadoFiltro = soloActivos
      ? 't.estado_registro = 1'
      : 't.estado_registro != 0';

    const porCategoriaQb = this.repo
      .createQueryBuilder('t')
      .select('categoria.nombre', 'name')
      .addSelect('COUNT(t.id_ticket)', 'value')
      .innerJoin('t.categoria', 'categoria')
      .andWhere(estadoFiltro)
      .groupBy('categoria.nombre')
      .orderBy('COUNT(t.id_ticket)', 'DESC', 'NULLS LAST');
    this.aplicarFiltros(porCategoriaQb, filtros);
    this.aplicarRestriccionVisibilidad(porCategoriaQb, idUsuarioActual, rolActual);

    const porAreaQb = this.repo
      .createQueryBuilder('t')
      .select('area.nombre', 'name')
      .addSelect('COUNT(t.id_ticket)', 'value')
      .innerJoin('t.usuario', 'usuario')
      .innerJoin('usuario.area', 'area')
      .andWhere(estadoFiltro)
      .groupBy('area.nombre')
      .orderBy('COUNT(t.id_ticket)', 'DESC', 'NULLS LAST');
    this.aplicarFiltros(porAreaQb, filtros);
    this.aplicarRestriccionVisibilidad(porAreaQb, idUsuarioActual, rolActual);

    const [porCategoriaRaw, porAreaRaw] = await Promise.all([
      porCategoriaQb.getRawMany(),
      porAreaQb.getRawMany(),
    ]);

    const formatear = (filas: Array<{ name?: string; value?: string }>) =>
      filas
        .filter((f) => f.name)
        .map((f) => ({ name: f.name as string, value: Number(f.value ?? 0) }));

    return {
      porCategoria: formatear(porCategoriaRaw),
      porArea: formatear(porAreaRaw),
    };
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
