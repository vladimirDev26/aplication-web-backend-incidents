import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findAll(filtros: Record<string, string> = {}) {
    const { pagina, pageSize, offset } = obtenerParametrosPaginacion(
      filtros,
      10,
    );

    const [items, total] = await this.repo.findAndCount({
      relations: { usuario: true, tickets: true },
      order: { id_equipo: 'DESC' },
      take: pageSize,
      skip: offset,
    });

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
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: 'Equipo eliminado' };
  }
}
