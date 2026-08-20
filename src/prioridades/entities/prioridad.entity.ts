import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('prioridades')
export class Prioridad {
  @PrimaryGeneratedColumn({ name: 'id_prioridad' })
  id_prioridad!: number;

  @Column({ length: 30, nullable: true })
  nombre!: string;

  @Column({ type: 'int', nullable: true })
  tiempo_respuesta!: number;

  @Column({ name: 'sla_respuesta_min', type: 'int', nullable: true })
  sla_respuesta_min!: number;

  @Column({ name: 'sla_resolucion_min', type: 'int', nullable: true })
  sla_resolucion_min!: number;

  @Column({ length: 20, nullable: true })
  color!: string;

  @Column({ name: 'estado_registro', type: 'int', default: 1 })
  estado_registro!: number;
}
