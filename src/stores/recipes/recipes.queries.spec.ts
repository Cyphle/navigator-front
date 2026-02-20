import { waitFor } from '@testing-library/react';
import { renderQueryHook } from '../../../test-utils/render';
import { getRecipesPage } from '../../services/recipes.service';
import { useFetchRecipesPage } from './recipes.queries';

jest.mock('../../services/recipes.service', () => ({
  getRecipesPage: jest.fn()
}));

describe('recipes queries', () => {
  test('should fetch recipes page', async () => {
    jest.mocked(getRecipesPage).mockResolvedValue({
      items: [],
      page: 1,
      pageSize: 6,
      total: 0
    });

    const { result } = renderQueryHook(() => useFetchRecipesPage(1, 6, 'DESSERT', 'tarte'));

    expect(getRecipesPage).toHaveBeenCalledWith(1, 6, 'DESSERT', 'tarte', undefined, undefined);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
