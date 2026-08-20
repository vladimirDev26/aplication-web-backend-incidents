import { Controller, Get, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ReportesService, type FiltroReporte } from './reportes.service';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly service: ReportesService) {}

  @Get()
  generar(@Query() filtros: FiltroReporte, @Req() req: Request) {
    const rol = (req as { user?: { rol_nombre?: string } }).user?.rol_nombre;
    return this.service.generar(filtros, rol);
  }
}