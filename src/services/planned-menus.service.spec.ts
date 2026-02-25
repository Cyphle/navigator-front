import { getOne, post, put, deleteOne } from '../helpers/http';
import {
  getAllPlannedMenuLists,
  getPlannedMenuListById,
  createPlannedMenuList,
  updatePlannedMenuList,
  deletePlannedMenuList,
  addRecipeToPlannedMenuList,
  removeRecipeFromPlannedMenuList,
} from './planned-menus.service';

jest.mock('../helpers/http', () => ({
  getOne: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  deleteOne: jest.fn(),
}));

describe('Planned menus service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get all planned menu lists', async () => {
    const apiResponse = [
      {
        id: 1,
        name: 'Menu semaine 1',
        startDate: '2026-03-01',
        endDate: '2026-03-07',
        recipes: [],
        isActiveShoppingList: false,
        createdAt: '2026-02-25T10:00:00Z',
        updatedAt: '2026-02-25T10:00:00Z',
      },
    ];

    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await getAllPlannedMenuLists();

    expect(getOne).toHaveBeenCalledWith('planned-menus', expect.any(Function));
    expect(response).toHaveLength(1);
    expect(response[0].name).toBe('Menu semaine 1');
  });

  test('should get planned menu list by id', async () => {
    const apiResponse = {
      id: 1,
      name: 'Menu semaine 1',
      startDate: '2026-03-01',
      endDate: '2026-03-07',
      recipes: [{ recipeId: 2, recipeName: 'Salade', assignedDays: ['2026-03-01'] }],
      isActiveShoppingList: true,
      createdAt: '2026-02-25T10:00:00Z',
      updatedAt: '2026-02-25T10:00:00Z',
    };

    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await getPlannedMenuListById(1);

    expect(getOne).toHaveBeenCalledWith('planned-menus/1', expect.any(Function));
    expect(response.id).toBe(1);
    expect(response.recipes).toHaveLength(1);
    expect(response.recipes[0].recipeName).toBe('Salade');
  });

  test('should create planned menu list', async () => {
    const input = {
      name: 'Nouveau menu',
      startDate: '2026-03-01',
      endDate: '2026-03-07',
    };

    const apiResponse = {
      id: 2,
      ...input,
      recipes: [],
      isActiveShoppingList: false,
      createdAt: '2026-02-25T10:00:00Z',
      updatedAt: '2026-02-25T10:00:00Z',
    };

    (post as jest.Mock).mockImplementation((_path: string, _body: any, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await createPlannedMenuList(input);

    expect(post).toHaveBeenCalledWith('planned-menus', input, expect.any(Function));
    expect(response.id).toBe(2);
    expect(response.name).toBe('Nouveau menu');
  });

  test('should update planned menu list', async () => {
    const input = {
      isActiveShoppingList: true,
    };

    const apiResponse = {
      id: 1,
      name: 'Menu semaine 1',
      startDate: '2026-03-01',
      endDate: '2026-03-07',
      recipes: [],
      isActiveShoppingList: true,
      createdAt: '2026-02-25T10:00:00Z',
      updatedAt: '2026-02-25T11:00:00Z',
    };

    (put as jest.Mock).mockImplementation((_path: string, _body: any, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await updatePlannedMenuList(1, input);

    expect(put).toHaveBeenCalledWith('planned-menus/1', input, expect.any(Function));
    expect(response.isActiveShoppingList).toBe(true);
  });

  test('should delete planned menu list', async () => {
    (deleteOne as jest.Mock).mockResolvedValue(undefined);

    await deletePlannedMenuList(1);

    expect(deleteOne).toHaveBeenCalledWith('planned-menus/1');
  });

  test('should add recipe to planned menu list', async () => {
    const apiResponse = {
      id: 1,
      name: 'Menu semaine 1',
      startDate: '2026-03-01',
      endDate: '2026-03-07',
      recipes: [{ recipeId: 5, recipeName: 'Tarte', assignedDays: ['2026-03-02'] }],
      isActiveShoppingList: false,
      createdAt: '2026-02-25T10:00:00Z',
      updatedAt: '2026-02-25T11:00:00Z',
    };

    (post as jest.Mock).mockImplementation((_path: string, _body: any, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await addRecipeToPlannedMenuList(1, 5, 'Tarte', ['2026-03-02']);

    expect(post).toHaveBeenCalledWith(
      'planned-menus/1/recipes',
      { recipeId: 5, recipeName: 'Tarte', assignedDays: ['2026-03-02'] },
      expect.any(Function)
    );
    expect(response.recipes).toHaveLength(1);
    expect(response.recipes[0].recipeName).toBe('Tarte');
  });

  test('should remove recipe from planned menu list', async () => {
    const apiResponse = {
      id: 1,
      name: 'Menu semaine 1',
      startDate: '2026-03-01',
      endDate: '2026-03-07',
      recipes: [],
      isActiveShoppingList: false,
      createdAt: '2026-02-25T10:00:00Z',
      updatedAt: '2026-02-25T11:00:00Z',
    };

    (deleteOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await removeRecipeFromPlannedMenuList(1, 5);

    expect(deleteOne).toHaveBeenCalledWith('planned-menus/1/recipes/5', expect.any(Function));
    expect(response.recipes).toHaveLength(0);
  });

  test('should handle empty response for get all', async () => {
    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(null));
    });

    const response = await getAllPlannedMenuLists();

    expect(response).toEqual([]);
  });

  test('should handle missing optional fields', async () => {
    const apiResponse = {
      id: 1,
      name: 'Menu incomplet',
      startDate: '2026-03-01',
      endDate: '2026-03-07',
    };

    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await getPlannedMenuListById(1);

    expect(response.recipes).toEqual([]);
    expect(response.isActiveShoppingList).toBe(false);
  });
});
