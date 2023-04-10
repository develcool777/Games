export type Player = 'x' | 'o';
export type Cell = Player | '';
export type Board = Cell[][];
export type Result = Cell | 'd';
export type Level = 'easy' | 'normal' | 'hard';
export type Index = 0 | 1 | 2 | 3 | 4;
export type GameStatus = '' | 'start' | 'finish';
export type BoardSize = 3 | 5 | 7;
export type Opponent = 'user' | 'comp';

export interface Coordinates {
  x: Index;
  y: Index;
}

export interface Move extends Coordinates {
  cell: Player;
}

export interface Computer {
  isComp: boolean;
  isFirst: boolean;
  level: Level;
}

export interface Config {
  difficulty?: Level;
  boardSize?: BoardSize;
  side?: Player;
  opponent?: Opponent;
}

export interface Score {
  x: number;
  o: number;
  d: number;
}
