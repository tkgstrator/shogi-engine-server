import { Injectable } from '@nestjs/common';
import { Socket } from 'dgram';
import { Bestmove, LimitType } from './dto/response';
const spawn = require('child_process').spawn;
const engine = spawn('engine/YaneuraOu-by-gcc');

@Injectable()
export class EventsService {
  constructor() {
    engine.stdout.pipe(process.stdout);
    engine.stdin.write('setoption name EvalDir value engine/eval\n');
    engine.stdin.write('setoption name BookFile value no_book\n');
    engine.stdin.write('usi\n');
    engine.stdin.write('isready\n');
    engine.stdin.write('position startpos\n');
  }

  command(usi: string): string {
    engine.stdin.write(usi + '\n');
    return;
  }

  bestmove(client: Socket, request: Bestmove.Request) {
    if (request.position.length === 0) {
      engine.stdin.write('position startpos\n');
    } else {
      engine.stdin.write(`position ${request.position}\n`);
    }
    switch (request.limit.limit_type) {
      case LimitType.TIME:
        engine.stdin.write(`go movetime ${request.limit.value}\n`);
        break;
      case LimitType.NODE:
        engine.stdin.write(`go nodes ${request.limit.value}\n`);
        break;
      case LimitType.DEPTH:
        engine.stdin.write(`go depth ${request.limit.value}\n`);
        break;
    }

    engine.stdout.on('data', (data) => {
      const response = new Bestmove.Response(data.toString());
      client.emit('bestmove', response);
    });
  }

  eval(client: Socket, timelimit: number) {
    engine.stdin.write(`go byoyomi ${timelimit}\n`);
    engine.stdout.on((data) => {
      console.log(data.toString());
    });
  }
}
