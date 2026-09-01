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
import { SedesService } from './sedes.service';
import { soloActivosPara } from '../common/auth.util';
import { CreateSedeDto, UpdateSedeDto } from './dto/sede.dto';
import { Sede } from './entities/sede.entity';

@ApiTags('Sedes')
@ApiBearerAuth('access-token')
@Controller('sedes')
export class SedesController {
  constructor(private readonly service: SedesService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas las sedes' })
  @ApiQuery({ name: 'filtros', required: false, description: 'Filtros de búsqueda' })
  @ApiOkResponse({ type: [Sede], description: 'Lista de sedes' })
  findAll(@Query() filtros: Record<string, string>, @Req() req: Request) {
    return this.service.findAll(filtros, soloActivosPara(req));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene una sede por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Sede, description: 'Sede encontrada' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea una nueva sede' })
  @ApiCreatedResponse({ type: Sede, description: 'Sede creada' })
  create(@Body() dto: CreateSedeDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza una sede existente' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Sede, description: 'Sede actualizada' })
  update(@Param('id') id: string, @Body() dto: UpdateSedeDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina una sede por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: 'Sede eliminada' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}