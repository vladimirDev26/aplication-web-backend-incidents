import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('estados')
export class Estado {
  @ApiProperty({ description: 'Id del estado', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_estado' })
  id_estado: number;

  @ApiPropertyOptional({ description: 'Nombre del estado', example: 'En proceso' })
  @Column({ length: 50, nullable: true })
  nombre: string;

  @ApiPropertyOptional({ description: 'Color asociado al estado', example: '#FFA500' })
  @Column({ length: 20, nullable: true })
  color: string;

  @ApiProperty({ description: 'Estado del registro (1 activo, 0 inactivo)', example: 1 })
  @Column({ name: 'estado_registro', type: 'int', default: 1 })
  estado_registro: number;
}
