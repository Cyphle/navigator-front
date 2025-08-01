import { describe, expect, test } from '@jest/globals';

describe('Test example', () => {
  test('should add a to b', () => {
    const a = 1;
    const b = 2;
    const result = a + b;

    expect(result).toBe(3);
  })
})