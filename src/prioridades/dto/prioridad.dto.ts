import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreatePrioridadDto {
  @ApiPropertyOptional({ description: 'Nombre de la prioridad', example: 'Alta' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ description: 'Tiempo de respuesta esperado en minutos', example: 30 })
  @IsOptional()
  @IsInt()
  tiempo_respuesta?: number;

  @ApiPropertyOptional({ description: 'SLA de respuesta en minutos', example: 60 })
  @IsOptional()
  @IsInt()
  sla_respuesta_min?: number;

  @ApiPropertyOptional({ description: 'SLA de resolución en minutos', example: 480 })
  @IsOptional()
  @IsInt()
  sla_resolucion_min?: number;

  @ApiPropertyOptional({ description: 'Color asociado a la prioridad', example: '#FF0000' })
  @IsOptional()
  @IsString()
  color?: string;
}

export class UpdatePrioridadDto extends PartialType(CreatePrioridadDto) {}
