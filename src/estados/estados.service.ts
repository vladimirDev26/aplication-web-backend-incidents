import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estado } from './entities/estado.entity';
import { CreateEstadoDto, UpdateEstadoDto } from './dto/estado.dto';

@Injectable()
export class EstadosService {
  constructor(
    @InjectRepository(Estado)
    private readonly repo: Repository<Estado>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const estado = await this.repo.findOne({ where: { id_estado: id } });
    if (!estado) throw new NotFoundException(`Estado ${id} no encontrado`);
    return estado;
  }

  create(dto: CreateEstadoDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateEstadoDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: 'Estado eliminado' };
  }
}
