import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsOptional,
  IsInt,
  IsEmail,
  IsNumber,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsInt()
  id_area!: number;

  @IsOptional()
  @IsInt()
  id_sede?: number;

  @IsInt()
  id_rol!: number;

  @IsString()
  nombres!: string;

  @IsString()
  apellidos!: string;

  @IsOptional()
  @IsString()
  documento?: string;

  @IsEmail()
  correo!: string;

  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  celular?: string;

  @IsOptional()
  @IsString()
  cargo?: string;

  @IsOptional()
  @IsString()
  foto?: string;

  @IsOptional()
  @IsNumber()
  estado_registro?: number;
}

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}

export class LoginDto {
  @IsEmail()
  correo!: string;

  @IsString()
  password!: string;
}

export class LoginDniDto {
  @IsString()
  documento!: string;
}

export class LoginCelularDto {
  @IsString()
  celular!: string;
}

export class AsignarEspecialidadesDto {
  @IsNumber({}, { each: true })
  especialidades!: number[];
}
