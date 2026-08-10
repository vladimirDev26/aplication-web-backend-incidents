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
import type { Request } from 'express';
import { TicketsService } from './tickets.service';
import {
  CreateTicketDto,
  UpdateTicketDto,
  AsignarTicketDto,
  ResolverTicketDto,
  ConformidadTicketDto,
} from './dto/ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly service: TicketsService) {}

  @Get()
  findAll(@Query() filtros: Record<string, string>) {
    return this.service.findAll(filtros);
  }

  @Get('por-estado')
  porEstado(
    @Query('pagina') pagina: string,
    @Query('pageSize') pageSize: string,
    @Query('estados') estados: string,
  ) {
    return this.service.obtenerPorEstado({ pagina, pageSize, estados });
  }

  @Get('estado/:idEstado')
  porEstadoIndividual(
    @Param('idEstado') idEstado: string,
    @Query() filtros: Record<string, string>,
  ) {
    return this.service.porEstado(idEstado, filtros);
  }

  @Get(':id/detalle')
  detalle(@Param('id') id: string) {
    return this.service.detalle(+id);
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

  @Patch(':id/conformidad')
  conformidad(
    @Param('id') id: string,
    @Body() dto: ConformidadTicketDto,
    @Req() req: Request,
  ) {
    const idUsuarioAccion = (req as { user?: { id_usuario?: number } }).user
      ?.id_usuario;
    return this.service.conformidad(+id, dto, idUsuarioAccion);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
