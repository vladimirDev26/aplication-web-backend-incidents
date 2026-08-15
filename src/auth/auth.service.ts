import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto, LoginDniDto, LoginCelularDto } from '../usuarios/dto/usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.usuariosService.findByCorreoConPassword(
      dto.correo,
    );

    if (!usuario || !(await bcrypt.compare(dto.password, usuario.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (usuario.estado_registro !== 1) {
      throw new UnauthorizedException(
        usuario.estado_registro === 0
          ? 'Usuario eliminado'
          : 'Usuario inactivo',
      );
    }

    // Actualiza en segundo plano el último login
    await this.usuariosService.actualizarUltimoLogin(usuario.id_usuario);

    // 1. Guardamos los datos mínimos pero suficientes en el token JWT
    const payload = {
      sub: usuario.id_usuario,
      correo: usuario.correo,
      id_rol: usuario.id_rol,
      rol_nombre: usuario.rol.nombre,
    };
    const token = await this.jwtService.signAsync(payload);

    // 2. Quitamos la contraseña antes de retornar la respuesta
    const { password, ...usuarioSinPassword } = usuario;

    // await this.usuariosService.findOne(usuario.id_usuario);
    // const datos = await this.usuariosService.findOne(usuario.id_usuario);

    return {
      access_token: token,
      usuario: usuarioSinPassword,
    };
  }

  async loginDni(dto: LoginDniDto) {
    const usuario = await this.usuariosService.findByDocumento(dto.documento);

    if (!usuario) {
      throw new UnauthorizedException('Documento no registrado');
    }

    if (usuario.estado_registro !== 1) {
      throw new UnauthorizedException(
        usuario.estado_registro === 0
          ? 'Usuario eliminado'
          : 'Usuario inactivo',
      );
    }

    await this.usuariosService.actualizarUltimoLogin(usuario.id_usuario);

    const payload = {
      sub: usuario.id_usuario,
      correo: usuario.correo,
      id_rol: usuario.id_rol,
      rol_nombre: usuario.rol.nombre,
    };
    const token = await this.jwtService.signAsync(payload);

    const { password, ...usuarioSinPassword } = usuario;

    return {
      access_token: token,
      usuario: usuarioSinPassword,
    };
  }

  async loginCelular(dto: LoginCelularDto) {
    const usuario = await this.usuariosService.findByCelular(dto.celular);

    if (!usuario) {
      throw new UnauthorizedException('Celular no registrado');
    }

    if (usuario.estado_registro !== 1) {
      throw new UnauthorizedException(
        usuario.estado_registro === 0
          ? 'Usuario eliminado'
          : 'Usuario inactivo',
      );
    }

    await this.usuariosService.actualizarUltimoLogin(usuario.id_usuario);

    const payload = {
      sub: usuario.id_usuario,
      correo: usuario.correo,
      id_rol: usuario.id_rol,
      rol_nombre: usuario.rol.nombre,
    };
    const token = await this.jwtService.signAsync(payload);

    const { password, ...usuarioSinPassword } = usuario;

    return {
      access_token: token,
      usuario: usuarioSinPassword,
    };
  }
}
