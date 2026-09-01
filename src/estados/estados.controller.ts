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
import { EstadosService } from './estados.service';
import { CreateEstadoDto, UpdateEstadoDto } from './dto/estado.dto';
import { soloActivosPara } from '../common/auth.util';
import { Estado } from './entities/estado.entity';
import { Public } from '../auth/public.decorator';

@ApiTags('Estados')
@ApiBearerAuth('access-token')
@Controller('estados')
export class EstadosController {
  constructor(private readonly service: EstadosService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lista todos los estados' })
  @ApiOkResponse({ type: [Estado], description: 'Lista de estados' })
  findAll(@Req() req: Request) {
    return this.service.findAll(soloActivosPara(req));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un estado por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Estado, description: 'Estado encontrado' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo estado' })
  @ApiCreatedResponse({ type: Estado, description: 'Estado creado' })
  create(@Body() dto: CreateEstadoDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un estado existente' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Estado, description: 'Estado actualizado' })
  update(@Param('id') id: string, @Body() dto: UpdateEstadoDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un estado por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: 'Estado eliminado' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
