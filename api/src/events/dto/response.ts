export enum LimitType {
  TIME = 'time',
  NODE = 'node',
  DEPTH = 'depth',
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Bestmove {
  export class Request {
    position: string;
    limit: Limit;
  }

  export class Limit {
    limit_type: LimitType;
    value: number;
  }

  export class Response {
    depth: number;
    seldepth: number;
    score: number;
    nodes: number;
    nps: number;
    hashfull: number;
    time: number;
    pv: string[];
    bestmove: string;
    ponder: string;
    multipv: number;
    constructor(response: string) {
      this.depth = this.filterValue('depth', response);
      this.seldepth = this.filterValue('seldepth', response);
      this.score = this.filterValue('score cp', response);
      this.nodes = this.filterValue('nodes', response);
      this.nps = this.filterValue('nps', response);
      this.hashfull = this.filterValue('hashfull', response);
      this.time = this.filterValue('time', response);
      this.pv = this.filterPV(response);
      this.bestmove = this.filterMove('bestmove', response);
      this.ponder = this.filterMove('ponder', response);
      this.multipv = this.filterValue('multipv', response) || 1;
    }

    // Return integer value
    filterValue(pattern: string, text: string): number {
      const regex = new RegExp(`${pattern}\\s([\\-0-9]*)`);
      if (regex.test(text)) {
        return Number(text.match(regex)[1]);
      }
      return null;
    }

    // Return Move
    filterMove(pattern: string, text: string): string {
      const regex = new RegExp(`${pattern}\\s(.{4})`);
      if (regex.test(text)) {
        return text.match(regex)[1];
      }
      return null;
    }

    // Return Moves
    filterPV(text: string): string[] {
      const regex = new RegExp(`pv((\\s[\\dA-Z][a-i\\*][\\dA-Z][a-i\\*])*)`);
      if (regex.test(text)) {
        return text.match(regex)[1].trim().split(' ');
      }
      return null;
    }
  }
}
