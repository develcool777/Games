import { ref, type Ref } from 'vue';
import type { Player, Board, Cell, Result, Coordinates, Move, Row, Computer, Index, GameStatus, BoardSize } from '@/types/models/tictactoe';

export default class Game {
  private player: Ref<Player>;
  private board: Ref<Board>;
  private boardSize: Ref<BoardSize>;
  private result: Ref<Result>;
  private history: Move[];
  private computer: Ref<Computer>;
  private gameStatus: Ref<GameStatus>;

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
    this.history = [];
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
    this.history.push({ ...coordinates, value: this.player.value });
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
    this.history = [];
  };

  public returnMove = (): void => {
    if (this.gameStatus.value !== 'start') throw Error('Game is not started');
    if (this.history.length === 0) throw Error('History is empty');

    this.history.pop();

    if (this.computer.value.isComp && this.history.length !== 0) {
      const compSide = this.computer.value.isFirst ? 'x' : 'o';
      const isUserLastTurn = compSide !== this.history.at(-1)?.value;
      isUserLastTurn && this.history.pop();
    }

    this.player.value = this.history.at(-1)?.value ?? 'x';
  };

  private defineResult = (): Result => {
    if (this.history.length < 5) return '';
    const isWin = (a: Cell, b: Cell, c: Cell): boolean => a === b && b === c && a !== '';
    const b = this.board.value;

    // rows
    if (isWin(...b[0])) return b[0][0];
    if (isWin(...b[1])) return b[1][0];
    if (isWin(...b[2])) return b[2][0];

    // cols
    if (isWin(...(b.map(row => row[0]) as Row))) return b[0][0];
    if (isWin(...(b.map(row => row[1]) as Row))) return b[0][1];
    if (isWin(...(b.map(row => row[2]) as Row))) return b[0][2];

    // diagonals
    if (isWin(b[0][0], b[1][1], b[2][2])) return b[1][1];
    if (isWin(b[0][2], b[1][1], b[0][2])) return b[1][1];

    // draw
    if (this.history.length === this.board.value.length) return 'd';

    return '';
  };

  public startGame = (): void => {
    this.gameStatus.value = 'start';
    if (this.computer.value.isComp && this.computer.value.isFirst) this.compMove();
  };

  public finishGame = (): void => {
    this.gameStatus.value = 'finish';
    this.reset();
  };
}
