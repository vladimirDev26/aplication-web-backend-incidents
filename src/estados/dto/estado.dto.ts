import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional } from 'class-validator';

export class CreateEstadoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  color?: string;
}

export class UpdateEstadoDto extends PartialType(CreateEstadoDto) {}
