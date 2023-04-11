import type { Board, Coordinates, Level, Cell, BoardSize, Result, Score, Player } from '@/types/models/tictactoe';

export default class AI {
  private board: Board;
  private boardSize: BoardSize;
  private score: Score;
  private aiSide: Player;

  public constructor(board: Board, side: Player) {
    this.board = JSON.parse(JSON.stringify(board)) as Board;
    this.boardSize = this.board.length as BoardSize;
    this.aiSide = side;
    this.score = {
      x: side === 'x' ? 10 : -10,
      o: side === 'o' ? 10 : -10,
      d: 0,
    };
  }

  private get getDiagonals(): Cell[][] {
    const amountOfWinCells = this.boardSize === 3 ? 3 : 4;
    const diagonals: Cell[][] = [];
    let diagonal: Cell[] = [];

    const pushAndReset = (): void => {
      if (diagonal.length >= amountOfWinCells) diagonals.push(diagonal);
      diagonal = [];
    };

    // diagonals from top-left to botom-right
    for (let i = 0; i < this.boardSize; i++) {
      // diagonals from top-left to bottom-right, towards bottom-left corner
      for (let j = 0; j < this.boardSize; j++) {
        const x = i + j;
        if (x >= this.boardSize) break;
        diagonal.push(this.board[x][j]);
      }
      pushAndReset();

      // diagonals from top-right to bottom-left, towards bottom-right corner
      for (let j = this.boardSize - 1; j >= 0; j--) {
        const x = this.boardSize - 1 + i - j;
        if (x >= this.boardSize) break;
        diagonal.push(this.board[x][j]);
      }
      pushAndReset();

      // skip one step to avoid dublicate of main diagonals
      if (i === 0) continue;

      // diagonals from top-left to bottom-right, towards top-right corner
      for (let j = 0; j < this.boardSize; j++) {
        const x = j - i;
        if (x < 0) continue;
        diagonal.push(this.board[x][j]);
      }
      pushAndReset();

      // diagonals from top-right to bottom-left, towards top-left corner
      for (let j = this.boardSize - 1; j >= 0; j--) {
        const x = this.boardSize - 1 - i - j;
        if (x < 0) continue;
        diagonal.push(this.board[x][j]);
      }
      pushAndReset();
    }

    return diagonals;
  }

  private get getAvailableMoves(): Coordinates[] {
    return this.board.reduce((acc, row, i) => {
      row.forEach((cell, j) => {
        if (cell !== '') return;
        acc.push({ x: i, y: j } as Coordinates);
      });
      return acc;
    }, [] as Coordinates[]);
  }

  public makeMove = (level: Level): Coordinates | null => {
    switch (level) {
      case 'easy':
        return this.easyMove();
      case 'normal':
        return this.normalMove();
      case 'hard':
        return this.hardMove();
    }
  };

  private isWin = (row: Cell[]): Result => {
    const amountOfWinCells = this.boardSize === 3 ? 3 : 4;

    const winRow = row.reduce((acc, cell) => {
      if (acc.length === amountOfWinCells) return acc;
      if (cell === '' || (acc.length !== 0 && acc.at(-1) !== cell)) acc = [];
      acc.push(cell);

      return acc;
    }, [] as Cell[]);

    return winRow.length === amountOfWinCells ? winRow[0] : '';
  };

  private defineResult = (): Result => {
    // rows
    for (let i = 0; i < this.boardSize; i++) {
      const isWin = this.isWin(this.board[i]);
      if (isWin !== '') return isWin;
    }

    // cols
    for (let i = 0; i < this.boardSize; i++) {
      const column = this.board.map(row => row[i]);
      const isWin = this.isWin(column);
      if (isWin !== '') return isWin;
    }

    // diagonals
    const diagonals = this.getDiagonals;
    for (let i = 0; i < diagonals.length; i++) {
      const isWin = this.isWin(diagonals[i]);
      if (isWin !== '') return isWin;
    }

    return this.getAvailableMoves.length === 0 ? 'd' : '';
  };

  private easyMove = (): Coordinates => {
    const aMoves = this.getAvailableMoves;
    return aMoves[Math.floor(Math.random() * aMoves.length)];
  };

  private normalMove = (): Coordinates => {
    return { x: 1, y: 1 };
  };

  private hardMove = (): Coordinates | null => {
    let bestScore = -Infinity;
    let bestMove: Coordinates | null = null;

    this.getAvailableMoves.forEach(move => {
      this.board[move.x][move.y] = this.aiSide;
      const score = this.minMax(0, -Infinity, Infinity, false);
      this.board[move.x][move.y] = '';

      if (score > bestScore) {
        bestMove = move;
        bestScore = score;
      }
    });

    return bestMove;
  };

  private minMax = (depth: number, alpha: number, beta: number, isMax: boolean): number => {
    const result = this.defineResult();
    if (result !== '') return this.score[result];

    const aMoves = this.getAvailableMoves;

    if (isMax) {
      let bestScore = -Infinity;
      for (let i = 0; i < aMoves.length; i++) {
        const move = aMoves[i];

        this.board[move.x][move.y] = this.aiSide;
        const score = this.minMax(depth + 1, alpha, beta, false);
        this.board[move.x][move.y] = '';

        bestScore = Math.max(bestScore, score);
        alpha = Math.max(alpha, bestScore);

        // Alpha Beta Pruning
        if (beta <= alpha) break;
      }
      return bestScore;
    }

    let bestScore = Infinity;
    for (let i = 0; i < aMoves.length; i++) {
      const move = aMoves[i];

      this.board[move.x][move.y] = this.aiSide === 'x' ? 'o' : 'x';
      const score = this.minMax(depth + 1, alpha, beta, true);
      this.board[move.x][move.y] = '';

      bestScore = Math.min(bestScore, score);
      beta = Math.min(beta, bestScore);

      // Alpha Beta Pruning
      if (beta <= alpha) break;
    }
    return bestScore;
  };
}
