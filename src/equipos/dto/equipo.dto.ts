import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsDateString,
} from 'class-validator';

const vacioAUndefined = ({ value }: { value: unknown }) =>
  value === '' ? undefined : value;

export class CreateEquipoDto {
  @IsOptional()
  @IsInt()
  @Transform(vacioAUndefined)
  id_usuario?: number;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  codigo_patrimonial?: string;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  nombre_equipo?: string;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  tipo?: string;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  marca?: string;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  modelo?: string;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  serie?: string;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  procesador?: string;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  ram?: string;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  disco?: string;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  sistema_operativo?: string;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  direccion_ip?: string;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  mac?: string;

  @IsOptional()
  @IsDateString()
  @Transform(vacioAUndefined)
  fecha_compra?: string;

  @IsOptional()
  @IsDateString()
  @Transform(vacioAUndefined)
  garantia?: string;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  observaciones?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(vacioAUndefined)
  activo?: boolean;
}

export class UpdateEquipoDto extends PartialType(CreateEquipoDto) {}
