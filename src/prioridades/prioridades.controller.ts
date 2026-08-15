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
import { PrioridadesService } from './prioridades.service';
import { CreatePrioridadDto, UpdatePrioridadDto } from './dto/prioridad.dto';
import { soloActivosPara } from '../common/auth.util';
import { Public } from '../auth/public.decorator';

@Controller('prioridades')
export class PrioridadesController {
  constructor(private readonly service: PrioridadesService) {}

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
  create(@Body() dto: CreatePrioridadDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePrioridadDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
