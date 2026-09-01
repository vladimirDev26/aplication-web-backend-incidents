import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('prioridades')
export class Prioridad {
  @ApiProperty({ description: 'Id de la prioridad', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_prioridad' })
  id_prioridad!: number;

  @ApiPropertyOptional({ description: 'Nombre de la prioridad', example: 'Alta' })
  @Column({ length: 30, nullable: true })
  nombre!: string;

  @ApiPropertyOptional({ description: 'Tiempo de respuesta esperado en minutos', example: 30 })
  @Column({ type: 'int', nullable: true })
  tiempo_respuesta!: number;

  @ApiPropertyOptional({ description: 'SLA de respuesta en minutos', example: 60 })
  @Column({ name: 'sla_respuesta_min', type: 'int', nullable: true })
  sla_respuesta_min!: number;

  @ApiPropertyOptional({ description: 'SLA de resolución en minutos', example: 480 })
  @Column({ name: 'sla_resolucion_min', type: 'int', nullable: true })
  sla_resolucion_min!: number;

  @ApiPropertyOptional({ description: 'Color asociado a la prioridad', example: '#FF0000' })
  @Column({ length: 20, nullable: true })
  color!: string;

  @ApiProperty({ description: 'Estado del registro (1 activo, 0 inactivo)', example: 1 })
  @Column({ name: 'estado_registro', type: 'int', default: 1 })
  estado_registro!: number;
}
