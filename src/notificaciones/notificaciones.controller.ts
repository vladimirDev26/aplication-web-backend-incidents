import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { NotificacionesService } from './notificaciones.service';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly service: NotificacionesService) {}

  private idUsuario(req: Request): number {
    return (req as { user?: { id_usuario?: number } }).user?.id_usuario ?? 0;
  }

  @Get()
  findAll(@Query() filtros: Record<string, string>) {
    return this.service.findAll(filtros);
  }

  @Get('mias')
  misNotificaciones(
    @Query() filtros: Record<string, string>,
    @Req() req: Request,
  ) {
    return this.service.misNotificaciones(this.idUsuario(req), filtros);
  }

  @Get('contador')
  async contador(@Req() req: Request) {
    const noLeidas = await this.service.contarNoLeidas(this.idUsuario(req));
    return { noLeidas };
  }

  @Patch('leer-todas')
  marcarTodasLeidas(@Req() req: Request) {
    return this.service.marcarTodasLeidas(this.idUsuario(req));
  }

  @Patch(':id/leer')
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