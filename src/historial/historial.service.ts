import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Historial } from './entities/historial.entity';
import { CreateHistorialDto } from './dto/historial.dto';
import {
  obtenerParametrosPaginacion,
  paginacionMeta,
} from '../common/paginacion.util';

@Injectable()
export class HistorialService {
  constructor(
    @InjectRepository(Historial)
    private readonly repo: Repository<Historial>,
  ) {}

  async findAll(filtros: Record<string, string> = {}) {
    const { pagina, pageSize, offset } = obtenerParametrosPaginacion(
      filtros,
      10,
    );

    const qb = this.repo
      .createQueryBuilder('h')
      .leftJoinAndSelect('h.usuario', 'usuario')
      .leftJoinAndSelect('h.ticket', 'ticket')
      .orderBy('h.fecha', 'DESC');

    if (filtros.id_ticket)
      qb.andWhere('h.id_ticket = :idTicket', {
        idTicket: filtros.id_ticket,
      });

    const [items, total] = await qb
      .take(pageSize)
      .skip(offset)
      .getManyAndCount();

    return {
      items,
      ...paginacionMeta(pagina, pageSize, total),
    };
  }

  findByTicket(idTicket: number, filtros: Record<string, string> = {}) {
    return this.findAll({ ...filtros, id_ticket: String(idTicket) });
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
