import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateHistorialDto {
  @IsOptional()
  @IsInt()
  id_ticket?: number;

  @IsOptional()
  @IsInt()
  id_usuario?: number;

  @IsOptional()
  @IsString()
  accion?: string;

  @IsOptional()
  @IsString()
  detalle?: string;
}
