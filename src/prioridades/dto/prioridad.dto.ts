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
  @IsString()
  color?: string;
}

export class UpdatePrioridadDto extends PartialType(CreatePrioridadDto) {}
