import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('prioridades')
export class Prioridad {
  @PrimaryGeneratedColumn({ name: 'id_prioridad' })
  id_prioridad: number;

  @Column({ length: 30, nullable: true })
  nombre: string;

  @Column({ type: 'int', nullable: true })
  tiempo_respuesta: number;

  @Column({ length: 20, nullable: true })
  color: string;
}
