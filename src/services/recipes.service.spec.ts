import { getOne, post } from '../helpers/http.ts';
import { deleteRecipe, getRecipesPage, updateRecipeRating } from './recipes.service.ts';

jest.mock('../helpers/http.ts', () => ({
  getOne: jest.fn(),
  post: jest.fn(),
}));

describe('Recipes service', () => {
  test('should get recipes page data', async () => {
    const apiResponse = {
      items: [
        {
          id: 1,
          name: 'Salade de quinoa',
          category: 'ENTREE',
          ingredients: ['Quinoa'],
          steps: ['Cuire'],
        }
      ],
      page: 1,
      pageSize: 6,
      total: 1
    };

    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await getRecipesPage(1, 6);

    expect(getOne).toHaveBeenCalledWith('recipes?page=1&pageSize=6', expect.any(Function));
    expect(response.items).toHaveLength(1);
    expect(response.items[0].name).toBe('Salade de quinoa');
  });

  test('should map recipes parts', async () => {
    const apiResponse = {
      items: [
        {
          id: 2,
          name: 'Tarte aux pommes',
          category: 'DESSERT',
          parts: [
            { name: 'Pâte', ingredients: ['Farine'], steps: ['Mélanger'] }
          ]
        }
      ],
      page: 1,
      pageSize: 6,
      total: 1
    };

    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await getRecipesPage(1, 6);

    expect(response.items[0].parts?.[0].name).toBe('Pâte');
  });

  test('should map recipes when response is an array', async () => {
    const apiResponse = [
      {
        id: 3,
        name: 'Soupe de carottes',
        category: 'ENTREE',
        ingredients: ['Carottes'],
        steps: ['Mixer'],
      }
    ];

    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await getRecipesPage(1, 6);

    expect(response.items).toHaveLength(1);
    expect(response.items[0].name).toBe('Soupe de carottes');
    expect(response.total).toBe(1);
  });

  test('should pass category query param when provided', async () => {
    const apiResponse = {
      items: [],
      page: 1,
      pageSize: 10,
      total: 0
    };

    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    await getRecipesPage(1, 10, 'DESSERT');

    expect(getOne).toHaveBeenCalledWith('recipes?page=1&pageSize=10&category=DESSERT', expect.any(Function));
  });

  test('should pass search query param when provided', async () => {
    const apiResponse = {
      items: [],
      page: 1,
      pageSize: 10,
      total: 0
    };

    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    await getRecipesPage(1, 10, 'ENTREE', 'quinoa');

    expect(getOne).toHaveBeenCalledWith('recipes?page=1&pageSize=10&category=ENTREE&search=quinoa', expect.any(Function));
  });

  test('should pass rating and sort query params when provided', async () => {
    const apiResponse = {
      items: [],
      page: 1,
      pageSize: 10,
      total: 0
    };

    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    await getRecipesPage(1, 10, undefined, undefined, 4, 'RATING_DESC');

    expect(getOne).toHaveBeenCalledWith('recipes?page=1&pageSize=10&minRating=4&sort=RATING_DESC', expect.any(Function));
  });

  test('should delete a recipe', async () => {
    (post as jest.Mock).mockImplementation((_path: string, _body: unknown, mapper: (data: any) => any) => {
      return Promise.resolve(mapper({ success: true }));
    });

    const response = await deleteRecipe(2);

    expect(post).toHaveBeenCalledWith('recipes/2/delete', {}, expect.any(Function));
    expect(response).toBe(true);
  });

  test('should update recipe rating', async () => {
    (post as jest.Mock).mockImplementation((_path: string, _body: unknown, mapper: (data: any) => any) => {
      return Promise.resolve(mapper({ id: 1, name: 'Salade', category: 'ENTREE', rating: 5 }));
    });

    const response = await updateRecipeRating(1, 5);

    expect(post).toHaveBeenCalledWith('recipes/1/rating', { rating: 5 }, expect.any(Function));
    expect(response.rating).toBe(5);
  });
});
