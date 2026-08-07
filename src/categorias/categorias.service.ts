import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto/categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly repo: Repository<Categoria>,
  ) {}

  findAll() {
    return this.repo.find();
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
