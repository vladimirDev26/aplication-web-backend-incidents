import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn({ name: 'id_categoria' })
  id_categoria!: number;

  @Column({ length: 100, nullable: true })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string;

  @Column({ name: 'estado_registro', type: 'int', default: 1 })
  estado_registro!: number;
}
