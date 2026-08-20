import type { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  AsignarEspecialidadesDto,
} from './dto/usuario.dto';
import { soloActivosPara } from '../common/auth.util';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  @Get()
  findAll(@Query() query: Record<string, string>, @Req() req: Request) {
    return this.service.findAll(query, query.activos, soloActivosPara(req));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
    return this.service.update(+id, dto);
  }

  @Patch(':id/especialidades')
  asignarEspecialidades(
    @Param('id') id: string,
    @Body() dto: AsignarEspecialidadesDto,
  ) {
    return this.service.asignarEspecialidades(+id, dto.especialidades);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
