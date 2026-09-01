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
  ApiResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { TicketsService } from './tickets.service';
import { soloActivosPara } from '../common/auth.util';
import {
  CreateTicketDto,
  UpdateTicketDto,
  AsignarTicketDto,
  DerivarTicketDto,
  ResolverTicketDto,
  ConformidadTicketDto,
} from './dto/ticket.dto';
import { Ticket } from './entities/ticket.entity';

@ApiTags('Tickets')
@ApiBearerAuth('access-token')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly service: TicketsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista los tickets con filtros y paginación' })
  @ApiQuery({ name: 'filtros', required: false, description: 'Filtros de búsqueda' })
  @ApiOkResponse({ description: 'Lista paginada de tickets' })
  findAll(@Query() filtros: Record<string, string>, @Req() req: Request) {
    const u = this.usuario(req);
    return this.service.findAll(filtros, soloActivosPara(req), u.id_usuario, u.rol_nombre);
  }

  @Get('por-estado')
  @ApiOperation({ summary: 'Lista tickets agrupados por estado (kanban)' })
  @ApiQuery({ name: 'pagina', required: false, description: 'Número de página' })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Elementos por página' })
  @ApiQuery({ name: 'estados', required: false, description: 'Estados a incluir' })
  @ApiOkResponse({ description: 'Tickets agrupados por estado' })
  porEstado(
    @Query('pagina') pagina: string,
    @Query('pageSize') pageSize: string,
    @Query('estados') estados: string,
    @Req() req: Request,
  ) {
    const u = this.usuario(req);
    return this.service.obtenerPorEstado(
      { pagina, pageSize, estados },
      soloActivosPara(req),
      u.id_usuario,
      u.rol_nombre,
    );
  }

  @Get('estado/:idEstado')
  @ApiOperation({ summary: 'Lista los tickets de un estado específico' })
  @ApiParam({ name: 'idEstado', required: true })
  @ApiQuery({ name: 'filtros', required: false, description: 'Filtros de búsqueda' })
  @ApiOkResponse({ description: 'Tickets del estado indicado' })
  porEstadoIndividual(
    @Param('idEstado') idEstado: string,
    @Query() filtros: Record<string, string>,
    @Req() req: Request,
  ) {
    const u = this.usuario(req);
    return this.service.porEstado(idEstado, filtros, soloActivosPara(req), u.id_usuario, u.rol_nombre);
  }

  @Get('estadisticas')
  @ApiOperation({ summary: 'Estadísticas de tickets por categoría y área' })
  @ApiQuery({ name: 'filtros', required: false, description: 'Filtros de búsqueda' })
  @ApiOkResponse({ description: 'Estadísticas de tickets' })
  estadisticas(@Query() filtros: Record<string, string>, @Req() req: Request) {
    const u = this.usuario(req);
    return this.service.estadisticas(
      filtros,
      soloActivosPara(req),
      u.id_usuario,
      u.rol_nombre,
    );
  }

  @Get('carga-tecnicos')
  @ApiOperation({ summary: 'Carga de trabajo por técnico' })
  @ApiOkResponse({ description: 'Carga de trabajo de los técnicos' })
  cargaTecnicos() {
    return this.service.cargaTecnicos();
  }

  @Get(':id/detalle')
  @ApiOperation({ summary: 'Obtiene el detalle completo de un ticket' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: 'Detalle completo del ticket' })
  detalle(@Param('id') id: string) {
    return this.service.detalle(+id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un ticket por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Ticket, description: 'Ticket encontrado' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un nuevo ticket' })
  @ApiCreatedResponse({ type: Ticket, description: 'Ticket creado' })
  create(@Body() dto: CreateTicketDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un ticket existente' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Ticket, description: 'Ticket actualizado' })
  update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.service.update(+id, dto);
  }

  @Patch(':id/asignar')
  @ApiOperation({ summary: 'Asigna un ticket a un responsable' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Ticket, description: 'Ticket asignado' })
  asignar(@Param('id') id: string, @Body() dto: AsignarTicketDto) {
    return this.service.asignar(+id, dto);
  }

  @Patch(':id/derivar')
  @ApiOperation({ summary: 'Deriva un ticket a otro técnico' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Ticket, description: 'Ticket derivado' })
  derivar(
    @Param('id') id: string,
    @Body() dto: DerivarTicketDto,
    @Req() req: Request,
  ) {
    const idUsuarioAccion = (req as { user?: { id_usuario?: number } }).user
      ?.id_usuario;
    return this.service.derivar(+id, dto, idUsuarioAccion);
  }

  @Patch(':id/iniciar')
  @ApiOperation({ summary: 'Inicia el proceso de un ticket' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Ticket, description: 'Ticket en proceso' })
  iniciar(@Param('id') id: string) {
    return this.service.iniciar(+id);
  }

  @Patch(':id/resolver')
  @ApiOperation({ summary: 'Resuelve un ticket con su solución' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Ticket, description: 'Ticket resuelto' })
  resolver(@Param('id') id: string, @Body() dto: ResolverTicketDto) {
    return this.service.resolver(+id, dto);
  }

  @Patch(':id/cerrar')
  @ApiOperation({ summary: 'Cierra un ticket' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Ticket, description: 'Ticket cerrado' })
  cerrar(@Param('id') id: string) {
    return this.service.cerrar(+id);
  }

  @Patch(':id/conformidad')
  @ApiOperation({ summary: 'Registra la conformidad de un ticket' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Ticket, description: 'Ticket con conformidad registrada' })
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
  @ApiOperation({ summary: 'Elimina un ticket por su id' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Ticket eliminado' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  private usuario(req: Request) {
    const user = (req as { user?: { id_usuario?: number; rol_nombre?: string } })
      .user;
    return {
      id_usuario: user?.id_usuario,
      rol_nombre: user?.rol_nombre,
    };
  }
}
