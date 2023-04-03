import { ref, type Ref } from 'vue';
import type { Player, Board, Cell, Result, Coordinates, Move, Row, Computer, Index, GameStatus, BoardSize } from '@/types/models/tictactoe';

export default class Game {
  private player: Ref<Player>;
  private board: Ref<Board>;
  private boardSize: Ref<BoardSize>;
  private result: Ref<Result>;
  private history: Ref<Move[]>;
  private computer: Ref<Computer>;
  private gameStatus: Ref<GameStatus>;
  private winCells: Ref<Coordinates[]>;

  public constructor() {
    this.player = ref('x');
    this.result = ref('');
    this.board = ref([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ] as Board);
    this.computer = ref({
      isComp: false,
      isFirst: false,
      mode: 'easy',
    } as Computer);
    this.gameStatus = ref('');
    this.boardSize = ref(3);
    this.history = ref([]);
    this.winCells = ref([]);
  }

  public get getPlayer(): Player {
    return this.player.value;
  }

  public get getBoard(): Board {
    return this.board.value;
  }

  public get getBoardSize(): BoardSize {
    return this.boardSize.value;
  }

  public get getResult(): Result {
    return this.result.value;
  }

  public get getGameStatus(): GameStatus {
    return this.gameStatus.value;
  }

  public get getHistoryLength(): number {
    return this.history.value.length;
  }

  public get getWinCells(): number[] {
    return this.winCells.value.map(cell => this.index2Dto1D(cell));
  }

  private get amoutOfCells(): number {
    return Math.pow(this.boardSize.value, 2);
  }

  private get getAvailableMoves(): Coordinates[] {
    return this.board.value.reduce((acc, row, i) => {
      row.forEach((cell, j) => {
        if (cell !== '') return;
        acc.push({
          x: i as Index,
          y: j as Index,
        });
      });
      return acc;
    }, [] as Coordinates[]);
  }

  public index1DTo2D = (index: number): Coordinates => {
    return {
      x: Math.floor(index / this.boardSize.value) as Index,
      y: (index % this.boardSize.value) as Index,
    };
  };

  public index2Dto1D = (coordinates: Coordinates): number => {
    return coordinates.x * this.boardSize.value + coordinates.y;
  };

  public userMove = (coordinates: Coordinates) => {
    if (this.gameStatus.value !== 'start') throw Error('Game is not started');
    if (this.board.value[coordinates.x][coordinates.y] === undefined) throw Error('Wrong coordinates');
    if (this.board.value[coordinates.x][coordinates.y] !== '') throw Error('Cell is not empty');

    this.makeMove(coordinates);
    if (this.computer.value.isComp) this.compMove();
    if (this.result.value !== '') this.finishGame();
  };

  private makeMove = (coordinates: Coordinates): void => {
    this.board.value[coordinates.x][coordinates.y] = this.player.value;
    this.history.value.push({ ...coordinates, cell: this.player.value });
    this.player.value = this.player.value === 'x' ? 'o' : 'x';
    this.result.value = this.defineResult();
  };

  private compMove = (): void => {
    if (this.result.value !== '') return;
    const aMoves = this.getAvailableMoves;

    switch (this.computer.value.mode) {
      case 'easy': {
        return this.makeMove(aMoves[Math.floor(Math.random() * aMoves.length)]);
      }
      case 'hard': {
        // for now
        return this.makeMove(aMoves[Math.floor(Math.random() * aMoves.length)]);
      }
    }
  };

  public reset = (): void => {
    this.player.value = 'x';
    this.result.value = '';
    this.board.value = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    this.gameStatus.value = '';
    this.history.value = [];
    this.winCells.value = [];
  };

  public returnMove = (): void => {
    if (this.gameStatus.value !== 'start') throw Error('Game is not started');
    if (this.getHistoryLength === 0) throw Error('History is empty');

    this.removeMove();

    if (this.computer.value.isComp && this.getHistoryLength !== 0) {
      const compSide = this.computer.value.isFirst ? 'x' : 'o';
      const isUserLastTurn = compSide !== this.history.value.at(-1)?.cell;
      isUserLastTurn && this.removeMove();
    }

    this.player.value = this.history.value.at(-1)?.cell ?? 'x';
  };

  private removeMove = (): void => {
    const move = this.history.value.pop();
    if (move === undefined) return;
    this.board.value[move.x][move.y] = '';
  };

  private defineResult = (): Result => {
    if (this.getHistoryLength < 5) return '';
    const isWin = (a: Cell, b: Cell, c: Cell): boolean => a === b && b === c && a !== '';
    const defineWin = (type: 'row' | 'col' | 'd1' | 'd2', index?: number): void => {
      this.winCells.value.push(
        ...(b.map((_, i) => {
          switch (type) {
            case 'row':
              return { x: index, y: i };
            case 'col':
              return { x: i, y: index };
            case 'd1':
              return { x: i, y: i };
            case 'd2':
              return { x: i, y: 2 - i };
          }
        }) as Coordinates[])
      );
    };
    const b = this.board.value;

    // rows
    if (isWin(...b[0])) {
      defineWin('row', 0);
      return b[0][0];
    }
    if (isWin(...b[1])) {
      defineWin('row', 1);
      return b[1][0];
    }
    if (isWin(...b[2])) {
      defineWin('row', 2);
      return b[2][0];
    }

    // cols
    if (isWin(...(b.map(row => row[0]) as Row))) {
      defineWin('col', 0);
      return b[0][0];
    }
    if (isWin(...(b.map(row => row[1]) as Row))) {
      defineWin('col', 1);
      return b[0][1];
    }
    if (isWin(...(b.map(row => row[2]) as Row))) {
      defineWin('col', 2);
      return b[0][2];
    }

    // diagonals
    if (isWin(b[0][0], b[1][1], b[2][2])) {
      defineWin('d1');
      return b[1][1];
    }
    if (isWin(b[0][2], b[1][1], b[2][0])) {
      defineWin('d2');
      return b[1][1];
    }

    // draw
    if (this.getHistoryLength === this.amoutOfCells) return 'd';

    return '';
  };

  public startGame = (): void => {
    this.gameStatus.value = 'start';
    if (this.computer.value.isComp && this.computer.value.isFirst) this.compMove();
  };

  public finishGame = (): void => {
    this.gameStatus.value = 'finish';
  };
}
