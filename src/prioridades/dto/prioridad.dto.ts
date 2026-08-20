import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreatePrioridadDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsInt()
  tiempo_respuesta?: number;

  @IsOptional()
  @IsInt()
  sla_respuesta_min?: number;

  @IsOptional()
  @IsInt()
  sla_resolucion_min?: number;

  @IsOptional()
  @IsString()
  color?: string;
}

export class UpdatePrioridadDto extends PartialType(CreatePrioridadDto) {}
