import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('comentarios')
export class Comentario {
  @ApiProperty({ description: 'Id del comentario', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_comentario' })
  id_comentario!: number;

  @ApiPropertyOptional({ type: () => Ticket, description: 'Ticket al que pertenece el comentario' })
  @ManyToOne(() => Ticket, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_ticket' })
  ticket!: Ticket;

  @ApiPropertyOptional({ description: 'Id del ticket asociado', example: 1 })
  @Column({ name: 'id_ticket', type: 'int', nullable: true })
  id_ticket!: number;

  @ApiPropertyOptional({ type: () => Usuario, description: 'Usuario que realizó el comentario' })
  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  @ApiPropertyOptional({ description: 'Id del usuario que realizó el comentario', example: 1 })
  @Column({ name: 'id_usuario', type: 'int', nullable: true })
  id_usuario!: number;

  @ApiPropertyOptional({ description: 'Contenido del comentario', example: 'Se cambió la memoria RAM.' })
  @Column({ type: 'text', nullable: true })
  comentario!: string;

  @ApiProperty({ description: 'Fecha del comentario', example: '2024-01-15T10:30:00.000Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha!: Date;
}
