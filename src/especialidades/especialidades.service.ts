import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Especialidad } from './entities/especialidad.entity';
import {
  CreateEspecialidadDto,
  UpdateEspecialidadDto,
} from './dto/especialidad.dto';
import {
  obtenerParametrosPaginacion,
  paginacionMeta,
} from '../common/paginacion.util';

@Injectable()
export class EspecialidadesService {
  constructor(
    @InjectRepository(Especialidad)
    private readonly repo: Repository<Especialidad>,
  ) {}

  async findAll(
    filtros: Record<string, string> = {},
    soloActivos: boolean = true,
  ) {
    const { pagina, pageSize, offset } = obtenerParametrosPaginacion(
      filtros,
      100,
    );

    const [items, total] = await this.repo.findAndCount({
      where: { estado_registro: soloActivos ? 1 : Not(0) },
      order: { nombre: 'ASC' },
      take: pageSize,
      skip: offset,
    });

    return {
      items,
      ...paginacionMeta(pagina, pageSize, total),
    };
  }

  async findOne(id: number) {
    const especialidad = await this.repo.findOne({
      where: { id_especialidad: id },
    });
    if (!especialidad)
      throw new NotFoundException(`Especialidad ${id} no encontrada`);
    return especialidad;
  }

  create(dto: CreateEspecialidadDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: number, dto: UpdateEspecialidadDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.update(id, { estado_registro: 0 });
    return { message: 'Especialidad eliminada' };
  }
}