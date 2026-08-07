import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
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
    nombre_archivo: string;
    extension?: string;
    tamano?: string;
  }) {
    const adjunto = this.repo.create(data);
    return this.repo.save(adjunto);
  }

  async download(id: number) {
    const adjunto = await this.findOne(id);
    const rutaAbsoluta = join(process.cwd(), 'uploads', adjunto.nombre_archivo);
    if (!existsSync(rutaAbsoluta))
      throw new NotFoundException('Archivo no existe en disco');
    const file = createReadStream(rutaAbsoluta);
    return {
      streamable: new StreamableFile(file),
      nombreOriginal: adjunto.nombre_original,
    };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: 'Adjunto eliminado' };
  }
}
