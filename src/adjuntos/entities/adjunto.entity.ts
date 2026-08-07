import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Ticket } from '../../tickets/entities/ticket.entity';

@Entity('adjuntos')
export class Adjunto {
  @PrimaryGeneratedColumn({ name: 'id_adjunto' })
  id_adjunto: number;

  @ManyToOne(() => Ticket, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_ticket' })
  ticket: Ticket;

  @Column({ name: 'id_ticket', type: 'int', nullable: true })
  id_ticket: number;

  @Column({ name: 'nombre_original', length: 255, nullable: true })
  nombre_original: string;

  @Column({ name: 'nombre_archivo', length: 255, nullable: true })
  nombre_archivo: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  ruta: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  extension: string;

  @Column({ type: 'bigint', nullable: true })
  tamano: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;
}
