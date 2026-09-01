import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto, UpdateComentarioDto } from './dto/comentario.dto';
import { Comentario } from './entities/comentario.entity';

@ApiTags('Comentarios')
@ApiBearerAuth('access-token')
@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly service: ComentariosService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos los comentarios' })
  @ApiOkResponse({ type: [Comentario], description: 'Lista de comentarios' })
  findAll() {
    return this.service.findAll();
  }

  @Get('ticket/:idTicket')
  @ApiOperation({ summary: 'Lista los comentarios de un ticket' })
  @ApiParam({ name: 'idTicket', required: true })
  @ApiOkResponse({ type: [Comentario], description: 'Comentarios del ticket' })
  findByTicket(@Param('idTicket') idTicket: string) {
    return this.service.findByTicket(+idTicket);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un comentario por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Comentario, description: 'Comentario encontrado' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo comentario' })
  @ApiCreatedResponse({ type: Comentario, description: 'Comentario creado' })
  create(@Body() dto: CreateComentarioDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un comentario existente' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Comentario, description: 'Comentario actualizado' })
  update(@Param('id') id: string, @Body() dto: UpdateComentarioDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un comentario por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: 'Comentario eliminado' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
