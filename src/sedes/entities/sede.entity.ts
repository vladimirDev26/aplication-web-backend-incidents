import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('sedes')
export class Sede {
  @ApiProperty({ description: 'Id de la sede', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_sede' })
  id_sede!: number;

  @ApiProperty({ description: 'Nombre de la sede', example: 'Sede Principal' })
  @Column({ length: 100 })
  nombre!: string;

  @ApiPropertyOptional({ description: 'Descripción de la sede', example: 'Sede central de la organización' })
  @Column({ type: 'text', nullable: true })
  descripcion!: string;

  @ApiProperty({ description: 'Estado del registro (1 activo, 0 inactivo)', example: 1 })
  @Column({ name: 'estado_registro', type: 'int', default: 1 })
  estado_registro!: number;

  @ApiProperty({ description: 'Fecha de creación de la sede', example: '2024-01-15T10:30:00.000Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion!: Date;

  @ApiPropertyOptional({ type: () => [Usuario], description: 'Usuarios pertenecientes a la sede' })
  @OneToMany(() => Usuario, (usuario) => usuario.sede)
  usuarios!: Usuario[];
}