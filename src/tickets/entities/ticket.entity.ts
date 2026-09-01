import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Equipo } from '../../equipos/entities/equipo.entity';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Prioridad } from '../../prioridades/entities/prioridad.entity';
import { Estado } from '../../estados/entities/estado.entity';
import { Comentario } from '../../comentarios/entities/comentario.entity';
import { Adjunto } from '../../adjuntos/entities/adjunto.entity';
import { Historial } from '../../historial/entities/historial.entity';

@Entity('tickets')
export class Ticket {
  @ApiProperty({ description: 'Id del ticket', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_ticket' })
  id_ticket!: number;

  @ApiProperty({ description: 'Código único del ticket', example: 'INC-0001' })
  @Column({ length: 30, unique: true })
  codigo!: string;

  @ApiProperty({ type: () => Usuario, description: 'Usuario solicitante del ticket' })
  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  @ApiProperty({ description: 'Id del usuario solicitante', example: 1 })
  @Column({ name: 'id_usuario', type: 'int' })
  id_usuario!: number;

  @ApiPropertyOptional({ type: () => Usuario, description: 'Usuario responsable asignado' })
  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_responsable' })
  responsable!: Usuario;

  @ApiPropertyOptional({ description: 'Id del usuario responsable', example: 2 })
  @Column({ name: 'id_responsable', type: 'int', nullable: true })
  id_responsable!: number;

  @ApiPropertyOptional({ type: () => Equipo, description: 'Equipo involucrado en el ticket' })
  @ManyToOne(() => Equipo, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_equipo' })
  equipo!: Equipo;

  @ApiPropertyOptional({ description: 'Id del equipo involucrado', example: 3 })
  @Column({ name: 'id_equipo', type: 'int', nullable: true })
  id_equipo!: number;

  @ApiProperty({ type: () => Categoria, description: 'Categoría del ticket' })
  @ManyToOne(() => Categoria, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_categoria' })
  categoria!: Categoria;

  @ApiProperty({ description: 'Id de la categoría del ticket', example: 1 })
  @Column({ name: 'id_categoria', type: 'int' })
  id_categoria!: number;

  @ApiProperty({ type: () => Prioridad, description: 'Prioridad del ticket' })
  @ManyToOne(() => Prioridad, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_prioridad' })
  prioridad!: Prioridad;

  @ApiProperty({ description: 'Id de la prioridad del ticket', example: 2 })
  @Column({ name: 'id_prioridad', type: 'int' })
  id_prioridad!: number;

  @ApiProperty({ type: () => Estado, description: 'Estado actual del ticket' })
  @ManyToOne(() => Estado, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_estado' })
  estado!: Estado;

  @ApiProperty({ description: 'Id del estado actual', example: 1 })
  @Column({ name: 'id_estado', type: 'int' })
  id_estado!: number;

  @ApiProperty({ description: 'Asunto del ticket', example: 'Laptop no enciende' })
  @Column({ length: 250 })
  asunto!: string;

  @ApiProperty({ description: 'Descripción detallada del problema', example: 'El equipo no enciende desde esta mañana.' })
  @Column({ type: 'text' })
  descripcion!: string;

  @ApiPropertyOptional({ description: 'Solución aplicada al ticket', example: 'Se reemplazó la fuente de poder.' })
  @Column({ type: 'text', nullable: true })
  solucion!: string;

  @ApiProperty({ description: 'Fecha de creación del ticket', example: '2024-01-15T10:30:00.000Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion!: Date;

  @ApiPropertyOptional({ description: 'Fecha de asignación del ticket', example: '2024-01-15T11:00:00.000Z' })
  @Column({ type: 'timestamp', nullable: true })
  fecha_asignacion!: Date;

  @ApiPropertyOptional({ description: 'Fecha de inicio del proceso del ticket', example: '2024-01-15T11:30:00.000Z' })
  @Column({ type: 'timestamp', nullable: true })
  fecha_inicio!: Date;

  @ApiPropertyOptional({ description: 'Fecha de resolución del ticket', example: '2024-01-16T09:00:00.000Z' })
  @Column({ type: 'timestamp', nullable: true })
  fecha_resolucion!: Date;

  @ApiPropertyOptional({ description: 'Fecha de cierre del ticket', example: '2024-01-17T09:00:00.000Z' })
  @Column({ type: 'timestamp', nullable: true })
  fecha_cierre!: Date;

  @ApiPropertyOptional({ description: 'Nivel de conformidad registrado', example: 'conforme' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  conformidad!: string;

  @ApiPropertyOptional({ type: () => Usuario, description: 'Usuario que registró la conformidad' })
  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_usuario_conformidad' })
  usuario_conformidad!: Usuario;

  @ApiPropertyOptional({ description: 'Id del usuario que registró la conformidad', example: 5 })
  @Column({ name: 'id_usuario_conformidad', type: 'int', nullable: true })
  id_usuario_conformidad!: number;

  @ApiPropertyOptional({ description: 'Fecha de registro de conformidad', example: '2024-01-17T10:00:00.000Z' })
  @Column({ type: 'timestamp', nullable: true })
  fecha_conformidad!: Date;

  @ApiPropertyOptional({ description: 'Comentario de la conformidad', example: 'El problema fue resuelto satisfactoriamente.' })
  @Column({ type: 'text', nullable: true })
  comentario_conformidad!: string;

  @ApiProperty({ description: 'Estado del registro (1 activo, 0 inactivo)', example: 1 })
  @Column({ name: 'estado_registro', type: 'int', default: 1 })
  estado_registro!: number;

  @ApiPropertyOptional({ type: () => [Comentario], description: 'Comentarios del ticket' })
  @OneToMany(() => Comentario, (comentario) => comentario.ticket)
  comentarios!: Comentario[];

  @ApiPropertyOptional({ type: () => [Adjunto], description: 'Adjuntos del ticket' })
  @OneToMany(() => Adjunto, (adjunto) => adjunto.ticket)
  adjuntos!: Adjunto[];

  @ApiPropertyOptional({ type: () => [Historial], description: 'Historial del ticket' })
  @OneToMany(() => Historial, (historial) => historial.ticket)
  historial!: Historial[];

  @ApiPropertyOptional({ description: 'Cantidad de adjuntos del ticket', example: 2 })
  adjuntosCount?: number;
  @ApiPropertyOptional({ description: 'URL del primer adjunto', example: 'https://res.cloudinary.com/demo/a.png' })
  primerAdjuntoUrl?: string | null;
  @ApiPropertyOptional({ description: 'Extensión del primer adjunto', example: 'png' })
  primerAdjuntoExt?: string | null;
}