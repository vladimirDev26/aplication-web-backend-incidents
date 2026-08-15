import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
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
  tipo_impresora?: string;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  imei?: string;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  numero_telefonico?: string;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  version_so?: string;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  almacenamiento?: string;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  operador?: string;

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
  @IsNumber()
  @Transform(vacioAUndefined)
  estado_registro?: number;
}

export class UpdateEquipoDto extends PartialType(CreateEquipoDto) {}
