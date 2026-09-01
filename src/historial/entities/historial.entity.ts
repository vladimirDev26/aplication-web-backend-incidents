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

@Entity('historial')
export class Historial {
  @ApiProperty({ description: 'Id del registro de historial', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_historial' })
  id_historial: number;

  @ApiPropertyOptional({ type: () => Ticket, description: 'Ticket al que pertenece el registro' })
  @ManyToOne(() => Ticket, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_ticket' })
  ticket: Ticket;

  @ApiPropertyOptional({ description: 'Id del ticket asociado', example: 1 })
  @Column({ name: 'id_ticket', type: 'int', nullable: true })
  id_ticket: number;

  @ApiPropertyOptional({ type: () => Usuario, description: 'Usuario que realizó la acción' })
  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ApiPropertyOptional({ description: 'Id del usuario que realizó la acción', example: 1 })
  @Column({ name: 'id_usuario', type: 'int', nullable: true })
  id_usuario: number;

  @ApiPropertyOptional({ description: 'Acción realizada', example: 'Ticket asignado' })
  @Column({ length: 255, nullable: true })
  accion: string;

  @ApiPropertyOptional({ description: 'Detalle de la acción', example: 'Se asignó a Juan Pérez' })
  @Column({ type: 'text', nullable: true })
  detalle: string;

  @ApiProperty({ description: 'Fecha de la acción', example: '2024-01-15T10:30:00.000Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @ApiProperty({ description: 'Estado del registro (1 activo, 0 inactivo)', example: 1 })
  @Column({ name: 'estado_registro', type: 'int', default: 1 })
  estado_registro!: number;
}
