import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
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
  @PrimaryGeneratedColumn({ name: 'id_ticket' })
  id_ticket!: number;

  @Column({ length: 30, unique: true })
  codigo!: string;

  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  @Column({ name: 'id_usuario', type: 'int' })
  id_usuario!: number;

  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_responsable' })
  responsable!: Usuario;

  @Column({ name: 'id_responsable', type: 'int', nullable: true })
  id_responsable!: number;

  @ManyToOne(() => Equipo, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_equipo' })
  equipo!: Equipo;

  @Column({ name: 'id_equipo', type: 'int', nullable: true })
  id_equipo!: number;

  @ManyToOne(() => Categoria, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_categoria' })
  categoria!: Categoria;

  @Column({ name: 'id_categoria', type: 'int' })
  id_categoria!: number;

  @ManyToOne(() => Prioridad, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_prioridad' })
  prioridad!: Prioridad;

  @Column({ name: 'id_prioridad', type: 'int' })
  id_prioridad!: number;

  @ManyToOne(() => Estado, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_estado' })
  estado!: Estado;

  @Column({ name: 'id_estado', type: 'int' })
  id_estado!: number;

  @Column({ length: 250 })
  asunto!: string;

  @Column({ type: 'text' })
  descripcion!: string;

  @Column({ type: 'text', nullable: true })
  solucion!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion!: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_asignacion!: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_inicio!: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_resolucion!: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_cierre!: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  conformidad!: string;

  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_usuario_conformidad' })
  usuario_conformidad!: Usuario;

  @Column({ name: 'id_usuario_conformidad', type: 'int', nullable: true })
  id_usuario_conformidad!: number;

  @Column({ type: 'timestamp', nullable: true })
  fecha_conformidad!: Date;

  @Column({ type: 'text', nullable: true })
  comentario_conformidad!: string;

  @Column({ name: 'estado_registro', type: 'int', default: 1 })
  estado_registro!: number;

  @OneToMany(() => Comentario, (comentario) => comentario.ticket)
  comentarios!: Comentario[];

  @OneToMany(() => Adjunto, (adjunto) => adjunto.ticket)
  adjuntos!: Adjunto[];

  @OneToMany(() => Historial, (historial) => historial.ticket)
  historial!: Historial[];

  adjuntosCount?: number;
  primerAdjuntoUrl?: string | null;
  primerAdjuntoExt?: string | null;
}
