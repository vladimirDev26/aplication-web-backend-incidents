import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prioridad } from './entities/prioridad.entity';
import { CreatePrioridadDto, UpdatePrioridadDto } from './dto/prioridad.dto';

@Injectable()
export class PrioridadesService {
  constructor(
    @InjectRepository(Prioridad)
    private readonly repo: Repository<Prioridad>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const prioridad = await this.repo.findOne({ where: { id_prioridad: id } });
    if (!prioridad)
      throw new NotFoundException(`Prioridad ${id} no encontrada`);
    return prioridad;
  }

  create(dto: CreatePrioridadDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdatePrioridadDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: 'Prioridad eliminada' };
  }
}
