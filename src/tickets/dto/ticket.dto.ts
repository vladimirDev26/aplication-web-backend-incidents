import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateTicketDto {
  @IsInt()
  id_usuario: number;

  @IsOptional()
  @IsInt()
  id_responsable?: number;

  @IsOptional()
  @IsInt()
  id_equipo?: number;

  @IsInt()
  id_categoria: number;

  @IsInt()
  id_prioridad: number;

  @IsOptional()
  @IsInt()
  id_estado?: number;

  @IsString()
  asunto: string;

  @IsString()
  descripcion: string;

  @IsOptional()
  @IsString()
  solucion?: string;
}

export class UpdateTicketDto extends PartialType(CreateTicketDto) {}

export class AsignarTicketDto {
  @IsInt()
  id_responsable: number;
}

export class ResolverTicketDto {
  @IsString()
  solucion: string;
}
