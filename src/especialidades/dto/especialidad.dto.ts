import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateEspecialidadDto {
  @ApiPropertyOptional({ description: 'Nombre de la especialidad', example: 'Redes' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ description: 'Descripción de la especialidad', example: 'Especialidad en redes y conectividad' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Estado del registro (1 activo, 0 inactivo)', example: 1 })
  @IsOptional()
  @IsNumber()
  estado_registro?: number;
}

export class UpdateEspecialidadDto extends PartialType(CreateEspecialidadDto) {}

export class AsignarEspecialidadesDto {
  @ApiProperty({ description: 'Lista de ids de especialidades a asignar', example: [1, 2, 3], type: [Number] })
  @IsNumber({}, { each: true })
  especialidades!: number[];
}