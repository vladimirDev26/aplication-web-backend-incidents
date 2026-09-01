import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('especialidades')
export class Especialidad {
  @ApiProperty({ description: 'Id de la especialidad', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_especialidad' })
  id_especialidad!: number;

  @ApiProperty({ description: 'Nombre de la especialidad', example: 'Redes' })
  @Column({ length: 100 })
  nombre!: string;

  @ApiPropertyOptional({ description: 'Descripción de la especialidad', example: 'Especialidad en redes y conectividad' })
  @Column({ type: 'text', nullable: true })
  descripcion!: string;

  @ApiProperty({ description: 'Estado del registro (1 activo, 0 inactivo)', example: 1 })
  @Column({ name: 'estado_registro', type: 'int', default: 1 })
  estado_registro!: number;

  @ApiProperty({ description: 'Fecha de creación de la especialidad', example: '2024-01-15T10:30:00.000Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion!: Date;

  @ApiPropertyOptional({ description: 'Fecha de actualización de la especialidad', example: '2024-01-15T10:30:00.000Z' })
  @Column({
    type: 'timestamp',
    name: 'fecha_update',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  fecha_update!: Date;

  @ApiPropertyOptional({ type: () => [Usuario], description: 'Usuarios con esta especialidad' })
  @ManyToMany(() => Usuario, (usuario) => usuario.especialidades)
  usuarios!: Usuario[];
}