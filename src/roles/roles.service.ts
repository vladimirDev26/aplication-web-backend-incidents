import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { CreateRolDto, UpdateRolDto } from './dto/rol.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly repo: Repository<Rol>,
  ) {}

  findAll(soloActivos: boolean = true) {
    return this.repo.find({
      where: { estado_registro: soloActivos ? 1 : Not(0) },
    });
  }

  async findOne(id: number) {
    const rol = await this.repo.findOne({ where: { id_rol: id } });
    if (!rol) throw new NotFoundException(`Rol ${id} no encontrado`);
    return rol;
  }

  create(dto: CreateRolDto) {
    const rol = this.repo.create(dto);
    return this.repo.save(rol);
  }

  async update(id: number, dto: UpdateRolDto) {
    await this.findOne(id);
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.repo.update(id, { estado_registro: 0 });
    return { message: 'Rol eliminado' };
  }
}
