import { Entity, ManyToMany, JoinTable } from 'typeorm';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Area } from '../../areas/entities/area.entity';
import { Sede } from '../../sedes/entities/sede.entity';
import { Rol } from '../../roles/entities/rol.entity';
import { Equipo } from '../../equipos/entities/equipo.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Especialidad } from '../../especialidades/entities/especialidad.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  id_usuario!: number;

  @ManyToOne(() => Area, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_area' })
  area!: Area;

  @Column({ name: 'id_area', type: 'int' })
  id_area!: number;

  @ManyToOne(() => Sede, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_sede' })
  sede!: Sede;

  @Column({ name: 'id_sede', type: 'int', nullable: true })
  id_sede!: number;

  @ManyToOne(() => Rol, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_rol' })
  rol!: Rol;

  @Column({ name: 'id_rol', type: 'int' })
  id_rol!: number;

  @Column({ length: 100 })
  nombres!: string;

  @Column({ length: 100 })
  apellidos!: string;

  @Column({ length: 20, unique: true, nullable: true })
  documento!: string;

  @Column({ length: 150, unique: true })
  correo!: string;

  @Column({ length: 255, select: false })
  password!: string;

  @Column({ length: 20, nullable: true })
  celular!: string;

  @Column({ length: 100, nullable: true })
  cargo!: string;

  @Column({ length: 255, nullable: true })
  foto!: string;

  @Column({ type: 'timestamp', nullable: true })
  ultimo_login!: Date;

  @Column({ name: 'estado_registro', type: 'int', default: 1 })
  estado_registro!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  fecha_actualizacion!: Date;

  @OneToMany(() => Equipo, (equipo) => equipo.usuario)
  equipos!: Equipo[];

  @OneToMany(() => Ticket, (ticket) => ticket.usuario)
  tickets!: Ticket[];

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
