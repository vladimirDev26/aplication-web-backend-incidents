import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';

@Entity('equipos')
export class Equipo {
  @ApiProperty({ description: 'Id del equipo', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_equipo' })
  id_equipo!: number;

  @ApiPropertyOptional({ type: () => Usuario, description: 'Usuario asignado al equipo' })
  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_usuario' })
  usuario!: Usuario;

  @ApiPropertyOptional({ description: 'Id del usuario asignado', example: 1 })
  @Column({ name: 'id_usuario', type: 'int', nullable: true })
  id_usuario!: number;

  @ApiPropertyOptional({ description: 'Código patrimonial del equipo', example: 'EQ-2024-0001' })
  @Column({ name: 'codigo_patrimonial', length: 50, nullable: true })
  codigo_patrimonial!: string;

  @ApiPropertyOptional({ description: 'Nombre o etiqueta del equipo', example: 'Laptop HP ProBook' })
  @Column({ name: 'nombre_equipo', length: 100, nullable: true })
  nombre_equipo!: string;

  @ApiPropertyOptional({ description: 'Tipo de equipo', example: 'Laptop' })
  @Column({ length: 50, nullable: true })
  tipo!: string;

  @ApiPropertyOptional({ description: 'Marca del equipo', example: 'HP' })
  @Column({ length: 50, nullable: true })
  marca!: string;

  @ApiPropertyOptional({ description: 'Modelo del equipo', example: 'ProBook 450 G8' })
  @Column({ length: 100, nullable: true })
  modelo!: string;

  @ApiPropertyOptional({ description: 'Número de serie del equipo', example: '5CG1243ABC' })
  @Column({ length: 100, nullable: true })
  serie!: string;

  @ApiPropertyOptional({ description: 'Procesador del equipo', example: 'Intel Core i5-1135G7' })
  @Column({ length: 100, nullable: true })
  procesador!: string;

  @ApiPropertyOptional({ description: 'Memoria RAM del equipo', example: '16 GB' })
  @Column({ length: 50, nullable: true })
  ram!: string;

  @ApiPropertyOptional({ description: 'Disco de almacenamiento', example: '512 GB SSD' })
  @Column({ length: 100, nullable: true })
  disco!: string;

  @ApiPropertyOptional({ description: 'Sistema operativo instalado', example: 'Windows 11 Pro' })
  @Column({ name: 'sistema_operativo', length: 100, nullable: true })
  sistema_operativo!: string;

  @ApiPropertyOptional({ description: 'Tipo de impresora', example: 'Láser' })
  @Column({ name: 'tipo_impresora', length: 50, nullable: true })
  tipo_impresora!: string;

  @ApiPropertyOptional({ description: 'IMEI del equipo', example: '359021052137904' })
  @Column({ length: 50, nullable: true })
  imei!: string;

  @ApiPropertyOptional({ description: 'Número telefónico asociado', example: '999888777' })
  @Column({ name: 'numero_telefonico', length: 20, nullable: true })
  numero_telefonico!: string;

  @ApiPropertyOptional({ description: 'Versión del sistema operativo', example: '23H2' })
  @Column({ name: 'version_so', length: 50, nullable: true })
  version_so!: string;

  @ApiPropertyOptional({ description: 'Almacenamiento interno', example: '256 GB' })
  @Column({ length: 50, nullable: true })
  almacenamiento!: string;

  @ApiPropertyOptional({ description: 'Operador de telefonía', example: 'Movistar' })
  @Column({ length: 50, nullable: true })
  operador!: string;

  @ApiPropertyOptional({ description: 'Fecha de compra del equipo', example: '2024-01-15' })
  @Column({ name: 'fecha_compra', type: 'date', nullable: true })
  fecha_compra!: string;

  @ApiPropertyOptional({ description: 'Fecha de vencimiento de garantía', example: '2027-01-15' })
  @Column({ type: 'date', nullable: true })
  garantia!: string;

  @ApiPropertyOptional({ description: 'Observaciones del equipo', example: 'Equipo asignado al área de RRHH' })
  @Column({ type: 'text', nullable: true })
  observaciones!: string;

  @ApiProperty({ description: 'Estado del registro (1 activo, 0 inactivo)', example: 1 })
  @Column({ name: 'estado_registro', type: 'int', default: 1 })
  estado_registro!: number;

  @ApiPropertyOptional({ type: () => [Ticket], description: 'Tickets asociados al equipo' })
  @OneToMany(() => Ticket, (ticket) => ticket.equipo)
  tickets!: Ticket[];
}
