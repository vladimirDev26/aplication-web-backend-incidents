import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateAreaDto {
  @ApiProperty({ description: 'Nombre del área', example: 'Tecnología de la Información' })
  @IsString()
  nombre!: string;

  @ApiPropertyOptional({ description: 'Descripción del área', example: 'Área encargada del soporte TI' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Estado del registro (1 activo, 0 inactivo)', example: 1 })
  @IsOptional()
  @IsNumber()
  estado_registro?: number;
}

export class UpdateAreaDto extends PartialType(CreateAreaDto) {}
