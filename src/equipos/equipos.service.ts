import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipo } from './entities/equipo.entity';
import { CreateEquipoDto, UpdateEquipoDto } from './dto/equipo.dto';

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo)
    private readonly repo: Repository<Equipo>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: { usuario: true, tickets: true },
    });
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
