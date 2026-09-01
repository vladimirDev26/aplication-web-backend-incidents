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
import { EspecialidadesService } from './especialidades.service';
import { soloActivosPara } from '../common/auth.util';
import {
  CreateEspecialidadDto,
  UpdateEspecialidadDto,
} from './dto/especialidad.dto';
import { Especialidad } from './entities/especialidad.entity';

@ApiTags('Especialidades')
@ApiBearerAuth('access-token')
@Controller('especialidades')
export class EspecialidadesController {
  constructor(private readonly service: EspecialidadesService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas las especialidades' })
  @ApiQuery({ name: 'filtros', required: false, description: 'Filtros de búsqueda' })
  @ApiOkResponse({ type: [Especialidad], description: 'Lista de especialidades' })
  findAll(@Query() filtros: Record<string, string>, @Req() req: Request) {
    return this.service.findAll(filtros, soloActivosPara(req));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene una especialidad por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Especialidad, description: 'Especialidad encontrada' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea una nueva especialidad' })
  @ApiCreatedResponse({ type: Especialidad, description: 'Especialidad creada' })
  create(@Body() dto: CreateEspecialidadDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza una especialidad existente' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Especialidad, description: 'Especialidad actualizada' })
  update(@Param('id') id: string, @Body() dto: UpdateEspecialidadDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina una especialidad por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: 'Especialidad eliminada' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}