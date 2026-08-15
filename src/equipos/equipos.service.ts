import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Equipo } from './entities/equipo.entity';
import { CreateEquipoDto, UpdateEquipoDto } from './dto/equipo.dto';
import {
  obtenerParametrosPaginacion,
  paginacionMeta,
} from '../common/paginacion.util';

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo)
    private readonly repo: Repository<Equipo>,
  ) {}

  async findAll(
    filtros: Record<string, string> = {},
    soloActivos: boolean = true,
  ) {
    const { pagina, pageSize, offset } = obtenerParametrosPaginacion(
      filtros,
      10,
    );

    const q = (filtros.q ?? '').trim();
    const id_usuario = filtros.id_usuario ? Number(filtros.id_usuario) : undefined;

    const estadoFiltro = soloActivos
      ? 'equipo.estado_registro = 1'
      : 'equipo.estado_registro != 0';

    const qb = this.repo
      .createQueryBuilder('equipo')
      .leftJoinAndSelect('equipo.usuario', 'usuario')
      .leftJoinAndSelect('equipo.tickets', 'tickets')
      .andWhere(estadoFiltro)
      .orderBy('equipo.id_equipo', 'DESC')
      .take(pageSize)
      .skip(offset);

    if (id_usuario) {
      qb.andWhere('equipo.id_usuario = :id_usuario', { id_usuario });
    }

    if (q) {
      qb.andWhere(
        `(equipo.codigo_patrimonial ILIKE :q
          OR equipo.nombre_equipo ILIKE :q
          OR equipo.marca ILIKE :q
          OR equipo.modelo ILIKE :q
          OR equipo.serie ILIKE :q
          OR equipo.imei ILIKE :q
          OR equipo.numero_telefonico ILIKE :q
          OR CONCAT(usuario.nombres, ' ', usuario.apellidos) ILIKE :q)`,
        { q: `%${q}%` },
      );
    }

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      ...paginacionMeta(pagina, pageSize, total),
    };
  }

  async findOne(id: number) {
    const equipo = await this.repo.findOne({
      where: { id_equipo: id },
      relations: { usuario: true, tickets: true },
    });
    if (!equipo) throw new NotFoundException(`Equipo ${id} no encontrado`);
    return equipo;
  }

  create(dto: CreateEquipoDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateEquipoDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.update(id, { estado_registro: 0 });
    return { message: 'Equipo eliminado' };
  }
}
