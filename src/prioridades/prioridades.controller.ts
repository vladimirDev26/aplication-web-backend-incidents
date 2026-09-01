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
import { PrioridadesService } from './prioridades.service';
import { CreatePrioridadDto, UpdatePrioridadDto } from './dto/prioridad.dto';
import { soloActivosPara } from '../common/auth.util';
import { Prioridad } from './entities/prioridad.entity';
import { Public } from '../auth/public.decorator';

@ApiTags('Prioridades')
@ApiBearerAuth('access-token')
@Controller('prioridades')
export class PrioridadesController {
  constructor(private readonly service: PrioridadesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lista todas las prioridades' })
  @ApiOkResponse({ type: [Prioridad], description: 'Lista de prioridades' })
  findAll(@Req() req: Request) {
    return this.service.findAll(soloActivosPara(req));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene una prioridad por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Prioridad, description: 'Prioridad encontrada' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea una nueva prioridad' })
  @ApiCreatedResponse({ type: Prioridad, description: 'Prioridad creada' })
  create(@Body() dto: CreatePrioridadDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza una prioridad existente' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Prioridad, description: 'Prioridad actualizada' })
  update(@Param('id') id: string, @Body() dto: UpdatePrioridadDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina una prioridad por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: 'Prioridad eliminada' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
