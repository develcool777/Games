import { ref, type Ref } from 'vue';
import type { Player, Board, Cell, Result, Coordinates, Move, Computer, Index, GameStatus, BoardSize } from '@/types/models/tictactoe';

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
      mode: 'easy',
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
    this.defineResult();
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

  private defineResult = (): void => {
    const avoidChecking = this.boardSize.value === 3 ? 5 : 7;
    if (this.getHistoryLength < avoidChecking) return;

    const isWin = (row: Cell[], rowCoordinates: Coordinates[]): boolean => {
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
        this.winCells.value = winCells;
      }

      return isWon;
    };

    const b = this.board.value;

    // rows
    for (let i = 0; i < this.boardSize.value; i++) {
      const coordinates = b.map((_, j) => ({ x: i, y: j } as Coordinates));
      if (isWin(b[i], coordinates)) return;
    }

    // cols
    for (let i = 0; i < this.boardSize.value; i++) {
      const column = b.map(row => row[i]);
      const coordinates = b.map((_, j) => ({ x: j, y: i } as Coordinates));
      if (isWin(column, coordinates)) return;
    }

    // const diagonals = [
    //   // left
    //   [b[0][0], b[1][1], b[2][2], b[3][3], b[4][4]],
    //   [b[1][0], b[2][1], b[3][2], b[4][3]],
    //   [b[0][1], b[1][2], b[2][3], b[3][4]],
    //   // right
    //   [b[0][4], b[1][3], b[2][2], b[3][1], b[4][0]],
    //   [b[0][3], b[1][2], b[2][1], b[3][0]],
    //   [b[1][4], b[2][3], b[3][2], b[4][1]],
    // ];
    // for (let i = 0; i < diagonals.length; i++) {
    //   result = isWin(diagonals[i]);
    //   if (result !== '') return result;
    // }

    this.result.value = this.getHistoryLength === this.amoutOfCells ? 'd' : '';
  };

  public startGame = (): void => {
    this.gameStatus.value = 'start';
    if (this.computer.value.isComp && this.computer.value.isFirst) this.compMove();
  };

  public finishGame = (): void => {
    this.gameStatus.value = 'finish';
  };
}
