import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { HistorialModule } from '../historial/historial.module';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), HistorialModule, SocketModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
