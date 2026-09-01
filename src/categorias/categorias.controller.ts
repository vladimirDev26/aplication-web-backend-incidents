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
import { CategoriasService } from './categorias.service';
import { soloActivosPara } from '../common/auth.util';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto/categoria.dto';
import { Categoria } from './entities/categoria.entity';
import { Public } from '../auth/public.decorator';

@ApiTags('Categorías')
@ApiBearerAuth('access-token')
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly service: CategoriasService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lista todas las categorías' })
  @ApiQuery({ name: 'filtros', required: false, description: 'Filtros de búsqueda' })
  @ApiOkResponse({ type: [Categoria], description: 'Lista de categorías' })
  findAll(@Query() filtros: Record<string, string>, @Req() req: Request) {
    return this.service.findAll(filtros, soloActivosPara(req));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene una categoría por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Categoria, description: 'Categoría encontrada' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea una nueva categoría' })
  @ApiCreatedResponse({ type: Categoria, description: 'Categoría creada' })
  create(@Body() dto: CreateCategoriaDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza una categoría existente' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Categoria, description: 'Categoría actualizada' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoriaDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina una categoría por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: 'Categoría eliminada' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
