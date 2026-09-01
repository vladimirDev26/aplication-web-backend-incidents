import { Entity, ManyToMany, JoinTable } from 'typeorm';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Area } from '../../areas/entities/area.entity';
import { Sede } from '../../sedes/entities/sede.entity';
import { Rol } from '../../roles/entities/rol.entity';
import { Equipo } from '../../equipos/entities/equipo.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Especialidad } from '../../especialidades/entities/especialidad.entity';

@Entity('usuarios')
export class Usuario {
  @ApiProperty({ description: 'Id del usuario', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id_usuario!: number;

  @ApiProperty({ type: () => Area, description: 'Área del usuario' })
  @ManyToOne(() => Area, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_area' })
  area!: Area;

  @ApiProperty({ description: 'Id del área del usuario', example: 1 })
  @Column({ name: 'id_area', type: 'int' })
  id_area!: number;

  @ApiPropertyOptional({ type: () => Sede, description: 'Sede del usuario' })
  @ManyToOne(() => Sede, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_sede' })
  sede!: Sede;

  @ApiPropertyOptional({ description: 'Id de la sede del usuario', example: 1 })
  @Column({ name: 'id_sede', type: 'int', nullable: true })
  id_sede!: number;

  @ApiProperty({ type: () => Rol, description: 'Rol del usuario' })
  @ManyToOne(() => Rol, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_rol' })
  rol!: Rol;

  @ApiProperty({ description: 'Id del rol del usuario', example: 2 })
  @Column({ name: 'id_rol', type: 'int' })
  id_rol!: number;

  @ApiProperty({ description: 'Nombres del usuario', example: 'Juan Carlos' })
  @Column({ length: 100 })
  nombres!: string;

  @ApiProperty({ description: 'Apellidos del usuario', example: 'Pérez Gómez' })
  @Column({ length: 100 })
  apellidos!: string;

  @ApiPropertyOptional({ description: 'Documento de identidad del usuario', example: '12345678' })
  @Column({ length: 20, unique: true, nullable: true })
  documento!: string;

  @ApiProperty({ description: 'Correo electrónico del usuario', example: 'juan.perez@empresa.com' })
  @Column({ length: 150, unique: true })
  correo!: string;

  @ApiProperty({ description: 'Contraseña del usuario (no se devuelve por defecto)', example: 'ClaveSegura123' })
  @Column({ length: 255, select: false })
  password!: string;

  @ApiPropertyOptional({ description: 'Contraseña visible (solo para que el administrador la recuerde; se actualiza al cambiar la contraseña). No se usa para autenticación.', example: 'ClaveSegura123' })
  @Column({ type: 'varchar', length: 255, nullable: true, select: false })
  password_visible?: string | null;

  @ApiPropertyOptional({ description: 'Número de celular del usuario', example: '999888777' })
  @Column({ length: 20, nullable: true })
  celular!: string;

  @ApiPropertyOptional({ description: 'Cargo del usuario', example: 'Soporte Técnico' })
  @Column({ length: 100, nullable: true })
  cargo!: string;

  @ApiPropertyOptional({ description: 'URL de la foto de perfil', example: 'https://ejemplo.com/foto.jpg' })
  @Column({ length: 255, nullable: true })
  foto!: string;

  @ApiPropertyOptional({ description: 'Fecha del último inicio de sesión', example: '2024-01-15T10:30:00.000Z' })
  @Column({ type: 'timestamp', nullable: true })
  ultimo_login!: Date;

  @ApiProperty({ description: 'Estado del registro (1 activo, 0 inactivo)', example: 1 })
  @Column({ name: 'estado_registro', type: 'int', default: 1 })
  estado_registro!: number;

  @ApiProperty({ description: 'Fecha de creación del usuario', example: '2024-01-15T10:30:00.000Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion!: Date;

  @ApiPropertyOptional({ description: 'Fecha de actualización del usuario', example: '2024-01-15T10:30:00.000Z' })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  fecha_actualizacion!: Date;

  @ApiPropertyOptional({ type: () => [Equipo], description: 'Equipos asignados al usuario' })
  @OneToMany(() => Equipo, (equipo) => equipo.usuario)
  equipos!: Equipo[];

  @ApiPropertyOptional({ type: () => [Ticket], description: 'Tickets solicitados por el usuario' })
  @OneToMany(() => Ticket, (ticket) => ticket.usuario)
  tickets!: Ticket[];

  @ApiPropertyOptional({ type: () => [Especialidad], description: 'Especialidades del usuario' })
  @ManyToMany(() => Especialidad, (especialidad) => especialidad.usuarios)
  @JoinTable({
    name: 'usuarios_especialidades',
    joinColumn: { name: 'id_usuario', referencedColumnName: 'id_usuario' },
    inverseJoinColumn: {
      name: 'id_especialidad',
      referencedColumnName: 'id_especialidad',
    },
  })
  especialidades!: Especialidad[];
}