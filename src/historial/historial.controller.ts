import { Controller, Get, Post, Delete, Body, Param, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { HistorialService } from './historial.service';
import { CreateHistorialDto } from './dto/historial.dto';
import { soloActivosPara } from '../common/auth.util';

@Controller('historial')
export class HistorialController {
  constructor(private readonly service: HistorialService) {}

  @Get()
  findAll(@Query() filtros: Record<string, string>, @Req() req: Request) {
    return this.service.findAll(filtros, soloActivosPara(req));
  }

  @Get('ticket/:idTicket')
  findByTicket(
    @Param('idTicket') idTicket: string,
    @Query() filtros: Record<string, string>,
  ) {
    return this.service.findByTicket(+idTicket, filtros);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateHistorialDto) {
    return this.service.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
