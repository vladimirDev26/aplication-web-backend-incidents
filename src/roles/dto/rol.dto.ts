import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateRolDto {
  @ApiProperty({ description: 'Nombre del rol', example: 'Técnico' })
  @IsString()
  nombre!: string;

  @ApiPropertyOptional({ description: 'Descripción del rol', example: 'Encargado de atender tickets' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Estado del registro (1 activo, 0 inactivo)', example: 1 })
  @IsOptional()
  @IsNumber()
  estado_registro?: number;
}

export class UpdateRolDto extends PartialType(CreateRolDto) {}
