import { getOne, post, put, deleteOne } from '../helpers/http';
import {
  getAllShoppingLists,
  getShoppingListById,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
  addItemToShoppingList,
  updateItemInShoppingList,
  deleteItemFromShoppingList,
} from './shopping-lists.service';

jest.mock('../helpers/http', () => ({
  getOne: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  deleteOne: jest.fn(),
}));

describe('Shopping lists service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get all shopping lists', async () => {
    const apiResponse = [
      {
        id: 1,
        name: 'Courses de la semaine',
        type: 'PERSONAL',
        items: [],
        createdAt: '2026-02-25T10:00:00Z',
        updatedAt: '2026-02-25T10:00:00Z',
      },
    ];

    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await getAllShoppingLists();

    expect(getOne).toHaveBeenCalledWith('shopping-lists', expect.any(Function));
    expect(response).toHaveLength(1);
    expect(response[0].name).toBe('Courses de la semaine');
  });

  test('should get shopping list by id', async () => {
    const apiResponse = {
      id: 1,
      name: 'Courses',
      type: 'SHARED',
      familyId: 5,
      items: [{ id: 1, title: 'Pain', completed: false, createdAt: '2026-02-25T10:00:00Z' }],
      createdAt: '2026-02-25T10:00:00Z',
      updatedAt: '2026-02-25T10:00:00Z',
    };

    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await getShoppingListById(1);

    expect(getOne).toHaveBeenCalledWith('shopping-lists/1', expect.any(Function));
    expect(response.id).toBe(1);
    expect(response.items).toHaveLength(1);
  });

  test('should create shopping list', async () => {
    const input = {
      name: 'Nouvelle liste',
      type: 'PERSONAL' as const,
    };

    const apiResponse = {
      id: 2,
      ...input,
      items: [],
      createdAt: '2026-02-25T10:00:00Z',
      updatedAt: '2026-02-25T10:00:00Z',
    };

    (post as jest.Mock).mockImplementation((_path: string, _body: any, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await createShoppingList(input);

    expect(post).toHaveBeenCalledWith('shopping-lists', input, expect.any(Function));
    expect(response.id).toBe(2);
    expect(response.name).toBe('Nouvelle liste');
  });

  test('should add item to shopping list', async () => {
    const input = {
      title: 'Lait',
      shop: 'Intermarché',
      desireLevel: 'REALLY_WANT' as const,
    };

    const apiResponse = {
      id: 1,
      name: 'Courses',
      type: 'PERSONAL',
      items: [
        {
          id: 1,
          title: 'Lait',
          shop: 'Intermarché',
          desireLevel: 'REALLY_WANT',
          completed: false,
          createdAt: '2026-02-25T10:00:00Z',
        },
      ],
      createdAt: '2026-02-25T10:00:00Z',
      updatedAt: '2026-02-25T11:00:00Z',
    };

    (post as jest.Mock).mockImplementation((_path: string, _body: any, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await addItemToShoppingList(1, input);

    expect(post).toHaveBeenCalledWith('shopping-lists/1/items', input, expect.any(Function));
    expect(response.items).toHaveLength(1);
    expect(response.items[0].title).toBe('Lait');
  });

  test('should update item in shopping list', async () => {
    const input = {
      completed: true,
    };

    const apiResponse = {
      id: 1,
      name: 'Courses',
      type: 'PERSONAL',
      items: [{ id: 1, title: 'Pain', completed: true, createdAt: '2026-02-25T10:00:00Z' }],
      createdAt: '2026-02-25T10:00:00Z',
      updatedAt: '2026-02-25T11:00:00Z',
    };

    (put as jest.Mock).mockImplementation((_path: string, _body: any, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await updateItemInShoppingList(1, 1, input);

    expect(put).toHaveBeenCalledWith('shopping-lists/1/items/1', input, expect.any(Function));
    expect(response.items[0].completed).toBe(true);
  });

  test('should delete item from shopping list', async () => {
    const apiResponse = {
      id: 1,
      name: 'Courses',
      type: 'PERSONAL',
      items: [],
      createdAt: '2026-02-25T10:00:00Z',
      updatedAt: '2026-02-25T11:00:00Z',
    };

    (deleteOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await deleteItemFromShoppingList(1, 1);

    expect(deleteOne).toHaveBeenCalledWith('shopping-lists/1/items/1', expect.any(Function));
    expect(response.items).toHaveLength(0);
  });

  test('should handle empty response for get all', async () => {
    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(null));
    });

    const response = await getAllShoppingLists();

    expect(response).toEqual([]);
  });
});
