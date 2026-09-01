import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { NotificacionesService } from './notificaciones.service';

@ApiTags('Notificaciones')
@ApiBearerAuth('access-token')
@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly service: NotificacionesService) {}

  private idUsuario(req: Request): number {
    return (req as { user?: { id_usuario?: number } }).user?.id_usuario ?? 0;
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas las notificaciones' })
  @ApiQuery({ name: 'filtros', required: false, description: 'Filtros de búsqueda' })
  @ApiOkResponse({ description: 'Lista paginada de notificaciones' })
  findAll(@Query() filtros: Record<string, string>) {
    return this.service.findAll(filtros);
  }

  @Get('mias')
  @ApiOperation({ summary: 'Lista las notificaciones del usuario autenticado' })
  @ApiQuery({ name: 'filtros', required: false, description: 'Filtros de búsqueda' })
  @ApiOkResponse({ description: 'Lista paginada de notificaciones del usuario' })
  misNotificaciones(
    @Query() filtros: Record<string, string>,
    @Req() req: Request,
  ) {
    return this.service.misNotificaciones(this.idUsuario(req), filtros);
  }

  @Get('contador')
  @ApiOperation({ summary: 'Cuenta las notificaciones no leídas del usuario' })
  @ApiResponse({ status: 200, description: 'Cantidad de notificaciones no leídas' })
  async contador(@Req() req: Request) {
    const noLeidas = await this.service.contarNoLeidas(this.idUsuario(req));
    return { noLeidas };
  }

  @Patch('leer-todas')
  @ApiOperation({ summary: 'Marca como leídas todas las notificaciones del usuario' })
  @ApiOkResponse({ description: 'Todas las notificaciones marcadas como leídas' })
  marcarTodasLeidas(@Req() req: Request) {
    return this.service.marcarTodasLeidas(this.idUsuario(req));
  }

  @Patch(':id/leer')
  @ApiOperation({ summary: 'Marca una notificación como leída' })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ description: 'Notificación marcada como leída' })
  marcarLeida(@Param('id') id: string, @Req() req: Request) {
    const user = (req as { user?: { id_usuario?: number; rol_nombre?: string } })
      .user;
    const puedeVerTodas = ['Administrador', 'Jefe'].includes(
      user?.rol_nombre ?? '',
    );
    return this.service.marcarLeida(
      +id,
      user?.id_usuario ?? 0,
      puedeVerTodas,
    );
  }
}