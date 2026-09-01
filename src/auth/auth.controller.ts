import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, LoginDniDto, LoginCelularDto } from '../usuarios/dto/usuario.dto';
import { Public } from './public.decorator';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Inicia sesión con correo y contraseña' })
  @ApiResponse({ status: 200, description: 'Token de acceso JWT y datos del usuario' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  @Public()
  @Post('login-dni')
  @HttpCode(200)
  @ApiOperation({ summary: 'Inicia sesión mediante número de documento' })
  @ApiResponse({ status: 200, description: 'Token de acceso JWT y datos del usuario' })
  @ApiResponse({ status: 401, description: 'Documento no válido' })
  loginDni(@Body() dto: LoginDniDto) {
    return this.service.loginDni(dto);
  }

  @Public()
  @Post('login-celular')
  @HttpCode(200)
  @ApiOperation({ summary: 'Inicia sesión mediante número de celular' })
  @ApiResponse({ status: 200, description: 'Token de acceso JWT y datos del usuario' })
  @ApiResponse({ status: 401, description: 'Celular no válido' })
  loginCelular(@Body() dto: LoginCelularDto) {
    return this.service.loginCelular(dto);
  }
}
