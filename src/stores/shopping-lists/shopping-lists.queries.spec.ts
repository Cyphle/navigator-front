import { waitFor } from '@testing-library/react';
import { renderQueryHook } from '../../../test-utils/render';
import { aShoppingList, aShoppingListItem } from '../../../test-utils/factories';
import * as shoppingListsService from '../../services/shopping-lists.service';
import {
  useFetchAllShoppingLists,
  useFetchShoppingListById,
  useCreateShoppingList,
  useDeleteShoppingList,
  useAddItemToShoppingList,
  useUpdateItemInShoppingList,
  useDeleteItemFromShoppingList,
} from './shopping-lists.queries';

jest.mock('../../services/shopping-lists.service', () => ({
  getAllShoppingLists: jest.fn(),
  getShoppingListById: jest.fn(),
  createShoppingList: jest.fn(),
  updateShoppingList: jest.fn(),
  deleteShoppingList: jest.fn(),
  addItemToShoppingList: jest.fn(),
  updateItemInShoppingList: jest.fn(),
  deleteItemFromShoppingList: jest.fn(),
}));

describe('shopping-lists queries', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch all shopping lists', async () => {
    const mockLists = [aShoppingList({ id: 1 }), aShoppingList({ id: 2 })];
    jest.mocked(shoppingListsService.getAllShoppingLists).mockResolvedValue(mockLists);

    const { result } = renderQueryHook(() => useFetchAllShoppingLists());

    expect(shoppingListsService.getAllShoppingLists).toHaveBeenCalled();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockLists);
  });

  test('should fetch shopping list by id', async () => {
    const mockList = aShoppingList({ id: 1 });
    jest.mocked(shoppingListsService.getShoppingListById).mockResolvedValue(mockList);

    const { result } = renderQueryHook(() => useFetchShoppingListById(1));

    expect(shoppingListsService.getShoppingListById).toHaveBeenCalledWith(1);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockList);
  });

  test('should create shopping list', async () => {
    const input = { name: 'Nouvelle liste', type: 'PERSONAL' as const };
    const mockCreated = aShoppingList({ id: 3, ...input });
    jest.mocked(shoppingListsService.createShoppingList).mockResolvedValue(mockCreated);

    const { result } = renderQueryHook(() => useCreateShoppingList());

    result.current.mutate(input);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(shoppingListsService.createShoppingList).toHaveBeenCalledWith(input);
  });

  test('should delete shopping list', async () => {
    jest.mocked(shoppingListsService.deleteShoppingList).mockResolvedValue(undefined);

    const { result } = renderQueryHook(() => useDeleteShoppingList());

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(shoppingListsService.deleteShoppingList).toHaveBeenCalledWith(1);
  });

  test('should add item to shopping list', async () => {
    const input = { title: 'Pain', shop: 'Intermarché' };
    const mockUpdated = aShoppingList({
      id: 1,
      items: [aShoppingListItem({ title: 'Pain', shop: 'Intermarché' })],
    });
    jest.mocked(shoppingListsService.addItemToShoppingList).mockResolvedValue(mockUpdated);

    const { result } = renderQueryHook(() => useAddItemToShoppingList());

    result.current.mutate({ listId: 1, input });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(shoppingListsService.addItemToShoppingList).toHaveBeenCalledWith(1, input);
  });

  test('should update item in shopping list', async () => {
    const input = { completed: true };
    const mockUpdated = aShoppingList({
      id: 1,
      items: [aShoppingListItem({ id: 1, completed: true })],
    });
    jest.mocked(shoppingListsService.updateItemInShoppingList).mockResolvedValue(mockUpdated);

    const { result } = renderQueryHook(() => useUpdateItemInShoppingList());

    result.current.mutate({ listId: 1, itemId: 1, input });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(shoppingListsService.updateItemInShoppingList).toHaveBeenCalledWith(1, 1, input);
  });

  test('should delete item from shopping list', async () => {
    const mockUpdated = aShoppingList({ id: 1, items: [] });
    jest.mocked(shoppingListsService.deleteItemFromShoppingList).mockResolvedValue(mockUpdated);

    const { result } = renderQueryHook(() => useDeleteItemFromShoppingList());

    result.current.mutate({ listId: 1, itemId: 1 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(shoppingListsService.deleteItemFromShoppingList).toHaveBeenCalledWith(1, 1);
  });
});
