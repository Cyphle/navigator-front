import { fakeDatabase } from './fake-database';

export const getData = (): string[] => {
  return fakeDatabase('Pouet');
}