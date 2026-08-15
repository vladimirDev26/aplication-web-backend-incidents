import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('especialidades')
export class Especialidad {
  @PrimaryGeneratedColumn({ name: 'id_especialidad' })
  id_especialidad!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string;

  @Column({ name: 'estado_registro', type: 'int', default: 1 })
  estado_registro!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion!: Date;

  @Column({
    type: 'timestamp',
    name: 'fecha_update',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  fecha_update!: Date;

  @ManyToMany(() => Usuario, (usuario) => usuario.especialidades)
  usuarios!: Usuario[];
}