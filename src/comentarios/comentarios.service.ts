import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comentario } from './entities/comentario.entity';
import { CreateComentarioDto, UpdateComentarioDto } from './dto/comentario.dto';
import { TicketsGateway } from '../socket/tickets.gateway';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectRepository(Comentario)
    private readonly repo: Repository<Comentario>,
    private readonly socketGateway: TicketsGateway,
  ) {}

  findAll() {
    return this.repo.find({ relations: { usuario: true, ticket: true } });
  }

  findByTicket(idTicket: number) {
    return this.repo.find({
      where: { id_ticket: idTicket },
      relations: { usuario: true, ticket: true },
      order: { fecha: 'ASC' },
    });
  }

  async findOne(id: number) {
    const comentario = await this.repo.findOne({
      where: { id_comentario: id },
      relations: { usuario: true, ticket: true },
    });
    if (!comentario)
      throw new NotFoundException(`Comentario ${id} no encontrado`);
    return comentario;
  }

  create(dto: CreateComentarioDto) {
    return this.repo.save(this.repo.create(dto)).then((guardado) => {
      this.socketGateway.emitirComentario(guardado.id_ticket);
      return guardado;
    });
  }

  async update(id: number, dto: UpdateComentarioDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: 'Comentario eliminado' };
  }
}
