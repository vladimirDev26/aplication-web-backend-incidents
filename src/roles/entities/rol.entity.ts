import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('roles')
export class Rol {
  @ApiProperty({ description: 'Id del rol', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_rol' })
  id_rol!: number;

  @ApiProperty({ description: 'Nombre del rol', example: 'Técnico' })
  @Column({ length: 50, unique: true })
  nombre!: string;

  @ApiPropertyOptional({ description: 'Descripción del rol', example: 'Encargado de atender tickets' })
  @Column({ type: 'text', nullable: true })
  descripcion!: string;

  @ApiProperty({ description: 'Estado del registro (1 activo, 0 inactivo)', example: 1 })
  @Column({ name: 'estado_registro', type: 'int', default: 1 })
  estado_registro!: number;

  @ApiProperty({ description: 'Fecha de creación del rol', example: '2024-01-15T10:30:00.000Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion!: Date;

  @ApiPropertyOptional({ type: () => [Usuario], description: 'Usuarios con este rol' })
  @OneToMany(() => Usuario, (usuario) => usuario.rol)
  usuarios!: Usuario[];
}
