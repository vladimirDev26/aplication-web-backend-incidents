import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import {
  CreateTicketDto,
  UpdateTicketDto,
  AsignarTicketDto,
  ResolverTicketDto,
} from './dto/ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly service: TicketsService) {}

  @Get()
  findAll(@Query() filtros: Record<string, any>) {
    return this.service.findAll(filtros);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() dto: CreateTicketDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.service.update(+id, dto);
  }

  @Patch(':id/asignar')
  asignar(@Param('id') id: string, @Body() dto: AsignarTicketDto) {
    return this.service.asignar(+id, dto);
  }

  @Patch(':id/iniciar')
  iniciar(@Param('id') id: string) {
    return this.service.iniciar(+id);
  }

  @Patch(':id/resolver')
  resolver(@Param('id') id: string, @Body() dto: ResolverTicketDto) {
    return this.service.resolver(+id, dto);
  }

  @Patch(':id/cerrar')
  cerrar(@Param('id') id: string) {
    return this.service.cerrar(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
