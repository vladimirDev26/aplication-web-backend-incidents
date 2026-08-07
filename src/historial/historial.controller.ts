import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { HistorialService } from './historial.service';
import { CreateHistorialDto } from './dto/historial.dto';

@Controller('historial')
export class HistorialController {
  constructor(private readonly service: HistorialService) {}

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
  create(@Body() dto: CreateHistorialDto) {
    return this.service.create(dto);
  }
}
