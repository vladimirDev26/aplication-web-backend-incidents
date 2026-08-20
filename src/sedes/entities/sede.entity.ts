import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('sedes')
export class Sede {
  @PrimaryGeneratedColumn({ name: 'id_sede' })
  id_sede!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string;

  @Column({ name: 'estado_registro', type: 'int', default: 1 })
  estado_registro!: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion!: Date;

  @OneToMany(() => Usuario, (usuario) => usuario.sede)
  usuarios!: Usuario[];
}