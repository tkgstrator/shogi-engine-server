import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import { Server } from 'socket.io';
import { Bestmove } from './events/dto/response';
import { EventsService } from './events/events.service';

export enum USI_COMMAND {
  BESTMOVE = 'bestmove',
  EVAL = 'eval',
  POSITION = 'position',
}

@WebSocketGateway()
export class EventsGateway {
  constructor(private readonly service: EventsService) {}

  @WebSocketServer()
  server: Server;

  // Return bestmove
  @SubscribeMessage('bestmove')
  handleEvent(
    @MessageBody() request: Bestmove.Request,
    @ConnectedSocket() client: Socket,
  ) {
    this.service.bestmove(client, request);
    return;
  }
}
