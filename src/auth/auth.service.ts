import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from '../usuarios/dto/usuario.dto';

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
    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    await this.usuariosService.actualizarUltimoLogin(usuario.id_usuario);

    const payload = { sub: usuario.id_usuario, correo: usuario.correo };
    const token = await this.jwtService.signAsync(payload);

    await this.usuariosService.findOne(usuario.id_usuario);
    const datos = await this.usuariosService.findOne(usuario.id_usuario);

    return {
      access_token: token,
      usuario: datos,
    };
  }
}
