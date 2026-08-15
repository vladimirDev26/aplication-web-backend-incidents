import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly usuariosService: UsuariosService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET') || 'mi_secreto_seguro',
    });
  }

  // Este método inyecta el objeto retornado directamente en req.user de forma automática
  async validate(payload: { sub: number; correo: string; id_rol: number; rol_nombre: string }) {
    // Retornamos los datos directamente desde el payload del JWT sin consultar la Base de Datos
    return {
      id_usuario: payload.sub,
      correo: payload.correo,
      id_rol: payload.id_rol,
      rol_nombre: payload.rol_nombre,
    };
  }
}
