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
import type { Request } from 'express';
import { EstadosService } from './estados.service';
import { CreateEstadoDto, UpdateEstadoDto } from './dto/estado.dto';
import { soloActivosPara } from '../common/auth.util';
import { Public } from '../auth/public.decorator';

@Controller('estados')
export class EstadosController {
  constructor(private readonly service: EstadosService) {}

  @Public()
  @Get()
  findAll(@Req() req: Request) {
    return this.service.findAll(soloActivosPara(req));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateEstadoDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEstadoDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
