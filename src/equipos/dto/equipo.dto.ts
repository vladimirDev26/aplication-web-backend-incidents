import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsDateString,
} from 'class-validator';

export class CreateEquipoDto {
  @IsOptional()
  @IsInt()
  id_usuario?: number;

  @IsOptional()
  @IsString()
  codigo_patrimonial?: string;

  @IsOptional()
  @IsString()
  nombre_equipo?: string;

  @IsOptional()
  @IsString()
  tipo?: string;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsString()
  modelo?: string;

  @IsOptional()
  @IsString()
  serie?: string;

  @IsOptional()
  @IsString()
  procesador?: string;

  @IsOptional()
  @IsString()
  ram?: string;

  @IsOptional()
  @IsString()
  disco?: string;

  @IsOptional()
  @IsString()
  sistema_operativo?: string;

  @IsOptional()
  @IsString()
  direccion_ip?: string;

  @IsOptional()
  @IsString()
  mac?: string;

  @IsOptional()
  @IsDateString()
  fecha_compra?: string;

  @IsOptional()
  @IsDateString()
  garantia?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}

export class UpdateEquipoDto extends PartialType(CreateEquipoDto) {}
