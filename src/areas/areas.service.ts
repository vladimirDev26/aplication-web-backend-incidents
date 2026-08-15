import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Area } from './entities/area.entity';
import { CreateAreaDto, UpdateAreaDto } from './dto/area.dto';
import {
  obtenerParametrosPaginacion,
  paginacionMeta,
} from '../common/paginacion.util';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area)
    private readonly repo: Repository<Area>,
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
      order: { id_area: 'ASC' },
      take: pageSize,
      skip: offset,
    });

    return {
      items,
      ...paginacionMeta(pagina, pageSize, total),
    };
  }

  async findOne(id: number) {
    const area = await this.repo.findOne({ where: { id_area: id } });
    if (!area) throw new NotFoundException(`Área ${id} no encontrada`);
    return area;
  }

  create(dto: CreateAreaDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateAreaDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.update(id, { estado_registro: 0 });
    return { message: 'Área eliminada' };
  }
}
