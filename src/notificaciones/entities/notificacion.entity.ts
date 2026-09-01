import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';

@Entity('notificaciones')
export class Notificacion {
  @ApiProperty({ description: 'Id de la notificación', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_notificacion' })
  id_notificacion!: number;

  @ApiProperty({ type: () => Usuario, description: 'Usuario destinatario de la notificación' })
  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  @ApiProperty({ description: 'Id del usuario destinatario', example: 1 })
  @Column({ name: 'id_usuario', type: 'int' })
  id_usuario!: number;

  @ApiPropertyOptional({ type: () => Ticket, description: 'Ticket relacionado a la notificación' })
  @ManyToOne(() => Ticket, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_ticket' })
  ticket!: Ticket;

  @ApiPropertyOptional({ description: 'Id del ticket relacionado', example: 1 })
  @Column({ name: 'id_ticket', type: 'int', nullable: true })
  id_ticket!: number;

  @ApiProperty({ description: 'Tipo de notificación', example: 'asignacion' })
  @Column({ length: 50 })
  tipo!: string;

  @ApiProperty({ description: 'Título de la notificación', example: 'Nuevo ticket asignado' })
  @Column({ length: 150 })
  titulo!: string;

  @ApiProperty({ description: 'Mensaje de la notificación', example: 'Se le ha asignado el ticket INC-0001' })
  @Column({ type: 'text' })
  mensaje!: string;

  @ApiProperty({ description: 'Indica si la notificación fue leída', example: false })
  @Column({ type: 'boolean', default: false })
  leida!: boolean;

  @ApiProperty({ description: 'Fecha de creación de la notificación', example: '2024-01-15T10:30:00.000Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion!: Date;
}