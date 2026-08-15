import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Adjunto } from './entities/adjunto.entity';

@Injectable()
export class AdjuntosService {
  constructor(
    @InjectRepository(Adjunto)
    private readonly repo: Repository<Adjunto>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findByTicket(idTicket: number) {
    return this.repo.find({
      where: { id_ticket: idTicket },
      order: { fecha: 'ASC' },
    });
  }

  async findOne(id: number) {
    const adjunto = await this.repo.findOne({ where: { id_adjunto: id } });
    if (!adjunto) throw new NotFoundException(`Adjunto ${id} no encontrado`);
    return adjunto;
  }

  async create(data: {
    id_ticket?: number;
    nombre_original: string;
    nombre_archivo?: string;
    extension?: string;
    tamano?: string;
    url?: string;
    public_id?: string;
  }) {
    const adjunto = this.repo.create(data);
    return this.repo.save(adjunto);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: 'Adjunto eliminado' };
  }
}