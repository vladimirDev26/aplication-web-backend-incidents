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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  AsignarEspecialidadesDto,
} from './dto/usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { soloActivosPara } from '../common/auth.util';

@ApiTags('Usuarios')
@ApiBearerAuth('access-token')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  @Get()
  @ApiOperation({ summary: 'Lista los usuarios con filtros y paginación' })
  @ApiQuery({ name: 'query', required: false, description: 'Filtros de búsqueda' })
  @ApiQuery({ name: 'activos', required: false, description: 'Filtrar por usuarios activos' })
  @ApiOkResponse({ description: 'Lista paginada de usuarios' })
  findAll(@Query() query: Record<string, string>, @Req() req: Request) {
    return this.service.findAll(query, query.activos, soloActivosPara(req));
  }

  @Get(':id/password')
  @ApiOperation({ summary: 'Obtiene la contraseña visible de un usuario (solo administrador)' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: 'Contraseña visible del usuario, si existe' })
  verPassword(@Req() req: Request, @Param('id') id: string) {
    return this.service.verPassword(
      +id,
      (req as { user?: { rol_nombre?: string } }).user,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un usuario por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Usuario, description: 'Usuario encontrado' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo usuario' })
  @ApiCreatedResponse({ type: Usuario, description: 'Usuario creado' })
  create(@Body() dto: CreateUsuarioDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un usuario existente' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Usuario, description: 'Usuario actualizado' })
  update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
    return this.service.update(+id, dto);
  }

  @Patch(':id/especialidades')
  @ApiOperation({ summary: 'Asigna especialidades a un usuario' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: 'Especialidades asignadas' })
  asignarEspecialidades(
    @Param('id') id: string,
    @Body() dto: AsignarEspecialidadesDto,
  ) {
    return this.service.asignarEspecialidades(+id, dto.especialidades);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un usuario por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: 'Usuario eliminado' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
