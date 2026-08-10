import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto/categoria.dto';
import {
  obtenerParametrosPaginacion,
  paginacionMeta,
} from '../common/paginacion.util';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly repo: Repository<Categoria>,
  ) {}

  async findAll(filtros: Record<string, string> = {}) {
    const { pagina, pageSize, offset } = obtenerParametrosPaginacion(
      filtros,
      10,
    );

    const [items, total] = await this.repo.findAndCount({
      order: { id_categoria: 'ASC' },
      take: pageSize,
      skip: offset,
    });

    return {
      items,
      ...paginacionMeta(pagina, pageSize, total),
    };
  }

  async findOne(id: number) {
    const categoria = await this.repo.findOne({ where: { id_categoria: id } });
    if (!categoria)
      throw new NotFoundException(`Categoría ${id} no encontrada`);
    return categoria;
  }

  create(dto: CreateCategoriaDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateCategoriaDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: 'Categoría eliminada' };
  }
}
