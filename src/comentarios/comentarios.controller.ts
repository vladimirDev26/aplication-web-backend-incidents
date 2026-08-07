import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto, UpdateComentarioDto } from './dto/comentario.dto';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly service: ComentariosService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('ticket/:idTicket')
  findByTicket(@Param('idTicket') idTicket: string) {
    return this.service.findByTicket(+idTicket);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateComentarioDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateComentarioDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
