import { Controller, Get, Post, Delete, Body, Param, Query, Req } from '@nestjs/common';
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
import { HistorialService } from './historial.service';
import { CreateHistorialDto } from './dto/historial.dto';
import { soloActivosPara } from '../common/auth.util';
import { Historial } from './entities/historial.entity';

@ApiTags('Historial')
@ApiBearerAuth('access-token')
@Controller('historial')
export class HistorialController {
  constructor(private readonly service: HistorialService) {}

  @Get()
  @ApiOperation({ summary: 'Lista el historial completo' })
  @ApiQuery({ name: 'filtros', required: false, description: 'Filtros de búsqueda' })
  @ApiOkResponse({ type: [Historial], description: 'Lista de registros de historial' })
  findAll(@Query() filtros: Record<string, string>, @Req() req: Request) {
    return this.service.findAll(filtros, soloActivosPara(req));
  }

  @Get('ticket/:idTicket')
  @ApiOperation({ summary: 'Lista el historial de un ticket' })
  @ApiParam({ name: 'idTicket', required: true })
  @ApiQuery({ name: 'filtros', required: false, description: 'Filtros de búsqueda' })
  @ApiOkResponse({ type: [Historial], description: 'Historial del ticket' })
  findByTicket(
    @Param('idTicket') idTicket: string,
    @Query() filtros: Record<string, string>,
  ) {
    return this.service.findByTicket(+idTicket, filtros);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un registro de historial por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Historial, description: 'Registro de historial encontrado' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo registro de historial' })
  @ApiCreatedResponse({ type: Historial, description: 'Registro de historial creado' })
  create(@Body() dto: CreateHistorialDto) {
    return this.service.create(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un registro de historial por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: 'Registro de historial eliminado' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
