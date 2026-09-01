import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { Especialidad } from '../especialidades/entities/especialidad.entity';
import { CreateUsuarioDto, UpdateUsuarioDto } from './dto/usuario.dto';
import { TicketsService } from '../tickets/tickets.service';
import {
  obtenerParametrosPaginacion,
  paginacionMeta,
} from '../common/paginacion.util';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
    private readonly ticketsService: TicketsService,
  ) {}

  async findAll(
    filtros: Record<string, string> = {},
    activos?: string,
    soloActivos = true,
  ) {
    const where: any = {};
    if (soloActivos) {
      where.estado_registro = 1;
    } else {
      where.estado_registro = Not(0);
      if (activos === 'true') where.estado_registro = 1;
      if (activos === 'false') where.estado_registro = 2;
    }

    const { pagina, pageSize, offset } = obtenerParametrosPaginacion(
      filtros,
      10,
    );

    const [items, total] = await this.repo.findAndCount({
      where,
      relations: { area: true, sede: true, rol: true, especialidades: true },
      order: { nombres: 'ASC' },
      take: pageSize,
      skip: offset,
    });

    return {
      items,
      ...paginacionMeta(pagina, pageSize, total),
    };
  }

  async findOne(id: number) {
    const usuario = await this.repo.findOne({
      where: { id_usuario: id },
      relations: {
        area: true,
        sede: true,
        rol: true,
        equipos: true,
        especialidades: true,
      },
    });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return usuario;
  }

  findByCorreo(correo: string) {
    return this.repo.findOne({
      where: { correo },
      relations: { area: true, sede: true, rol: true },
    });
  }

  async findByDocumento(documento: string) {
    const usuario = await this.repo
      .createQueryBuilder('u')
      .addSelect('u.password')
      .leftJoinAndSelect('u.rol', 'rol')
      .leftJoinAndSelect('u.area', 'area')
      .leftJoinAndSelect('u.sede', 'sede')
      .where('LOWER(u.documento) = LOWER(:documento)', { documento })
      .getOne();
    return usuario;
  }

  async findByCelular(celular: string) {
    const limpiar = (v: string) => v.replace(/\D/g, '');
    const objetivo = limpiar(celular).slice(-9);
    if (!objetivo) return null;

    const usuarios = await this.repo
      .createQueryBuilder('u')
      .addSelect('u.password')
      .leftJoinAndSelect('u.rol', 'rol')
      .leftJoinAndSelect('u.area', 'area')
      .leftJoinAndSelect('u.sede', 'sede')
      .where('u.celular IS NOT NULL AND TRIM(u.celular) <> :vacio', {
        vacio: '',
      })
      .getMany();

    return (
      usuarios.find(
        (u) => u.celular && limpiar(u.celular).slice(-9) === objetivo,
      ) ?? null
    );
  }

  async findByCorreoConPassword(correo: string) {
    const usuario = await this.repo
      .createQueryBuilder('u')
      .addSelect('u.password')
      .leftJoinAndSelect('u.rol', 'rol')
      .leftJoinAndSelect('u.area', 'area')
      .leftJoinAndSelect('u.sede', 'sede')
      .where('LOWER(u.correo) = LOWER(:correo)', { correo })
      .getOne();
    return usuario;
  }

  async create(dto: CreateUsuarioDto) {
    const existente = await this.repo.findOne({
      where: { correo: dto.correo },
    });
    if (existente) throw new ConflictException('El correo ya está registrado');

    if (dto.documento) {
      const existenteDoc = await this.repo.findOne({
        where: { documento: dto.documento },
      });
      if (existenteDoc)
        throw new ConflictException('El documento ya está registrado');
    }

    const { password, ...resto } = dto;
    const hash = await bcrypt.hash(password, 10);
    const usuario = this.repo.create({
      ...resto,
      password: hash,
      password_visible: password,
    });
    await this.repo.save(usuario);
    return this.findOne(usuario.id_usuario);
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    await this.findOne(id);

    const data: Record<string, any> = { ...dto };
    if (data.password) {
      data.password_visible = data.password as string;
      data.password = await bcrypt.hash(data.password as string, 10);
    } else {
      delete data.password;
    }

    await this.repo.update(id, data);
    return this.findOne(id);
  }

  async verPassword(id: number, user?: { rol_nombre?: string }) {
    if (user?.rol_nombre !== 'Administrador') {
      throw new ForbiddenException(
        'Solo el administrador puede ver las contraseñas.',
      );
    }

    const usuario = await this.repo
      .createQueryBuilder('u')
      .addSelect('u.password_visible')
      .where('u.id_usuario = :id', { id })
      .getOne();
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);

    if (!usuario.password_visible) {
      return {
        disponible: false,
        message:
          'No hay contraseña visible registrada. Establece una nueva contraseña en "Editar" para que pueda mostrarse.',
      };
    }
    return { disponible: true, password_visible: usuario.password_visible };
  }

  async actualizarUltimoLogin(id: number) {
    await this.repo.update(id, { ultimo_login: new Date() });
  }

  async asignarEspecialidades(id: number, especialidades: number[]) {
    await this.findOne(id);
    const usuario = await this.repo.findOne({
      where: { id_usuario: id },
      relations: { especialidades: true },
    });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);
    usuario.especialidades = especialidades.map((id_especialidad) =>
      this.repo.manager.create(Especialidad, { id_especialidad }),
    );
    await this.repo.save(usuario);
    const resultado = await this.findOne(id);
    const autoasignados = await this.ticketsService.autoasignarPendientes(id);
    return { ...resultado, tickets_autoasignados: autoasignados };
  }

  async remove(id: number) {
    await this.repo.update(id, { estado_registro: 0 });
    return { message: 'Usuario eliminado' };
  }
}
