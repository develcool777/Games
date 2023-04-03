export type Player = 'x' | 'o';
export type Cell = Player | '';
export type Board = Cell[][];
export type Result = Cell | 'd';
export type Mode = 'easy' | 'hard';
export type Index = 0 | 1 | 2;
export type GameStatus = '' | 'start' | 'finish';
export type BoardSize = 3 | 5 | 7;

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
  mode: Mode;
}
