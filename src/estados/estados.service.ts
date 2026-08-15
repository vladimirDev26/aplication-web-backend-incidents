import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Estado } from './entities/estado.entity';
import { CreateEstadoDto, UpdateEstadoDto } from './dto/estado.dto';

@Injectable()
export class EstadosService {
  constructor(
    @InjectRepository(Estado)
    private readonly repo: Repository<Estado>,
  ) {}

  findAll(soloActivos: boolean = true) {
    return this.repo.find({
      where: { estado_registro: soloActivos ? 1 : Not(0) },
    });
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
    await this.repo.update(id, { estado_registro: 0 });
    return { message: 'Estado eliminado' };
  }
}
