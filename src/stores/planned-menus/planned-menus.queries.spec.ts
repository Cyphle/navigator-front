import { waitFor } from '@testing-library/react';
import { renderQueryHook } from '../../../test-utils/render';
import { aPlannedMenuList } from '../../../test-utils/factories';
import * as plannedMenusService from '../../services/planned-menus.service';
import {
  useFetchAllPlannedMenuLists,
  useFetchPlannedMenuListById,
  useCreatePlannedMenuList,
  useUpdatePlannedMenuList,
  useDeletePlannedMenuList,
  useAddRecipeToPlannedMenuList,
  useRemoveRecipeFromPlannedMenuList,
} from './planned-menus.queries';

jest.mock('../../services/planned-menus.service', () => ({
  getAllPlannedMenuLists: jest.fn(),
  getPlannedMenuListById: jest.fn(),
  createPlannedMenuList: jest.fn(),
  updatePlannedMenuList: jest.fn(),
  deletePlannedMenuList: jest.fn(),
  addRecipeToPlannedMenuList: jest.fn(),
  removeRecipeFromPlannedMenuList: jest.fn(),
}));

describe('planned-menus queries', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch all planned menu lists', async () => {
    const mockLists = [aPlannedMenuList({ id: 1 }), aPlannedMenuList({ id: 2 })];
    jest.mocked(plannedMenusService.getAllPlannedMenuLists).mockResolvedValue(mockLists);

    const { result } = renderQueryHook(() => useFetchAllPlannedMenuLists());

    expect(plannedMenusService.getAllPlannedMenuLists).toHaveBeenCalled();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockLists);
  });

  test('should fetch planned menu list by id', async () => {
    const mockList = aPlannedMenuList({ id: 1 });
    jest.mocked(plannedMenusService.getPlannedMenuListById).mockResolvedValue(mockList);

    const { result } = renderQueryHook(() => useFetchPlannedMenuListById(1));

    expect(plannedMenusService.getPlannedMenuListById).toHaveBeenCalledWith(1);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockList);
  });

  test('should not fetch when id is 0', async () => {
    jest.mocked(plannedMenusService.getPlannedMenuListById).mockResolvedValue(aPlannedMenuList());

    const { result } = renderQueryHook(() => useFetchPlannedMenuListById(0));

    expect(plannedMenusService.getPlannedMenuListById).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);
  });

  test('should create planned menu list', async () => {
    const input = { name: 'Nouveau menu', startDate: '2026-03-01', endDate: '2026-03-07' };
    const mockCreated = aPlannedMenuList({ id: 3, ...input });
    jest.mocked(plannedMenusService.createPlannedMenuList).mockResolvedValue(mockCreated);

    const { result } = renderQueryHook(() => useCreatePlannedMenuList());

    result.current.mutate(input);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(plannedMenusService.createPlannedMenuList).toHaveBeenCalledWith(input);
    expect(result.current.data).toEqual(mockCreated);
  });

  test('should update planned menu list', async () => {
    const input = { isActiveShoppingList: true };
    const mockUpdated = aPlannedMenuList({ id: 1, isActiveShoppingList: true });
    jest.mocked(plannedMenusService.updatePlannedMenuList).mockResolvedValue(mockUpdated);

    const { result } = renderQueryHook(() => useUpdatePlannedMenuList());

    result.current.mutate({ id: 1, input });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(plannedMenusService.updatePlannedMenuList).toHaveBeenCalledWith(1, input);
    expect(result.current.data).toEqual(mockUpdated);
  });

  test('should delete planned menu list', async () => {
    jest.mocked(plannedMenusService.deletePlannedMenuList).mockResolvedValue(undefined);

    const { result } = renderQueryHook(() => useDeletePlannedMenuList());

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(plannedMenusService.deletePlannedMenuList).toHaveBeenCalledWith(1);
  });

  test('should add recipe to planned menu list', async () => {
    const mockUpdated = aPlannedMenuList({
      id: 1,
      recipes: [{ recipeId: 5, recipeName: 'Tarte', assignedDays: ['2026-03-02'] }],
    });
    jest.mocked(plannedMenusService.addRecipeToPlannedMenuList).mockResolvedValue(mockUpdated);

    const { result } = renderQueryHook(() => useAddRecipeToPlannedMenuList());

    result.current.mutate({ listId: 1, recipeId: 5, recipeName: 'Tarte', assignedDays: ['2026-03-02'] });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(plannedMenusService.addRecipeToPlannedMenuList).toHaveBeenCalledWith(
      1,
      5,
      'Tarte',
      ['2026-03-02']
    );
    expect(result.current.data?.recipes).toHaveLength(1);
  });

  test('should remove recipe from planned menu list', async () => {
    const mockUpdated = aPlannedMenuList({ id: 1, recipes: [] });
    jest.mocked(plannedMenusService.removeRecipeFromPlannedMenuList).mockResolvedValue(mockUpdated);

    const { result } = renderQueryHook(() => useRemoveRecipeFromPlannedMenuList());

    result.current.mutate({ listId: 1, recipeId: 5 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(plannedMenusService.removeRecipeFromPlannedMenuList).toHaveBeenCalledWith(1, 5);
    expect(result.current.data?.recipes).toHaveLength(0);
  });
});
