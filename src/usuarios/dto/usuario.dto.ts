import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsOptional,
  IsInt,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsInt()
  id_area: number;

  @IsInt()
  id_rol: number;

  @IsString()
  nombres: string;

  @IsString()
  apellidos: string;

  @IsOptional()
  @IsString()
  documento?: string;

  @IsEmail()
  correo: string;

  @IsString()
  password: string;

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
  @IsBoolean()
  activo?: boolean;
}

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}

export class LoginDto {
  @IsEmail()
  correo: string;

  @IsString()
  password: string;
}
