import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateSedeDto {
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  estado_registro?: number;
}

export class UpdateSedeDto extends PartialType(CreateSedeDto) {}