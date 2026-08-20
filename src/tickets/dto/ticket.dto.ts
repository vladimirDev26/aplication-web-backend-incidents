import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsInt, IsIn, IsNumber } from 'class-validator';

const vacioAUndefined = ({ value }: { value: unknown }) =>
  value === '' ? undefined : value;

export class CreateTicketDto {
  @IsInt()
  id_usuario!: number;

  @IsOptional()
  @IsInt()
  @Transform(vacioAUndefined)
  id_responsable?: number;

  @IsOptional()
  @IsInt()
  @Transform(vacioAUndefined)
  id_equipo?: number;

  @IsInt()
  id_categoria!: number;

  @IsInt()
  id_prioridad!: number;

  @IsOptional()
  @IsInt()
  @Transform(vacioAUndefined)
  id_estado?: number;

  @IsString()
  asunto!: string;

  @IsString()
  descripcion!: string;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  solucion?: string;

  @IsOptional()
  @IsNumber()
  estado_registro?: number;
}

export class UpdateTicketDto extends PartialType(CreateTicketDto) {}

export class AsignarTicketDto {
  @IsInt()
  id_responsable!: number;
}

export class DerivarTicketDto {
  @IsInt()
  id_responsable!: number;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  motivo?: string;
}

export class ResolverTicketDto {
  @IsString()
  solucion!: string;
}

export class ConformidadTicketDto {
  @IsIn(['conforme', 'no_conforme'], {
    message: 'conformidad debe ser conforme o no_conforme',
  })
  conformidad!: string;

  @IsOptional()
  @IsString()
  @Transform(vacioAUndefined)
  comentario_conformidad?: string;
}
