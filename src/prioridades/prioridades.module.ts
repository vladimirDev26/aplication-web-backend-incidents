import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prioridad } from './entities/prioridad.entity';
import { PrioridadesService } from './prioridades.service';
import { PrioridadesController } from './prioridades.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Prioridad])],
  controllers: [PrioridadesController],
  providers: [PrioridadesService],
})
export class PrioridadesModule {}
