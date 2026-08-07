import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { CreateRolDto, UpdateRolDto } from './dto/rol.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly repo: Repository<Rol>,
  ) {}

  findAll() {
    return this.repo.find();
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
    await this.findOne(id);
    await this.repo.delete(id);
    return { message: 'Rol eliminado' };
  }
}
