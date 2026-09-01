import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { RolesService } from './roles.service';
import { CreateRolDto, UpdateRolDto } from './dto/rol.dto';
import { soloActivosPara } from '../common/auth.util';
import { Rol } from './entities/rol.entity';
import { Public } from '../auth/public.decorator';

@ApiTags('Roles')
@ApiBearerAuth('access-token')
@Controller('roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lista todos los roles' })
  @ApiOkResponse({ type: [Rol], description: 'Lista de roles' })
  findAll(@Req() req: Request) {
    return this.service.findAll(soloActivosPara(req));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un rol por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Rol, description: 'Rol encontrado' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo rol' })
  @ApiCreatedResponse({ type: Rol, description: 'Rol creado' })
  create(@Body() dto: CreateRolDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un rol existente' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Rol, description: 'Rol actualizado' })
  update(@Param('id') id: string, @Body() dto: UpdateRolDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un rol por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: 'Rol eliminado' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
