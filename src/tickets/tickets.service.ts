import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import {
  CreateTicketDto,
  UpdateTicketDto,
  AsignarTicketDto,
  ResolverTicketDto,
} from './dto/ticket.dto';
import { HistorialService } from '../historial/historial.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly repo: Repository<Ticket>,
    private readonly historialService: HistorialService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(filtros: Record<string, string> = {}) {
    const qb = this.repo
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.usuario', 'usuario')
      .leftJoinAndSelect('t.responsable', 'responsable')
      .leftJoinAndSelect('t.equipo', 'equipo')
      .leftJoinAndSelect('t.categoria', 'categoria')
      .leftJoinAndSelect('t.prioridad', 'prioridad')
      .leftJoinAndSelect('t.estado', 'estado')
      .leftJoinAndSelect('t.comentarios', 'comentarios')
      .leftJoinAndSelect('t.adjuntos', 'adjuntos')
      .orderBy('t.fecha_creacion', 'DESC');

    if (filtros?.id_estado)
      qb.andWhere('t.id_estado = :idEstado', {
        idEstado: filtros.id_estado,
      });
    if (filtros?.id_usuario)
      qb.andWhere('t.id_usuario = :idUsuario', {
        idUsuario: filtros.id_usuario,
      });
    if (filtros?.id_responsable)
      qb.andWhere('t.id_responsable = :idResponsable', {
        idResponsable: filtros.id_responsable,
      });
    if (filtros?.id_categoria)
      qb.andWhere('t.id_categoria = :idCategoria', {
        idCategoria: filtros.id_categoria,
      });
    if (filtros?.id_prioridad)
      qb.andWhere('t.id_prioridad = :idPrioridad', {
        idPrioridad: filtros.id_prioridad,
      });
    if (filtros?.asunto) {
      qb.andWhere('LOWER(t.asunto) LIKE :asunto', {
        asunto: `%${String(filtros.asunto).toLowerCase()}%`,
      });
    }
    if (filtros?.codigo)
      qb.andWhere('LOWER(t.codigo) LIKE :codigo', {
        codigo: `%${String(filtros.codigo).toLowerCase()}%`,
      });

    return qb.getManyAndCount();
  }

  async findOne(id: number) {
    const ticket = await this.repo.findOne({
      where: { id_ticket: id },
      relations: {
        usuario: true,
        responsable: true,
        equipo: true,
        categoria: true,
        prioridad: true,
        estado: true,
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

    return this.findOne(idTicket);
  }

  async update(id: number, dto: UpdateTicketDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
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
    return this.findOne(id);
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
    return this.findOne(id);
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
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
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
    const filas = await this.query<Array<{ id_estado: number }>>(
      manager,
      `SELECT id_estado FROM estados WHERE LOWER(nombre) = LOWER($1) LIMIT 1`,
      [nombre],
    );
    if (!filas.length)
      throw new BadRequestException(
        `No existe el estado "${nombre}" en la tabla estados`,
      );
    return Number(filas[0].id_estado);
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
