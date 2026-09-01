import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsInt, IsIn, IsNumber } from 'class-validator';

const vacioAUndefined = ({ value }: { value: unknown }) =>
  value === '' ? undefined : value;

export class CreateTicketDto {
  @ApiProperty({ description: 'Id del usuario solicitante', example: 1 })
  @IsInt()
  id_usuario!: number;

  @ApiPropertyOptional({ description: 'Id del usuario responsable', example: 2 })
  @IsOptional()
  @IsInt()
  @Transform(vacioAUndefined)
  id_responsable?: number;

  @ApiPropertyOptional({ description: 'Id del equipo involucrado', example: 3 })
  @IsOptional()
  @IsInt()
  @Transform(vacioAUndefined)
  id_equipo?: number;

  @ApiProperty({ description: 'Id de la categoría del ticket', example: 1 })
  @IsInt()
  id_categoria!: number;

  @ApiProperty({ description: 'Id de la prioridad del ticket', example: 2 })
  @IsInt()
  id_prioridad!: number;

  @ApiPropertyOptional({ description: 'Id del estado inicial del ticket', example: 1 })
  @IsOptional()
  @IsInt()
  @Transform(vacioAUndefined)
  id_estado?: number;

  @ApiProperty({ description: 'Asunto del ticket', example: 'Laptop no enciende' })
  @IsString()
  asunto!: string;

  @ApiProperty({ description: 'Descripción detallada del problema', example: 'El equipo no enciende desde esta mañana.' })
  @IsString()
  descripcion!: string;

  @ApiPropertyOptional({ description: 'Solución aplicada al ticket', example: 'Se reemplazó la fuente de poder.' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  solucion?: string;

  @ApiPropertyOptional({ description: 'Estado del registro (1 activo, 0 inactivo)', example: 1 })
  @IsOptional()
  @IsNumber()
  estado_registro?: number;
}

export class UpdateTicketDto extends PartialType(CreateTicketDto) {}

export class AsignarTicketDto {
  @ApiProperty({ description: 'Id del usuario responsable a asignar', example: 2 })
  @IsInt()
  id_responsable!: number;
}

export class DerivarTicketDto {
  @ApiProperty({ description: 'Id del nuevo usuario responsable', example: 5 })
  @IsInt()
  id_responsable!: number;

  @ApiPropertyOptional({ description: 'Motivo de la derivación', example: 'Requiere especialista en redes' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  motivo?: string;
}

export class ResolverTicketDto {
  @ApiProperty({ description: 'Solución aplicada al ticket', example: 'Se actualizó el controlador de red.' })
  @IsString()
  solucion!: string;
}

export class ConformidadTicketDto {
  @ApiProperty({ description: 'Nivel de conformidad del área solicitante', example: 'conforme', enum: ['conforme', 'no_conforme'] })
  @IsIn(['conforme', 'no_conforme'], {
    message: 'conformidad debe ser conforme o no_conforme',
  })
  conformidad!: string;

  @ApiPropertyOptional({ description: 'Comentario de la conformidad', example: 'El problema fue resuelto satisfactoriamente.' })
  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  comentario_conformidad?: string;
}
