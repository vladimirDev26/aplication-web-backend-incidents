import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateEstadoDto {
  @ApiPropertyOptional({ description: 'Nombre del estado', example: 'En proceso' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ description: 'Color asociado al estado', example: '#FFA500' })
  @IsOptional()
  @IsString()
  color?: string;
}

export class UpdateEstadoDto extends PartialType(CreateEstadoDto) {}
