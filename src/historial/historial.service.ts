import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Historial } from './entities/historial.entity';
import { CreateHistorialDto } from './dto/historial.dto';

@Injectable()
export class HistorialService {
  constructor(
    @InjectRepository(Historial)
    private readonly repo: Repository<Historial>,
  ) {}

  findAll() {
    return this.repo.find({ relations: { usuario: true, ticket: true } });
  }

  findByTicket(idTicket: number) {
    return this.repo.find({
      where: { id_ticket: idTicket },
      relations: { usuario: true },
      order: { fecha: 'ASC' },
    });
  }

  async create(dto: CreateHistorialDto) {
    return this.repo.save(this.repo.create(dto));
  }

  nuevaEntidad(dto: CreateHistorialDto) {
    return this.repo.create(dto);
  }

  async findOne(id: number) {
    const historial = await this.repo.findOne({
      where: { id_historial: id },
      relations: { usuario: true, ticket: true },
    });
    if (!historial)
      throw new NotFoundException(`Historial ${id} no encontrado`);
    return historial;
  }
}
