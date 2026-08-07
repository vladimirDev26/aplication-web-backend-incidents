import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateComentarioDto {
  @IsOptional()
  @IsInt()
  id_ticket?: number;

  @IsOptional()
  @IsInt()
  id_usuario?: number;

  @IsOptional()
  @IsString()
  comentario?: string;
}

export class UpdateComentarioDto extends PartialType(CreateComentarioDto) {}
