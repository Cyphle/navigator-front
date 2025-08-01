import { describe, jest } from '@jest/globals';
import { getData } from './fake-api';

const mockFakeDatabase = jest.fn((additional: string): string[] => {
  return ['fake'];
});

jest.mock('./fake-database', () => {
  return {
    __esModule: true,
    fakeDatabase: (additional: string) => mockFakeDatabase(additional)
  };
});

describe('jest mock', () => {
  test('should mock fake database', () => {
    const data = getData();

    expect(data).toEqual(['fake']);
  })
});