import { Controller, Get, Query, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { ReportesService, type FiltroReporte } from './reportes.service';

@ApiTags('Reportes')
@ApiBearerAuth('access-token')
@Controller('reportes')
export class ReportesController {
  constructor(private readonly service: ReportesService) {}

  @Get()
  @ApiOperation({ summary: 'Genera el reporte de incidencias (solo administradores)' })
  @ApiQuery({ name: 'fecha_desde', required: false, description: 'Fecha inicial del filtro' })
  @ApiQuery({ name: 'fecha_hasta', required: false, description: 'Fecha final del filtro' })
  @ApiQuery({ name: 'id_estado', required: false, description: 'Id del estado del ticket' })
  @ApiQuery({ name: 'id_prioridad', required: false, description: 'Id de la prioridad del ticket' })
  @ApiQuery({ name: 'id_categoria', required: false, description: 'Id de la categoría del ticket' })
  @ApiQuery({ name: 'id_area', required: false, description: 'Id del área del usuario' })
  @ApiQuery({ name: 'id_responsable', required: false, description: 'Id del usuario responsable' })
  @ApiQuery({ name: 'pagina', required: false, description: 'Número de página' })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Cantidad de elementos por página' })
  @ApiResponse({ status: 200, description: 'Reporte con resumen y detalle de tickets' })
  @ApiResponse({ status: 403, description: 'Solo el administrador puede generar reportes' })
  generar(@Query() filtros: FiltroReporte, @Req() req: Request) {
    const rol = (req as { user?: { rol_nombre?: string } }).user?.rol_nombre;
    return this.service.generar(filtros, rol);
  }
}