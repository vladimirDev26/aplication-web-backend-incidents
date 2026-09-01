import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateComentarioDto {
  @ApiPropertyOptional({ description: 'Id del ticket al que pertenece el comentario', example: 1 })
  @IsOptional()
  @IsInt()
  id_ticket?: number;

  @ApiPropertyOptional({ description: 'Id del usuario que realiza el comentario', example: 1 })
  @IsOptional()
  @IsInt()
  id_usuario?: number;

  @ApiPropertyOptional({ description: 'Contenido del comentario', example: 'Se revisó el equipo y se cambió la memoria.' })
  @IsOptional()
  @IsString()
  comentario?: string;
}

export class UpdateComentarioDto extends PartialType(CreateComentarioDto) {}
