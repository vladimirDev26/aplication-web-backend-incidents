import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import {
  obtenerParametrosPaginacion,
  paginacionMeta,
} from '../common/paginacion.util';

export interface FiltroReporte {
  fecha_desde?: string;
  fecha_hasta?: string;
  id_estado?: string;
  id_prioridad?: string;
  id_categoria?: string;
  id_area?: string;
  id_responsable?: string;
  pagina?: string;
  pageSize?: string;
}

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Ticket)
    private readonly repo: Repository<Ticket>,
    private readonly dataSource: DataSource,
  ) {}

  async generar(filtros: FiltroReporte = {}, rolActual?: string) {
    if (rolActual !== 'Administrador') {
      throw new ForbiddenException(
        'Solo el administrador puede generar reportes',
      );
    }

    const { pagina, pageSize, offset } = obtenerParametrosPaginacion(
      filtros as Record<string, string>,
      10,
    );

    const [resumen, totalTecnicos, totalUsuarios] = await Promise.all([
      this.resumenTickets(filtros),
      this.totalTecnicos(),
      this.totalUsuarios(),
    ]);

    const detalle = await this.detalleTickets(
      filtros,
      pageSize,
      offset,
      pagina,
    );

    return {
      resumen,
      detalle,
      totalTecnicos,
      totalUsuarios,
    };
  }

  private aplicarFiltros(
    qb: SelectQueryBuilder<Ticket>,
    filtros: FiltroReporte,
  ) {
    qb.andWhere('t.estado_registro = 1');
    if (filtros.fecha_desde)
      qb.andWhere('t.fecha_creacion >= :fechaDesde', {
        fechaDesde: new Date(filtros.fecha_desde),
      });
    if (filtros.fecha_hasta)
      qb.andWhere('t.fecha_creacion <= :fechaHasta', {
        fechaHasta: new Date(filtros.fecha_hasta),
      });
    if (filtros.id_estado)
      qb.andWhere('t.id_estado = :idEstado', {
        idEstado: Number(filtros.id_estado),
      });
    if (filtros.id_prioridad)
      qb.andWhere('t.id_prioridad = :idPrioridad', {
        idPrioridad: Number(filtros.id_prioridad),
      });
    if (filtros.id_categoria)
      qb.andWhere('t.id_categoria = :idCategoria', {
        idCategoria: Number(filtros.id_categoria),
      });
    if (filtros.id_area)
      qb.andWhere(
        't.id_usuario IN (SELECT u2.id_usuario FROM usuarios u2 WHERE u2.id_area = :idArea)',
        { idArea: Number(filtros.id_area) },
      );
    if (filtros.id_responsable)
      qb.andWhere('t.id_responsable = :idResponsable', {
        idResponsable: Number(filtros.id_responsable),
      });
  }

  private async resumenTickets(filtros: FiltroReporte) {
    const qbBase = () => {
      const qb = this.repo.createQueryBuilder('t');
      this.aplicarFiltros(qb, filtros);
      return qb;
    };

    const porEstadoQb = qbBase()
      .select('e.nombre', 'name')
      .addSelect('COUNT(*)', 'value')
      .leftJoin('t.estado', 'e')
      .groupBy('e.nombre')
      .orderBy('COUNT(*)', 'DESC');

    const porPrioridadQb = qbBase()
      .select('p.nombre', 'name')
      .addSelect('COUNT(*)', 'value')
      .leftJoin('t.prioridad', 'p')
      .groupBy('p.nombre')
      .orderBy('COUNT(*)', 'DESC');

    const porCategoriaQb = qbBase()
      .select('c.nombre', 'name')
      .addSelect('COUNT(*)', 'value')
      .leftJoin('t.categoria', 'c')
      .groupBy('c.nombre')
      .orderBy('COUNT(*)', 'DESC');

    const porAreaQb = qbBase()
      .select('a.nombre', 'name')
      .addSelect('COUNT(*)', 'value')
      .leftJoin('t.usuario', 'u')
      .leftJoin('u.area', 'a')
      .groupBy('a.nombre')
      .orderBy('COUNT(*)', 'DESC')
      .andWhere('a.id_area IS NOT NULL');

    const [estadosRaw, prioridadesRaw, categoriasRaw, areasRaw] =
      await Promise.all([
        porEstadoQb.getRawMany(),
        porPrioridadQb.getRawMany(),
        porCategoriaQb.getRawMany(),
        porAreaQb.getRawMany(),
      ]);

    const estados: Record<string, number> = {
      Nuevo: 0,
      Asignado: 0,
      'En proceso': 0,
      Resuelto: 0,
      Cerrado: 0,
    };
    for (const f of estadosRaw) {
      const n = String(f.name ?? '');
      if (n in estados) estados[n] = Number(f.value ?? 0);
    }

    const conteoSla = await this.conteoSla(filtros);
    const cargaTrabajo = await this.cargaTrabajo(filtros);

    return {
      total: Object.values(estados).reduce((a, b) => a + b, 0),
      estados,
      porPrioridad: prioridadesRaw.map((f) => ({
        name: String(f.name ?? '—'),
        value: Number(f.value ?? 0),
      })),
      porCategoria: categoriasRaw.map((f) => ({
        name: String(f.name ?? '—'),
        value: Number(f.value ?? 0),
      })),
      porArea: areasRaw.map((f) => ({
        name: String(f.name ?? '—'),
        value: Number(f.value ?? 0),
      })),
      pendientes: (estados.Nuevo ?? 0) + (estados.Asignado ?? 0),
      enProceso: estados['En proceso'] ?? 0,
      resueltos: estados.Resuelto ?? 0,
      cerrados: estados.Cerrado ?? 0,
      conteoSla,
      cargaTrabajo,
    };
  }

  private async conteoSla(filtros: FiltroReporte) {
    const qb = this.repo.createQueryBuilder('t');
    this.aplicarFiltros(qb, filtros);
    qb
      .select([
        't.id_ticket',
        't.fecha_creacion',
        't.fecha_resolucion',
        't.fecha_cierre',
        'e.nombre',
        'p.sla_respuesta_min',
        'p.sla_resolucion_min',
      ])
      .leftJoin('t.estado', 'e')
      .leftJoin('t.prioridad', 'p');

    const filas = await qb.getRawMany();
    const conteo = { vencido: 0, proximo: 0, dentro: 0 };
    const MIN = 60_000;
    const RANK: Record<string, number> = { vencido: 2, proximo: 1, dentro: 0 };
    const peor = (a: string, b: string) =>
      RANK[a] >= RANK[b] ? a : b;

    for (const f of filas) {
      const creado = f.t_fecha_creacion
        ? new Date(f.t_fecha_creacion).getTime()
        : null;
      const resolverMin = Number(f.p_sla_resolucion_min ?? 0);
      const responderMin = Number(f.p_sla_respuesta_min ?? 0);
      if (creado === null) continue;

      const limiteResolucion =
        resolverMin > 0 ? creado + resolverMin * MIN : null;
      const limiteRespuesta =
        responderMin > 0 ? creado + responderMin * MIN : null;

      const estado = String(f.e_nombre ?? '');
      const terminado = ['Resuelto', 'Cerrado'].includes(estado);
      const noIniciado = ['Nuevo', 'Asignado'].includes(estado);

      let respEstado = 'dentro';
      let resEstado = 'dentro';

      if (terminado) {
        const fin = f.t_fecha_resolucion
          ? new Date(f.t_fecha_resolucion).getTime()
          : f.t_fecha_cierre
            ? new Date(f.t_fecha_cierre).getTime()
            : null;
        resEstado =
          fin !== null && limiteResolucion !== null && fin > limiteResolucion
            ? 'vencido'
            : 'dentro';
      } else {
        const ahora = Date.now();
        if (limiteResolucion !== null) {
          if (ahora > limiteResolucion) resEstado = 'vencido';
          else {
            const umbral = resolverMin * MIN * 0.25;
            resEstado =
              limiteResolucion - ahora <= umbral ? 'proximo' : 'dentro';
          }
        }
        if (responderMin > 0 && limiteRespuesta !== null && noIniciado) {
          if (ahora > limiteRespuesta) respEstado = 'vencido';
          else {
            const umbral = responderMin * MIN * 0.25;
            respEstado =
              limiteRespuesta - ahora <= umbral ? 'proximo' : 'dentro';
          }
        }
      }

      const final = peor(respEstado, resEstado) as keyof typeof conteo;
      conteo[final] += 1;
    }

    return conteo;
  }

  private async cargaTrabajo(filtros: FiltroReporte) {
    const filas = await this.query<Array<{
      id_usuario: number;
      nombres: string;
      apellidos: string;
    }>>(
      `SELECT u.id_usuario, u.nombres, u.apellidos
         FROM usuarios u
         JOIN roles r ON r.id_rol = u.id_rol
        WHERE u.estado_registro = 1
          AND LOWER(r.nombre) IN ('tecnico', 'soporte')
        ORDER BY u.nombres ASC`,
      [],
    );

    const result = await Promise.all(
      filas.map(async (f) => {
        const porEstado = await this.conteosPorTecnico(
          f.id_usuario,
          filtros,
        );
        return {
          id_usuario: Number(f.id_usuario),
          nombre: `${f.nombres} ${f.apellidos}`,
          asignados: porEstado['Asignado'],
          pendientes: (porEstado['Nuevo'] ?? 0) + (porEstado['Asignado'] ?? 0),
          enProceso: porEstado['En proceso'],
          resuelto: porEstado['Resuelto'],
          cerrado: porEstado['Cerrado'],
        };
      }),
    );

    return result;
  }

  private async conteosPorTecnico(
    idUsuario: number,
    filtros: FiltroReporte,
  ): Promise<Record<string, number>> {
    const qb = this.repo.createQueryBuilder('t')
      .select('e.nombre', 'name')
      .addSelect('COUNT(*)', 'value')
      .leftJoin('t.estado', 'e')
      .andWhere('t.id_responsable = :idResp', { idResp: idUsuario });
    this.aplicarFiltros(qb, filtros);
    qb.groupBy('e.nombre');

    const filas = await qb.getRawMany();
    const conteo: Record<string, number> = {
      Nuevo: 0,
      Asignado: 0,
      'En proceso': 0,
      Resuelto: 0,
      Cerrado: 0,
    };
    for (const f of filas) {
      const n = String(f.name ?? '');
      if (n in conteo) conteo[n] = Number(f.value ?? 0);
    }
    return conteo;
  }

  private async detalleTickets(
    filtros: FiltroReporte,
    pageSize: number,
    offset: number,
    pagina: number,
  ) {
    const qb = this.repo
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.usuario', 'usuario')
      .leftJoinAndSelect('t.responsable', 'responsable')
      .leftJoinAndSelect('t.categoria', 'categoria')
      .leftJoinAndSelect('t.prioridad', 'prioridad')
      .leftJoinAndSelect('t.estado', 'estado');
    this.aplicarFiltros(qb, filtros);
    qb.orderBy('t.fecha_creacion', 'DESC');

    const [items, total] = await qb
      .take(pageSize)
      .skip(offset)
      .getManyAndCount();

    return {
      items,
      ...paginacionMeta(pagina, pageSize, total),
    };
  }

  private async totalTecnicos(): Promise<number> {
    const filas = await this.query<Array<{ cantidad: string }>>(
      `SELECT COUNT(*) AS cantidad
         FROM usuarios u
         JOIN roles r ON r.id_rol = u.id_rol
        WHERE u.estado_registro = 1
          AND LOWER(r.nombre) IN ('tecnico', 'soporte')`,
      [],
    );
    return Number(filas[0]?.cantidad ?? 0);
  }

  private async totalUsuarios(): Promise<number> {
    const filas = await this.query<Array<{ cantidad: string }>>(
      `SELECT COUNT(*) AS cantidad FROM usuarios WHERE estado_registro = 1`,
      [],
    );
    return Number(filas[0]?.cantidad ?? 0);
  }

  private async query<U>(sql: string, params: unknown[]): Promise<U> {
    return await this.dataSource.manager.query(sql, params);
  }
}