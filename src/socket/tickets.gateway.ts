import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Ticket } from '../tickets/entities/ticket.entity';

type Accion = 'created' | 'updated';

@WebSocketGateway({
  cors: { origin: true, credentials: true },
  transports: ['websocket', 'polling'],
})
export class TicketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(TicketsGateway.name);

  @WebSocketServer()
  server!: Server;

  afterInit() {
    this.logger.log('Socket.io inicializado');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  emitirTicket(accion: Accion, ticket: Ticket) {
    this.server?.emit(`ticket.${accion}`, {
      id_ticket: ticket?.id_ticket,
      ticket: this.resumen(ticket),
    });
  }

  emitirEliminado(idTicket: number) {
    this.server?.emit('ticket.deleted', { id_ticket: idTicket });
  }

  emitirComentario(idTicket: number) {
    this.server?.emit('ticket.comentario', { id_ticket: idTicket });
  }

  private resumen(t: Ticket) {
    if (!t) return null;
    return {
      id_ticket: t.id_ticket,
      codigo: t.codigo,
      asunto: t.asunto,
      id_usuario: t.usuario?.id_usuario ?? t.id_usuario,
      id_responsable: t.responsable?.id_usuario ?? t.id_responsable,
      id_prioridad: t.prioridad?.id_prioridad ?? t.id_prioridad,
      id_estado: t.estado?.id_estado ?? t.id_estado,
      prioridad: t.prioridad?.nombre ?? null,
      estado: t.estado?.nombre ?? null,
      area: t.usuario?.area?.nombre ?? null,
    };
  }
}
