import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginDniDto, LoginCelularDto } from '../usuarios/dto/usuario.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  @Public()
  @Post('login-dni')
  @HttpCode(200)
  loginDni(@Body() dto: LoginDniDto) {
    return this.service.loginDni(dto);
  }

  @Public()
  @Post('login-celular')
  @HttpCode(200)
  loginCelular(@Body() dto: LoginCelularDto) {
    return this.service.loginCelular(dto);
  }
}
