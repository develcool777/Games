import { ref, type Ref } from 'vue';
import type { Player, Board, Cell, Result, Coordinates, Move, Computer, Index, GameStatus, BoardSize, Config } from '@/types/models/tictactoe';
import AI from '@/models/tictactoe/ai';

export default class Game {
  private player: Ref<Player>;
  private board: Ref<Board>;
  private boardSize: Ref<BoardSize>;
  private result: Ref<Result>;
  private history: Ref<Move[]>;
  private computer: Ref<Computer>;
  private gameStatus: Ref<GameStatus>;
  private winCells: Ref<Coordinates[]>;

  public constructor(boardSize: BoardSize = 3) {
    if (![3, 5, 7].includes(boardSize)) throw Error('Wrong size for boardSize, expected: 3, 5, 7');

    this.player = ref('x');
    this.result = ref('');
    this.boardSize = ref(boardSize);
    this.board = ref(this.createBoard());
    this.computer = ref({
      isComp: false,
      isFirst: false,
      level: 'easy',
    } as Computer);
    this.gameStatus = ref('');
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

  public get getConfig(): Config {
    return {
      boardSize: this.boardSize.value,
      opponent: this.computer.value.isComp ? 'comp' : 'user',
      side: this.computer.value.isFirst ? 'o' : 'x',
      difficulty: this.computer.value.level,
    };
  }

  private get amoutOfCells(): number {
    return Math.pow(this.boardSize.value, 2);
  }

  private get getDiagonals(): [Cell[][], Coordinates[][]] {
    const amountOfWinCells = this.boardSize.value === 3 ? 3 : 4;
    const coords: Coordinates[][] = [];
    const rows: Cell[][] = [];
    let diagonal: Coordinates[] = [];
    let row: Cell[] = [];

    const pushOnly = (x: number, y: number): void => {
      diagonal.push({ x, y } as Coordinates);
      row.push(this.board.value[x][y]);
    };

    const pushAndReset = (): void => {
      if (diagonal.length >= amountOfWinCells) {
        coords.push(diagonal);
        rows.push(row);
      }
      diagonal = [];
      row = [];
    };

    // diagonals from top-left to botom-right
    for (let i = 0; i < this.boardSize.value; i++) {
      // diagonals from top-left to bottom-right, towards bottom-left corner
      for (let j = 0; j < this.boardSize.value; j++) {
        const x = i + j;
        if (x >= this.boardSize.value) break;
        pushOnly(x, j);
      }
      pushAndReset();

      // diagonals from top-right to bottom-left, towards bottom-right corner
      for (let j = this.boardSize.value - 1; j >= 0; j--) {
        const x = this.boardSize.value - 1 + i - j;
        if (x >= this.boardSize.value) break;
        pushOnly(x, j);
      }
      pushAndReset();

      // skip one step to avoid dublicate of main diagonals
      if (i === 0) continue;

      // diagonals from top-left to bottom-right, towards top-right corner
      for (let j = 0; j < this.boardSize.value; j++) {
        const x = j - i;
        if (x < 0) continue;
        pushOnly(x, j);
      }
      pushAndReset();

      // diagonals from top-right to bottom-left, towards top-left corner
      for (let j = this.boardSize.value - 1; j >= 0; j--) {
        const x = this.boardSize.value - 1 - i - j;
        if (x < 0) continue;
        pushOnly(x, j);
      }
      pushAndReset();
    }

    return [rows, coords];
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

  public userMove = (coordinates: Coordinates): void => {
    if (this.gameStatus.value !== 'start') throw Error('Game is not started');
    if (this.board.value[coordinates.x][coordinates.y] === undefined) throw Error('Wrong coordinates');
    if (this.board.value[coordinates.x][coordinates.y] !== '') throw Error('Cell is not empty');

    this.makeMove(coordinates);
    if (this.computer.value.isComp) this.compMove();
    if (this.result.value !== '') this.finishGame();
  };

  private compMove = (): void => {
    if (this.result.value !== '') return;

    const ai = new AI(this.board.value, this.player.value);
    const move = ai.makeMove(this.computer.value.level);
    if (move === null) throw Error('AI move is null');
    this.makeMove(move);
  };

  private makeMove = (coordinates: Coordinates): void => {
    this.board.value[coordinates.x][coordinates.y] = this.player.value;
    this.history.value.push({ ...coordinates, cell: this.player.value });
    this.player.value = this.player.value === 'x' ? 'o' : 'x';
    this.defineResult();
  };

  public reset = (): void => {
    this.player.value = 'x';
    this.result.value = '';
    this.board.value = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    this.board.value = this.createBoard();
    this.gameStatus.value = '';
    this.history.value = [];
    this.winCells.value = [];
  };

  private createBoard = (): Board => {
    const board = [] as Board;
    for (let i = 0; i < this.boardSize.value; i++) {
      const row = [] as Cell[];
      for (let j = 0; j < this.boardSize.value; j++) {
        row.push('');
      }
      board.push(row);
    }

    return board;
  };

  public returnMove = (): void => {
    if (this.gameStatus.value !== 'start') throw Error('Game is not started');
    if (this.getHistoryLength === 0) throw Error('History is empty');

    this.removeMove();
    if (!this.computer.value.isComp || this.getHistoryLength === 0) return;

    const compSide = this.computer.value.isFirst ? 'x' : 'o';
    const isUserLastTurn = compSide !== this.history.value.at(-1)?.cell;
    isUserLastTurn && this.removeMove();
  };

  private removeMove = (): void => {
    const move = this.history.value.pop();
    if (move === undefined) {
      this.player.value = 'x';
      return;
    }
    this.board.value[move.x][move.y] = '';
    this.player.value = move.cell;
  };

  private isWin = (row: Cell[], rowCoordinates: Coordinates[]): boolean => {
    if (row.length !== rowCoordinates.length) throw Error('row and rowCoordinates do not have same length');

    let winCells: Coordinates[] = [];
    const amountOfWinCells = this.boardSize.value === 3 ? 3 : 4;

    const winRow = row.reduce((acc, cell, i) => {
      if (acc.length === amountOfWinCells) return acc;
      if (cell === '' || (acc.length !== 0 && acc.at(-1) !== cell)) {
        acc = [];
        winCells = [];
      }
      acc.push(cell);
      winCells.push(rowCoordinates[i]);

      return acc;
    }, [] as Cell[]);

    const isWon = winRow.length === amountOfWinCells;
    if (isWon) {
      this.result.value = winRow[0];
      this.winCells.value.push(...winCells);
    }

    return isWon;
  };

  private defineResult = (): void => {
    const avoidChecking = this.boardSize.value === 3 ? 5 : 7;
    if (this.getHistoryLength < avoidChecking) return;
    const b = this.board.value;

    // rows
    for (let i = 0; i < this.boardSize.value; i++) {
      const coordinates = b.map((_, j) => ({ x: i, y: j } as Coordinates));
      this.isWin(b[i], coordinates);
    }

    // cols
    for (let i = 0; i < this.boardSize.value; i++) {
      const column = b.map(row => row[i]);
      const coordinates = b.map((_, j) => ({ x: j, y: i } as Coordinates));
      this.isWin(column, coordinates);
    }

    // diagonals
    const diagonals = this.getDiagonals;
    for (let i = 0; i < diagonals[0].length; i++) this.isWin(diagonals[0][i], diagonals[1][i]);

    if (this.result.value !== '') return;
    this.result.value = this.getHistoryLength === this.amoutOfCells ? 'd' : '';
  };

  public startGame = (): void => {
    this.gameStatus.value = 'start';
    if (this.computer.value.isComp && this.computer.value.isFirst) this.compMove();
  };

  public finishGame = (): void => {
    this.gameStatus.value = 'finish';
  };

  public defineConfig = (config: Config): void => {
    if (config.boardSize) this.boardSize.value = config.boardSize;
    if (config.difficulty) this.computer.value.level = config.difficulty;
    if (config.opponent) this.computer.value.isComp = config.opponent === 'comp';
    if (config.side) this.computer.value.isFirst = config.side === 'o';

    this.reset();
  };
}
