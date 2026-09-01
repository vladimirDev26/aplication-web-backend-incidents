import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({ description: 'Id del usuario al que está asignado el equipo', example: 1 })
  @IsOptional()
  @IsInt()
  @Transform(vacioAUndefined)
  id_usuario?: number;

  @ApiPropertyOptional({ description: 'Código patrimonial del equipo', example: 'EQ-2024-0001' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  codigo_patrimonial?: string;

  @ApiPropertyOptional({ description: 'Nombre o etiqueta del equipo', example: 'Laptop HP ProBook' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  nombre_equipo?: string;

  @ApiPropertyOptional({ description: 'Tipo de equipo', example: 'Laptop' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  tipo?: string;

  @ApiPropertyOptional({ description: 'Marca del equipo', example: 'HP' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  marca?: string;

  @ApiPropertyOptional({ description: 'Modelo del equipo', example: 'ProBook 450 G8' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  modelo?: string;

  @ApiPropertyOptional({ description: 'Número de serie del equipo', example: '5CG1243ABC' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  serie?: string;

  @ApiPropertyOptional({ description: 'Procesador del equipo', example: 'Intel Core i5-1135G7' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  procesador?: string;

  @ApiPropertyOptional({ description: 'Memoria RAM del equipo', example: '16 GB' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  ram?: string;

  @ApiPropertyOptional({ description: 'Disco de almacenamiento', example: '512 GB SSD' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  disco?: string;

  @ApiPropertyOptional({ description: 'Sistema operativo instalado', example: 'Windows 11 Pro' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  sistema_operativo?: string;

  @ApiPropertyOptional({ description: 'Tipo de impresora', example: 'Láser' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  tipo_impresora?: string;

  @ApiPropertyOptional({ description: 'IMEI del equipo', example: '359021052137904' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  imei?: string;

  @ApiPropertyOptional({ description: 'Número telefónico asociado', example: '999888777' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  numero_telefonico?: string;

  @ApiPropertyOptional({ description: 'Versión del sistema operativo', example: '23H2' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  version_so?: string;

  @ApiPropertyOptional({ description: 'Almacenamiento interno', example: '256 GB' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  almacenamiento?: string;

  @ApiPropertyOptional({ description: 'Operador de telefonía', example: 'Movistar' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  operador?: string;

  @ApiPropertyOptional({ description: 'Fecha de compra del equipo', example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  @Transform(vacioAUndefined)
  fecha_compra?: string;

  @ApiPropertyOptional({ description: 'Fecha de vencimiento de garantía', example: '2027-01-15' })
  @IsOptional()
  @IsDateString()
  @Transform(vacioAUndefined)
  garantia?: string;

  @ApiPropertyOptional({ description: 'Observaciones del equipo', example: 'Equipo asignado al área de RRHH' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  observaciones?: string;

  @ApiPropertyOptional({ description: 'Estado del registro (1 activo, 0 inactivo)', example: 1 })
  @IsOptional()
  @IsNumber()
  @Transform(vacioAUndefined)
  estado_registro?: number;
}

export class UpdateEquipoDto extends PartialType(CreateEquipoDto) {}
