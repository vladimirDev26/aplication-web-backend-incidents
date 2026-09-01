import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateHistorialDto {
  @ApiPropertyOptional({ description: 'Id del ticket al que pertenece el registro', example: 1 })
  @IsOptional()
  @IsInt()
  id_ticket?: number;

  @ApiPropertyOptional({ description: 'Id del usuario que realizó la acción', example: 1 })
  @IsOptional()
  @IsInt()
  id_usuario?: number;

  @ApiPropertyOptional({ description: 'Acción realizada', example: 'Ticket asignado' })
  @IsOptional()
  @IsString()
  accion?: string;

  @ApiPropertyOptional({ description: 'Detalle de la acción', example: 'Se asignó a Juan Pérez' })
  @IsOptional()
  @IsString()
  detalle?: string;
}
