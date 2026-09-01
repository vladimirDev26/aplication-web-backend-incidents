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
import { AreasService } from './areas.service';
import { soloActivosPara } from '../common/auth.util';
import { CreateAreaDto, UpdateAreaDto } from './dto/area.dto';
import { Area } from './entities/area.entity';
import { Public } from '../auth/public.decorator';

@ApiTags('Areas')
@ApiBearerAuth('access-token')
@Controller('areas')
export class AreasController {
  constructor(private readonly service: AreasService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lista todas las áreas' })
  @ApiQuery({ name: 'filtros', required: false, description: 'Filtros de búsqueda' })
  @ApiOkResponse({ type: [Area], description: 'Lista de áreas' })
  findAll(@Query() filtros: Record<string, string>, @Req() req: Request) {
    return this.service.findAll(filtros, soloActivosPara(req));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un área por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Area, description: 'Área encontrada' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea una nueva área' })
  @ApiCreatedResponse({ type: Area, description: 'Área creada' })
  create(@Body() dto: CreateAreaDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un área existente' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Area, description: 'Área actualizada' })
  update(@Param('id') id: string, @Body() dto: UpdateAreaDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un área por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: 'Área eliminada' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
