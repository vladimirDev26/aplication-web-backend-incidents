import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Sede } from './entities/sede.entity';
import { CreateSedeDto, UpdateSedeDto } from './dto/sede.dto';
import {
  obtenerParametrosPaginacion,
  paginacionMeta,
} from '../common/paginacion.util';

@Injectable()
export class SedesService {
  constructor(
    @InjectRepository(Sede)
    private readonly repo: Repository<Sede>,
  ) {}

  async findAll(
    filtros: Record<string, string> = {},
    soloActivos: boolean = true,
  ) {
    const { pagina, pageSize, offset } = obtenerParametrosPaginacion(
      filtros,
      10,
    );

    const [items, total] = await this.repo.findAndCount({
      where: { estado_registro: soloActivos ? 1 : Not(0) },
      order: { id_sede: 'ASC' },
      take: pageSize,
      skip: offset,
    });

    return {
      items,
      ...paginacionMeta(pagina, pageSize, total),
    };
  }

  async findOne(id: number) {
    const sede = await this.repo.findOne({ where: { id_sede: id } });
    if (!sede) throw new NotFoundException(`Sede ${id} no encontrada`);
    return sede;
  }

  create(dto: CreateSedeDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateSedeDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.update(id, { estado_registro: 0 });
    return { message: 'Sede eliminada' };
  }
}