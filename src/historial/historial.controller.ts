import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { HistorialService } from './historial.service';
import { CreateHistorialDto } from './dto/historial.dto';

@Controller('historial')
export class HistorialController {
  constructor(private readonly service: HistorialService) {}

  @Get()
  findAll(@Query() filtros: Record<string, string>) {
    return this.service.findAll(filtros);
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
}
