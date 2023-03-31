import { describe, test, expect } from 'vitest'
import Game from '@/models/tictactoe/game';

describe('Game', () => {
  test('test instance', () => expect(new Game()).toBeInstanceOf(Game));

  describe('getters', () => {
    const g = new Game();
    test('getPlayer', () => expect(g.getPlayer).toBe('x'));
    test('getResult', () => expect(g.getResult).toBe(''));
    test('getGameStatus', () => expect(g.getGameStatus).toBe(''));
    test('getBoard', () => expect(g.getBoard).toEqual([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]));
  });

  describe('makeMove', () => {
    test('error(started)', () => {
      const g = new Game();
      expect(() => g.userMove({ x: 0, y: 0 })).toThrowError('Game is not started');
    });
    test('error(empty)', () => {
      const g = new Game();
      g.startGame();
      g.userMove({ x: 0, y: 0 });
      expect(() => g.userMove({ x: 0, y: 0 })).toThrowError('Cell is not empty');
    });
  });
})