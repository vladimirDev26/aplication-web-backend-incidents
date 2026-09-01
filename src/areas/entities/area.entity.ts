import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('areas')
export class Area {
  @ApiProperty({ description: 'Id del área', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_area' })
  id_area!: number;

  @ApiProperty({ description: 'Nombre del área', example: 'Tecnología de la Información' })
  @Column({ length: 100 })
  nombre!: string;

  @ApiPropertyOptional({ description: 'Descripción del área', example: 'Área encargada del soporte TI' })
  @Column({ type: 'text', nullable: true })
  descripcion!: string;

  @ApiProperty({ description: 'Estado del registro (1 activo, 0 inactivo)', example: 1 })
  @Column({ name: 'estado_registro', type: 'int', default: 1 })
  estado_registro!: number;

  @ApiProperty({ description: 'Fecha de creación del área', example: '2024-01-15T10:30:00.000Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion!: Date;

  @ApiPropertyOptional({ type: () => [Usuario], description: 'Usuarios pertenecientes al área' })
  @OneToMany(() => Usuario, (usuario) => usuario.area)
  usuarios!: Usuario[];
}
