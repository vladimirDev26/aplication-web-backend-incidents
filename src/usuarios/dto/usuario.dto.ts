import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsEmail,
  IsNumber,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'Id del área del usuario', example: 1 })
  @IsInt()
  id_area!: number;

  @ApiPropertyOptional({ description: 'Id de la sede del usuario', example: 1 })
  @IsOptional()
  @IsInt()
  id_sede?: number;

  @ApiProperty({ description: 'Id del rol del usuario', example: 2 })
  @IsInt()
  id_rol!: number;

  @ApiProperty({ description: 'Nombres del usuario', example: 'Juan Carlos' })
  @IsString()
  nombres!: string;

  @ApiProperty({ description: 'Apellidos del usuario', example: 'Pérez Gómez' })
  @IsString()
  apellidos!: string;

  @ApiPropertyOptional({ description: 'Documento de identidad del usuario', example: '12345678' })
  @IsOptional()
  @IsString()
  documento?: string;

  @ApiProperty({ description: 'Correo electrónico del usuario', example: 'juan.perez@empresa.com' })
  @IsEmail()
  correo!: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: 'ClaveSegura123' })
  @IsString()
  password!: string;

  @ApiPropertyOptional({ description: 'Número de celular del usuario', example: '999888777' })
  @IsOptional()
  @IsString()
  celular?: string;

  @ApiPropertyOptional({ description: 'Cargo del usuario', example: 'Soporte Técnico' })
  @IsOptional()
  @IsString()
  cargo?: string;

  @ApiPropertyOptional({ description: 'URL de la foto de perfil', example: 'https://ejemplo.com/foto.jpg' })
  @IsOptional()
  @IsString()
  foto?: string;

  @ApiPropertyOptional({ description: 'Estado del registro (1 activo, 0 inactivo)', example: 1 })
  @IsOptional()
  @IsNumber()
  estado_registro?: number;
}

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}

export class LoginDto {
  @ApiProperty({ description: 'Correo electrónico del usuario', example: 'admin@empresa.com' })
  @IsEmail()
  correo!: string;

  @ApiProperty({ description: 'Contraseña del usuario', example: 'ClaveSegura123' })
  @IsString()
  password!: string;
}

export class LoginDniDto {
  @ApiProperty({ description: 'Documento de identidad del usuario', example: '12345678' })
  @IsString()
  documento!: string;
}

export class LoginCelularDto {
  @ApiProperty({ description: 'Número de celular del usuario', example: '999888777' })
  @IsString()
  celular!: string;
}

export class AsignarEspecialidadesDto {
  @ApiProperty({ description: 'Lista de ids de especialidades a asignar', example: [1, 2, 3], type: [Number] })
  @IsNumber({}, { each: true })
  especialidades!: number[];
}
