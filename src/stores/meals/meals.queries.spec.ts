import { waitFor } from '@testing-library/react';
import { renderQueryHook, renderMutateHook, TEST_FAMILY_ID } from '../../../test-utils/render';
import { aMealsList } from '../../../test-utils/factories';
import * as mealsService from '../../services/meals.service';
import {
  useFetchAllMealsLists,
  useFetchMealsListById,
  useCreateMealsList,
  useUpdateMealsList,
  useDeleteMealsList,
  useAddRecipeToMealsList,
  useRemoveRecipeFromMealsList,
} from './meals.queries';

jest.mock('../../services/meals.service', () => ({
  getAllMealsLists: jest.fn(),
  getMealsListById: jest.fn(),
  createMealsList: jest.fn(),
  updateMealsList: jest.fn(),
  deleteMealsList: jest.fn(),
  addRecipeToMealsList: jest.fn(),
  removeRecipeFromMealsList: jest.fn(),
}));

describe('planned-menus queries', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch all planned menu lists', async () => {
    const mockLists = [aMealsList({ id: 1 }), aMealsList({ id: 2 })];
    jest.mocked(mealsService.getAllMealsLists).mockResolvedValue(mockLists);

    const { result } = renderQueryHook(() => useFetchAllMealsLists());

    expect(mealsService.getAllMealsLists).toHaveBeenCalledWith(TEST_FAMILY_ID);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockLists);
  });

  test('should fetch planned menu list by id', async () => {
    const mockList = aMealsList({ id: 1 });
    jest.mocked(mealsService.getMealsListById).mockResolvedValue(mockList);

    const { result } = renderQueryHook(() => useFetchMealsListById(1));

    expect(mealsService.getMealsListById).toHaveBeenCalledWith(TEST_FAMILY_ID, 1);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockList);
  });

  test('should not fetch when id is 0', async () => {
    jest.mocked(mealsService.getMealsListById).mockResolvedValue(aMealsList());

    const { result } = renderQueryHook(() => useFetchMealsListById(0));

    expect(mealsService.getMealsListById).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);
  });

  test('should create planned menu list', async () => {
    const input = { name: 'Nouveau menu', startDate: '2026-03-01', endDate: '2026-03-07' };
    const mockCreated = aMealsList({ id: 3, ...input });
    jest.mocked(mealsService.createMealsList).mockResolvedValue(mockCreated);

    const { result } = renderMutateHook(() => useCreateMealsList());

    result.current.mutate(input);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mealsService.createMealsList).toHaveBeenCalledWith(TEST_FAMILY_ID, input);
    expect(result.current.data).toEqual(mockCreated);
  });

  test('should update planned menu list', async () => {
    const input = { isActiveShoppingList: true };
    const mockUpdated = aMealsList({ id: 1, isActiveShoppingList: true });
    jest.mocked(mealsService.updateMealsList).mockResolvedValue(mockUpdated);

    const { result } = renderMutateHook(() => useUpdateMealsList());

    result.current.mutate({ id: 1, input });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mealsService.updateMealsList).toHaveBeenCalledWith(TEST_FAMILY_ID, 1, input);
    expect(result.current.data).toEqual(mockUpdated);
  });

  test('should delete planned menu list', async () => {
    jest.mocked(mealsService.deleteMealsList).mockResolvedValue(undefined);

    const { result } = renderMutateHook(() => useDeleteMealsList());

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mealsService.deleteMealsList).toHaveBeenCalledWith(TEST_FAMILY_ID, 1);
  });

  test('should add recipe to planned menu list', async () => {
    const mockUpdated = aMealsList({
      id: 1,
      recipes: [{ recipeId: 5, recipeName: 'Tarte', assignedDays: ['2026-03-02'] }],
    });
    jest.mocked(mealsService.addRecipeToMealsList).mockResolvedValue(mockUpdated);

    const { result } = renderMutateHook(() => useAddRecipeToMealsList());

    result.current.mutate({ listId: 1, recipeId: 5, recipeName: 'Tarte', assignedDays: ['2026-03-02'] });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mealsService.addRecipeToMealsList).toHaveBeenCalledWith(
      TEST_FAMILY_ID,
      1,
      5,
      'Tarte',
      ['2026-03-02']
    );
    expect(result.current.data?.recipes).toHaveLength(1);
  });

  test('should remove recipe from planned menu list', async () => {
    const mockUpdated = aMealsList({ id: 1, recipes: [] });
    jest.mocked(mealsService.removeRecipeFromMealsList).mockResolvedValue(mockUpdated);

    const { result } = renderMutateHook(() => useRemoveRecipeFromMealsList());

    result.current.mutate({ listId: 1, recipeId: 5 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mealsService.removeRecipeFromMealsList).toHaveBeenCalledWith(TEST_FAMILY_ID, 1, 5);
    expect(result.current.data?.recipes).toHaveLength(0);
  });
});
