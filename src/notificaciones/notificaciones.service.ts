import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion } from './entities/notificacion.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import {
  obtenerParametrosPaginacion,
  paginacionMeta,
} from '../common/paginacion.util';

export interface CrearNotificacion {
  id_usuario: number;
  id_ticket?: number;
  tipo: string;
  titulo: string;
  mensaje: string;
}

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly repo: Repository<Notificacion>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async findAll(filtros: Record<string, string> = {}, idUsuario?: number) {
    const { pagina, pageSize, offset } = obtenerParametrosPaginacion(
      filtros,
      10,
    );

    const qb = this.repo
      .createQueryBuilder('n')
      .leftJoinAndSelect('n.usuario', 'usuario')
      .leftJoinAndSelect('usuario.area', 'area')
      .leftJoinAndSelect('n.ticket', 'ticket')
      .orderBy('n.fecha_creacion', 'DESC');

    if (idUsuario)
      qb.andWhere('n.id_usuario = :idUsuario', { idUsuario });

    const [items, total] = await qb
      .take(pageSize)
      .skip(offset)
      .getManyAndCount();

    return {
      items,
      ...paginacionMeta(pagina, pageSize, total),
    };
  }

  async misNotificaciones(
    idUsuario: number,
    filtros: Record<string, string> = {},
  ) {
    return this.findAll(filtros, idUsuario);
  }

  async contarNoLeidas(idUsuario: number): Promise<number> {
    return this.repo.count({
      where: { id_usuario: idUsuario, leida: false },
    });
  }

  async crear(datos: CrearNotificacion): Promise<Notificacion> {
    return this.repo.save(this.repo.create(datos));
  }

  async marcarLeida(
    id: number,
    idUsuario: number,
    puedeVerTodas = false,
  ): Promise<Notificacion> {
    const notificacion = await this.repo.findOne({
      where: {
        id_notificacion: id,
        ...(puedeVerTodas ? {} : { id_usuario: idUsuario }),
      },
    });
    if (!notificacion)
      throw new NotFoundException(`Notificación ${id} no encontrada`);
    notificacion.leida = true;
    return this.repo.save(notificacion);
  }

  async marcarTodasLeidas(idUsuario: number) {
    await this.repo.update({ id_usuario: idUsuario }, { leida: true });
    return { message: 'Todas las notificaciones marcadas como leídas' };
  }

  async usuariosPorRoles(
    roles: string[],
    exceptoId?: number,
  ): Promise<Usuario[]> {
    const qb = this.usuarioRepo
      .createQueryBuilder('u')
      .innerJoinAndSelect('u.rol', 'rol')
      .where('u.estado_registro = 1')
      .andWhere('LOWER(rol.nombre) IN (:...roles)', {
        roles: roles.map((r) => r.toLowerCase()),
      });
    if (exceptoId) qb.andWhere('u.id_usuario != :exceptoId', { exceptoId });
    return qb.getMany();
  }
}