import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';

@Entity('equipos')
export class Equipo {
  @PrimaryGeneratedColumn({ name: 'id_equipo' })
  id_equipo!: number;

  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  @Column({ name: 'id_usuario', type: 'int', nullable: true })
  id_usuario!: number;

  @Column({ name: 'codigo_patrimonial', length: 50, nullable: true })
  codigo_patrimonial!: string;

  @Column({ name: 'nombre_equipo', length: 100, nullable: true })
  nombre_equipo!: string;

  @Column({ length: 50, nullable: true })
  tipo!: string;

  @Column({ length: 50, nullable: true })
  marca!: string;

  @Column({ length: 100, nullable: true })
  modelo!: string;

  @Column({ length: 100, nullable: true })
  serie!: string;

  @Column({ length: 100, nullable: true })
  procesador!: string;

  @Column({ length: 50, nullable: true })
  ram!: string;

  @Column({ length: 100, nullable: true })
  disco!: string;

  @Column({ name: 'sistema_operativo', length: 100, nullable: true })
  sistema_operativo!: string;

  @Column({ name: 'tipo_impresora', length: 50, nullable: true })
  tipo_impresora!: string;

  @Column({ length: 50, nullable: true })
  imei!: string;

  @Column({ name: 'numero_telefonico', length: 20, nullable: true })
  numero_telefonico!: string;

  @Column({ name: 'version_so', length: 50, nullable: true })
  version_so!: string;

  @Column({ length: 50, nullable: true })
  almacenamiento!: string;

  @Column({ length: 50, nullable: true })
  operador!: string;

  @Column({ name: 'fecha_compra', type: 'date', nullable: true })
  fecha_compra!: string;

  @Column({ type: 'date', nullable: true })
  garantia!: string;

  @Column({ type: 'text', nullable: true })
  observaciones!: string;

  @Column({ name: 'estado_registro', type: 'int', default: 1 })
  estado_registro!: number;

  @OneToMany(() => Ticket, (ticket) => ticket.equipo)
  tickets!: Ticket[];
}
