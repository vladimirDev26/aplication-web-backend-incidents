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
import type { Request } from 'express';
import { EquiposService } from './equipos.service';
import { CreateEquipoDto, UpdateEquipoDto } from './dto/equipo.dto';
import { Equipo } from './entities/equipo.entity';
import { soloActivosPara } from '../common/auth.util';

@ApiTags('Equipos')
@ApiBearerAuth('access-token')
@Controller('equipos')
export class EquiposController {
  constructor(private readonly service: EquiposService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos los equipos' })
  @ApiQuery({ name: 'filtros', required: false, description: 'Filtros de búsqueda' })
  @ApiOkResponse({ type: [Equipo], description: 'Lista de equipos' })
  findAll(@Query() filtros: Record<string, string>, @Req() req: Request) {
    return this.service.findAll(filtros, soloActivosPara(req));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un equipo por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Equipo, description: 'Equipo encontrado' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo equipo' })
  @ApiCreatedResponse({ type: Equipo, description: 'Equipo creado' })
  create(@Body() dto: CreateEquipoDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un equipo existente' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Equipo, description: 'Equipo actualizado' })
  update(@Param('id') id: string, @Body() dto: UpdateEquipoDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un equipo por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: 'Equipo eliminado' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
