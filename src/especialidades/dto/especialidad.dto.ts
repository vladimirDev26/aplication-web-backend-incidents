import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateEspecialidadDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  estado_registro?: number;
}

export class UpdateEspecialidadDto extends PartialType(CreateEspecialidadDto) {}

export class AsignarEspecialidadesDto {
  @IsNumber({}, { each: true })
  especialidades!: number[];
}