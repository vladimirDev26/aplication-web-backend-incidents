import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('categorias')
export class Categoria {
  @ApiProperty({ description: 'Id de la categoría', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_categoria' })
  id_categoria!: number;

  @ApiPropertyOptional({ description: 'Nombre de la categoría', example: 'Hardware' })
  @Column({ length: 100, nullable: true })
  nombre!: string;

  @ApiPropertyOptional({ description: 'Descripción de la categoría', example: 'Fallas relacionadas con hardware' })
  @Column({ type: 'text', nullable: true })
  descripcion!: string;

  @ApiProperty({ description: 'Estado del registro (1 activo, 0 inactivo)', example: 1 })
  @Column({ name: 'estado_registro', type: 'int', default: 1 })
  estado_registro!: number;
}
