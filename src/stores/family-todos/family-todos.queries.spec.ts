import { waitFor } from '@testing-library/react';
import { renderQueryHook, renderMutateHook, TEST_FAMILY_ID } from '../../../test-utils/render';
import { aTodoList, aTodoItem } from '../../../test-utils/factories';
import * as familyTodosService from '../../services/family-todos.service';
import {
  useFetchAllTodoLists,
  useFetchTodoListById,
  useCreateTodoList,
  useDeleteTodoList,
  useAddItemToTodoList,
  useUpdateItemInTodoList,
  useDeleteItemFromTodoList,
  useClearCompletedTodos,
} from './family-todos.queries';

jest.mock('../../services/family-todos.service', () => ({
  getAllTodoLists: jest.fn(),
  getTodoListById: jest.fn(),
  createTodoList: jest.fn(),
  updateTodoList: jest.fn(),
  deleteTodoList: jest.fn(),
  addItemToTodoList: jest.fn(),
  updateItemInTodoList: jest.fn(),
  deleteItemFromTodoList: jest.fn(),
  clearCompletedTodos: jest.fn(),
}));

describe('family-todos queries', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('useFetchAllTodoLists fetches lists for current family', async () => {
    const mockLists = [aTodoList({ id: 1 }), aTodoList({ id: 2 })];
    jest.mocked(familyTodosService.getAllTodoLists).mockResolvedValue(mockLists);

    const { result } = renderQueryHook(() => useFetchAllTodoLists());

    expect(familyTodosService.getAllTodoLists).toHaveBeenCalledWith(TEST_FAMILY_ID);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockLists);
  });

  test('useFetchTodoListById fetches a specific list', async () => {
    const mockList = aTodoList({ id: 1 });
    jest.mocked(familyTodosService.getTodoListById).mockResolvedValue(mockList);

    const { result } = renderQueryHook(() => useFetchTodoListById(1));

    expect(familyTodosService.getTodoListById).toHaveBeenCalledWith(TEST_FAMILY_ID, 1);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockList);
  });

  test('useFetchTodoListById is disabled when id is 0', () => {
    const { result } = renderQueryHook(() => useFetchTodoListById(0));

    expect(familyTodosService.getTodoListById).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe('idle');
  });

  test('useCreateTodoList calls service and invalidates queries', async () => {
    const mockList = aTodoList({ id: 3, name: 'Nouvelle liste' });
    jest.mocked(familyTodosService.createTodoList).mockResolvedValue(mockList);

    const { result } = renderMutateHook(() => useCreateTodoList());
    result.current.mutate({ name: 'Nouvelle liste', type: 'PERSONAL' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(familyTodosService.createTodoList).toHaveBeenCalledWith(
      TEST_FAMILY_ID,
      { name: 'Nouvelle liste', type: 'PERSONAL' }
    );
  });

  test('useDeleteTodoList calls service with list id', async () => {
    jest.mocked(familyTodosService.deleteTodoList).mockResolvedValue(undefined);

    const { result } = renderMutateHook(() => useDeleteTodoList());
    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(familyTodosService.deleteTodoList).toHaveBeenCalledWith(TEST_FAMILY_ID, 1);
  });

  test('useAddItemToTodoList calls service with list id and item input', async () => {
    const mockList = aTodoList({ id: 1, items: [aTodoItem()] });
    jest.mocked(familyTodosService.addItemToTodoList).mockResolvedValue(mockList);

    const { result } = renderMutateHook(() => useAddItemToTodoList());
    result.current.mutate({ listId: 1, input: { title: 'Nouvelle tâche' } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(familyTodosService.addItemToTodoList).toHaveBeenCalledWith(
      TEST_FAMILY_ID, 1, { title: 'Nouvelle tâche' }
    );
  });

  test('useUpdateItemInTodoList calls service with correct args', async () => {
    const mockList = aTodoList({ id: 1 });
    jest.mocked(familyTodosService.updateItemInTodoList).mockResolvedValue(mockList);

    const { result } = renderMutateHook(() => useUpdateItemInTodoList());
    result.current.mutate({ listId: 1, itemId: 10, input: { status: 'DONE' } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(familyTodosService.updateItemInTodoList).toHaveBeenCalledWith(
      TEST_FAMILY_ID, 1, 10, { status: 'DONE' }
    );
  });

  test('useDeleteItemFromTodoList calls service with list and item ids', async () => {
    const mockList = aTodoList({ id: 1 });
    jest.mocked(familyTodosService.deleteItemFromTodoList).mockResolvedValue(mockList);

    const { result } = renderMutateHook(() => useDeleteItemFromTodoList());
    result.current.mutate({ listId: 1, itemId: 10 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(familyTodosService.deleteItemFromTodoList).toHaveBeenCalledWith(TEST_FAMILY_ID, 1, 10);
  });

  test('useClearCompletedTodos calls service with list id', async () => {
    const mockList = aTodoList({ id: 1 });
    jest.mocked(familyTodosService.clearCompletedTodos).mockResolvedValue(mockList);

    const { result } = renderMutateHook(() => useClearCompletedTodos());
    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(familyTodosService.clearCompletedTodos).toHaveBeenCalledWith(TEST_FAMILY_ID, 1);
  });
});
