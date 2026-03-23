import { getOne, post, put, deleteOne } from '../helpers/http';
import {
  getAllTodoLists,
  getTodoListById,
  createTodoList,
  updateTodoList,
  deleteTodoList,
  addItemToTodoList,
  updateItemInTodoList,
  deleteItemFromTodoList,
  clearCompletedTodos,
} from './family-todos.service';

jest.mock('../helpers/http', () => ({
  getOne: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  deleteOne: jest.fn(),
}));

const TEST_FAMILY_ID = '1';

const rawTodoList = {
  id: 1,
  name: 'Tâches du foyer',
  type: 'PERSONAL',
  items: [
    { id: 10, title: 'Faire la vaisselle', status: 'TODO', createdAt: '2026-03-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z' },
  ],
  createdAt: '2026-03-01T10:00:00Z',
  updatedAt: '2026-03-01T10:00:00Z',
};

describe('family-todos service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAllTodoLists calls correct endpoint and maps response', async () => {
    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) =>
      Promise.resolve(mapper([rawTodoList]))
    );

    const result = await getAllTodoLists(TEST_FAMILY_ID);

    expect(getOne).toHaveBeenCalledWith('families/1/todos', expect.any(Function));
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Tâches du foyer');
    expect(result[0].items[0].title).toBe('Faire la vaisselle');
  });

  test('getTodoListById calls correct endpoint', async () => {
    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) =>
      Promise.resolve(mapper(rawTodoList))
    );

    const result = await getTodoListById(TEST_FAMILY_ID, 1);

    expect(getOne).toHaveBeenCalledWith('families/1/todos/1', expect.any(Function));
    expect(result.id).toBe(1);
  });

  test('createTodoList posts to correct endpoint', async () => {
    (post as jest.Mock).mockImplementation((_path: string, _body: any, mapper: (data: any) => any) =>
      Promise.resolve(mapper(rawTodoList))
    );

    const input = { name: 'Nouvelle liste', type: 'PERSONAL' as const };
    await createTodoList(TEST_FAMILY_ID, input);

    expect(post).toHaveBeenCalledWith('families/1/todos', input, expect.any(Function));
  });

  test('updateTodoList puts to correct endpoint', async () => {
    (put as jest.Mock).mockImplementation((_path: string, _body: any, mapper: (data: any) => any) =>
      Promise.resolve(mapper(rawTodoList))
    );

    await updateTodoList(TEST_FAMILY_ID, 1, { name: 'Nouveau nom' });

    expect(put).toHaveBeenCalledWith('families/1/todos/1', { name: 'Nouveau nom' }, expect.any(Function));
  });

  test('deleteTodoList deletes correct endpoint', async () => {
    (deleteOne as jest.Mock).mockResolvedValue(undefined);

    await deleteTodoList(TEST_FAMILY_ID, 1);

    expect(deleteOne).toHaveBeenCalledWith('families/1/todos/1');
  });

  test('addItemToTodoList posts to items endpoint', async () => {
    (post as jest.Mock).mockImplementation((_path: string, _body: any, mapper: (data: any) => any) =>
      Promise.resolve(mapper(rawTodoList))
    );

    const input = { title: 'Nouvelle tâche' };
    await addItemToTodoList(TEST_FAMILY_ID, 1, input);

    expect(post).toHaveBeenCalledWith('families/1/todos/1/items', input, expect.any(Function));
  });

  test('updateItemInTodoList puts to correct item endpoint', async () => {
    (put as jest.Mock).mockImplementation((_path: string, _body: any, mapper: (data: any) => any) =>
      Promise.resolve(mapper(rawTodoList))
    );

    await updateItemInTodoList(TEST_FAMILY_ID, 1, 10, { status: 'DONE' });

    expect(put).toHaveBeenCalledWith('families/1/todos/1/items/10', { status: 'DONE' }, expect.any(Function));
  });

  test('deleteItemFromTodoList deletes correct item', async () => {
    (deleteOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) =>
      Promise.resolve(mapper(rawTodoList))
    );

    await deleteItemFromTodoList(TEST_FAMILY_ID, 1, 10);

    expect(deleteOne).toHaveBeenCalledWith('families/1/todos/1/items/10', expect.any(Function));
  });

  test('clearCompletedTodos deletes completed items endpoint', async () => {
    (deleteOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) =>
      Promise.resolve(mapper(rawTodoList))
    );

    await clearCompletedTodos(TEST_FAMILY_ID, 1);

    expect(deleteOne).toHaveBeenCalledWith('families/1/todos/1/items/completed', expect.any(Function));
  });

  test('responseToTodoList handles missing fields gracefully', async () => {
    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) =>
      Promise.resolve(mapper([{}]))
    );

    const result = await getAllTodoLists(TEST_FAMILY_ID);

    expect(result[0].id).toBe(0);
    expect(result[0].name).toBe('');
    expect(result[0].items).toEqual([]);
  });
});
