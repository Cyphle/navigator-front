import { getOne, post, put, deleteOne } from '../helpers/http';
import {
  getAllMagicLists,
  getMagicListById,
  createMagicList,
  updateMagicList,
  deleteMagicList,
  addItemToMagicList,
  updateItemInMagicList,
  deleteItemFromMagicList,
  clearCompletedMagicListItems,
} from './magic-lists.service';

jest.mock('../helpers/http', () => ({
  getOne: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  deleteOne: jest.fn(),
}));

const TEST_FAMILY_ID = '1';

const rawMagicList = {
  id: 1,
  name: 'Tâches du foyer',
  type: 'PERSONAL',
  items: [
    { id: 10, title: 'Faire la vaisselle', status: 'TODO', createdAt: '2026-03-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z' },
  ],
  createdAt: '2026-03-01T10:00:00Z',
  updatedAt: '2026-03-01T10:00:00Z',
};

describe('magic-lists service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAllMagicLists calls correct endpoint and maps response', async () => {
    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) =>
      Promise.resolve(mapper([rawMagicList]))
    );

    const result = await getAllMagicLists(TEST_FAMILY_ID);

    expect(getOne).toHaveBeenCalledWith('families/1/magic-lists', expect.any(Function));
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Tâches du foyer');
    expect(result[0].items[0].title).toBe('Faire la vaisselle');
  });

  test('getMagicListById calls correct endpoint', async () => {
    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) =>
      Promise.resolve(mapper(rawMagicList))
    );

    const result = await getMagicListById(TEST_FAMILY_ID, 1);

    expect(getOne).toHaveBeenCalledWith('families/1/magic-lists/1', expect.any(Function));
    expect(result.id).toBe(1);
  });

  test('createMagicList posts to correct endpoint', async () => {
    (post as jest.Mock).mockImplementation((_path: string, _body: any, mapper: (data: any) => any) =>
      Promise.resolve(mapper(rawMagicList))
    );

    const input = { name: 'Nouvelle liste', type: 'PERSONAL' as const, kind: 'SIMPLE' as const };
    await createMagicList(TEST_FAMILY_ID, input);

    expect(post).toHaveBeenCalledWith('families/1/magic-lists', input, expect.any(Function));
  });

  test('updateMagicList puts to correct endpoint', async () => {
    (put as jest.Mock).mockImplementation((_path: string, _body: any, mapper: (data: any) => any) =>
      Promise.resolve(mapper(rawMagicList))
    );

    await updateMagicList(TEST_FAMILY_ID, 1, { name: 'Nouveau nom' });

    expect(put).toHaveBeenCalledWith('families/1/magic-lists/1', { name: 'Nouveau nom' }, expect.any(Function));
  });

  test('deleteMagicList deletes correct endpoint', async () => {
    (deleteOne as jest.Mock).mockResolvedValue(undefined);

    await deleteMagicList(TEST_FAMILY_ID, 1);

    expect(deleteOne).toHaveBeenCalledWith('families/1/magic-lists/1');
  });

  test('addItemToMagicList posts to items endpoint', async () => {
    (post as jest.Mock).mockImplementation((_path: string, _body: any, mapper: (data: any) => any) =>
      Promise.resolve(mapper(rawMagicList))
    );

    const input = { title: 'Nouvelle tâche' };
    await addItemToMagicList(TEST_FAMILY_ID, 1, input);

    expect(post).toHaveBeenCalledWith('families/1/magic-lists/1/items', input, expect.any(Function));
  });

  test('updateItemInMagicList puts to correct item endpoint', async () => {
    (put as jest.Mock).mockImplementation((_path: string, _body: any, mapper: (data: any) => any) =>
      Promise.resolve(mapper(rawMagicList))
    );

    await updateItemInMagicList(TEST_FAMILY_ID, 1, 10, { status: 'DONE' });

    expect(put).toHaveBeenCalledWith('families/1/magic-lists/1/items/10', { status: 'DONE' }, expect.any(Function));
  });

  test('deleteItemFromMagicList deletes correct item', async () => {
    (deleteOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) =>
      Promise.resolve(mapper(rawMagicList))
    );

    await deleteItemFromMagicList(TEST_FAMILY_ID, 1, 10);

    expect(deleteOne).toHaveBeenCalledWith('families/1/magic-lists/1/items/10', expect.any(Function));
  });

  test('clearCompletedMagicListItems deletes completed items endpoint', async () => {
    (deleteOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) =>
      Promise.resolve(mapper(rawMagicList))
    );

    await clearCompletedMagicListItems(TEST_FAMILY_ID, 1);

    expect(deleteOne).toHaveBeenCalledWith('families/1/magic-lists/1/items/completed', expect.any(Function));
  });

  test('responseToMagicList handles missing fields gracefully', async () => {
    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) =>
      Promise.resolve(mapper([{}]))
    );

    const result = await getAllMagicLists(TEST_FAMILY_ID);

    expect(result[0].id).toBe(0);
    expect(result[0].name).toBe('');
    expect(result[0].items).toEqual([]);
  });
});
