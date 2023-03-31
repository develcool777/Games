import type { Player, Board, Cell, Result, Coordinates, Move, Row, Computer, Index, GameStatus } from '@/types/models/tictactoe';

export default class Game {
  private player: Player;
  private board: Board;
  private result: Result;
  private history: Move[];
  private computer: Computer;
  private gameStatus: GameStatus;

  public constructor() {
    this.player = 'x';
    this.result = '';
    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    this.history = [];
    this.computer = {
      isComp: false,
      isFirst: false,
      mode: 'easy',
    };
    this.gameStatus = '';
  }

  public get getPlayer(): Player {
    return this.player;
  }

  public get getBoard(): Board {
    return this.board;
  }

  public get getResult(): Result {
    return this.result;
  }

  public get getGameStatus(): GameStatus {
    return this.gameStatus;
  }

  private get getAvailableMoves(): Coordinates[] {
    return this.board.reduce((acc, row, i) => {
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

  public userMove = (coordinates: Coordinates) => {
    if (this.gameStatus !== 'start') throw Error('Game is not started');
    if (this.board[coordinates.x][coordinates.y] === undefined) throw Error('Wrong coordinates');
    if (this.board[coordinates.x][coordinates.y] !== '') throw Error('Cell is not empty');

    this.makeMove(coordinates);
    if (this.computer.isComp) this.compMove();
    if (this.result !== '') this.finishGame();
  };

  private makeMove = (coordinates: Coordinates): void => {
    this.board[coordinates.x][coordinates.y] = this.player;
    this.history.push({ ...coordinates, value: this.player });
    this.player = this.player === 'x' ? 'o' : 'x';
    this.result = this.defineResult();
  };

  private compMove = (): void => {
    if (this.result !== '') return;
    const aMoves = this.getAvailableMoves;

    switch (this.computer.mode) {
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
    this.player = 'x';
    this.result = '';
    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    this.history = [];
  };

  public returnMove = (): void => {
    if (this.gameStatus !== 'start') throw Error('Game is not started');
    if (this.history.length === 0) throw Error('History is empty');

    this.history.pop();

    if (this.computer.isComp && this.history.length !== 0) {
      const compSide = this.computer.isFirst ? 'x' : 'o';
      const isUserLastTurn = compSide !== this.history.at(-1)?.value;
      isUserLastTurn && this.history.pop();
    }

    this.player = this.history.at(-1)?.value ?? 'x';
  };

  private defineResult = (): Result => {
    if (this.history.length < 5) return '';
    const isWin = (a: Cell, b: Cell, c: Cell): boolean => a === b && b === c && a !== '';
    const b = this.board;

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
    if (this.history.length === this.board.length) return 'd';

    return '';
  };

  public startGame = (): void => {
    this.gameStatus = 'start';
    if (this.computer.isComp && this.computer.isFirst) this.compMove();
  };

  public finishGame = (): void => {
    this.gameStatus = 'finish';
    this.reset();
  };
}
