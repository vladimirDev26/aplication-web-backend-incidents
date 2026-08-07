import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('historial')
export class Historial {
  @PrimaryGeneratedColumn({ name: 'id_historial' })
  id_historial: number;

  @ManyToOne(() => Ticket, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_ticket' })
  ticket: Ticket;

  @Column({ name: 'id_ticket', type: 'int', nullable: true })
  id_ticket: number;

  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ name: 'id_usuario', type: 'int', nullable: true })
  id_usuario: number;

  @Column({ length: 255, nullable: true })
  accion: string;

  @Column({ type: 'text', nullable: true })
  detalle: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;
}
