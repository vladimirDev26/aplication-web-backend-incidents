import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto/usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  findAll(activos?: string) {
    return this.repo.find({
      where: activos !== undefined ? { activo: activos === 'true' } : undefined,
      relations: { area: true, rol: true },
      order: { nombres: 'ASC' },
    });
  }

  async findOne(id: number) {
    const usuario = await this.repo.findOne({
      where: { id_usuario: id },
      relations: { area: true, rol: true, equipos: true },
    });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return usuario;
  }

  findByCorreo(correo: string) {
    return this.repo.findOne({
      where: { correo },
      relations: { area: true, rol: true },
    });
  }

  async findByCorreoConPassword(correo: string) {
    const usuario = await this.repo
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('LOWER(u.correo) = LOWER(:correo)', { correo })
      .getOne();
    return usuario;
  }

  async create(dto: CreateUsuarioDto) {
    const existente = await this.repo.findOne({
      where: { correo: dto.correo },
    });
    if (existente) throw new ConflictException('El correo ya está registrado');

    const { password, ...resto } = dto;
    const hash = await bcrypt.hash(password, 10);
    const usuario = this.repo.create({ ...resto, password: hash });
    await this.repo.save(usuario);
    return this.findOne(usuario.id_usuario);
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    await this.findOne(id);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    } else {
      delete dto.password;
    }

    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async actualizarUltimoLogin(id: number) {
    await this.repo.update(id, { ultimo_login: new Date() });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.update(id, { activo: false });
    return { message: 'Usuario desactivado' };
  }
}
