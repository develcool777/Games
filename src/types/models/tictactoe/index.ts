export type Player = 'x' | 'o';
export type Cell = Player | '';
export type Row = [Cell, Cell, Cell];
export type Board = [Row, Row, Row];
export type Result = Cell | 'd';
export type Mode = 'easy' | 'hard';
export type Index = 0 | 1 | 2;
export type GameStatus = '' | 'start' | 'finish';

export interface Coordinates {
  x: Index;
  y: Index;
}

export interface Move extends Coordinates {
  value: Player;
}

export interface Computer {
  isComp: boolean;
  isFirst: boolean;
  mode: Mode;
}
