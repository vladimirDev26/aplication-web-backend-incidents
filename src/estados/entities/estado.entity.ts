import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('estados')
export class Estado {
  @PrimaryGeneratedColumn({ name: 'id_estado' })
  id_estado: number;

  @Column({ length: 50, nullable: true })
  nombre: string;

  @Column({ length: 20, nullable: true })
  color: string;
}
