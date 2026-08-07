import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Area } from './entities/area.entity';
import { CreateAreaDto, UpdateAreaDto } from './dto/area.dto';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area)
    private readonly repo: Repository<Area>,
  ) {}

  findAll() {
    return this.repo.find();
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
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: 'Área eliminada' };
  }
}
