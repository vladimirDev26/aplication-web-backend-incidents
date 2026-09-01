import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Ticket } from '../../tickets/entities/ticket.entity';

@Entity('adjuntos')
export class Adjunto {
  @ApiProperty({ description: 'Id del adjunto', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_adjunto' })
  id_adjunto!: number;

  @ApiPropertyOptional({ type: () => Ticket, description: 'Ticket al que pertenece el adjunto' })
  @ManyToOne(() => Ticket, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_ticket' })
  ticket!: Ticket;

  @ApiPropertyOptional({ description: 'Id del ticket asociado', example: 1 })
  @Column({ name: 'id_ticket', type: 'int', nullable: true })
  id_ticket!: number;

  @ApiPropertyOptional({ description: 'Nombre original del archivo', example: 'evidencia.png' })
  @Column({ name: 'nombre_original', length: 255, nullable: true })
  nombre_original!: string;

  @ApiPropertyOptional({ description: 'Nombre interno del archivo', example: 'abc123.png' })
  @Column({ name: 'nombre_archivo', length: 255, nullable: true })
  nombre_archivo!: string;

  @ApiPropertyOptional({ description: 'Ruta interna del archivo', example: '/uploads/abc123.png' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  ruta!: string;

  @ApiPropertyOptional({ description: 'URL pública del archivo', example: 'https://res.cloudinary.com/demo/abc123.png' })
  @Column({ type: 'text', nullable: true })
  url!: string;

  @ApiPropertyOptional({ description: 'Identificador público en Cloudinary', example: 'incidencias/abc123' })
  @Column({ name: 'public_id', length: 255, nullable: true })
  public_id!: string;

  @ApiPropertyOptional({ description: 'Extensión del archivo', example: 'png' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  extension!: string;

  @ApiPropertyOptional({ description: 'Tamaño del archivo en bytes', example: '51200' })
  @Column({ type: 'bigint', nullable: true })
  tamano!: string;

  @ApiProperty({ description: 'Fecha de subida del archivo', example: '2024-01-15T10:30:00.000Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha!: Date;
}
