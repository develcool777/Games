import { test, expect } from 'vitest'

const sum = (a: number): number => {
  return a + 2;
}

test('r', () => expect(sum(2)).toBe(4))