import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateSedeDto {
  @ApiProperty({ description: 'Nombre de la sede', example: 'Sede Principal' })
  @IsString()
  nombre!: string;

  @ApiPropertyOptional({ description: 'Descripción de la sede', example: 'Sede central de la organización' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Estado del registro (1 activo, 0 inactivo)', example: 1 })
  @IsOptional()
  @IsNumber()
  estado_registro?: number;
}

export class UpdateSedeDto extends PartialType(CreateSedeDto) {}