import { waitFor } from '@testing-library/react';
import { renderQueryHook, renderMutateHook, TEST_FAMILY_ID } from '../../../test-utils/render';
import { aMagicList, aMagicItem } from '../../../test-utils/factories';
import * as magicListsService from '../../services/magic-lists.service';
import {
  useFetchAllMagicLists,
  useFetchMagicListById,
  useCreateMagicList,
  useDeleteMagicList,
  useAddItemToMagicList,
  useUpdateItemInMagicList,
  useDeleteItemFromMagicList,
  useClearCompletedMagicListItems,
} from './magic-lists.queries';

jest.mock('../../services/magic-lists.service', () => ({
  getAllMagicLists: jest.fn(),
  getMagicListById: jest.fn(),
  createMagicList: jest.fn(),
  updateMagicList: jest.fn(),
  deleteMagicList: jest.fn(),
  addItemToMagicList: jest.fn(),
  updateItemInMagicList: jest.fn(),
  deleteItemFromMagicList: jest.fn(),
  clearCompletedMagicListItems: jest.fn(),
}));

describe('magic-lists queries', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('useFetchAllMagicLists fetches lists for current family', async () => {
    const mockLists = [aMagicList({ id: 1 }), aMagicList({ id: 2 })];
    jest.mocked(magicListsService.getAllMagicLists).mockResolvedValue(mockLists);

    const { result } = renderQueryHook(() => useFetchAllMagicLists());

    expect(magicListsService.getAllMagicLists).toHaveBeenCalledWith(TEST_FAMILY_ID);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockLists);
  });

  test('useFetchMagicListById fetches a specific list', async () => {
    const mockList = aMagicList({ id: 1 });
    jest.mocked(magicListsService.getMagicListById).mockResolvedValue(mockList);

    const { result } = renderQueryHook(() => useFetchMagicListById(1));

    expect(magicListsService.getMagicListById).toHaveBeenCalledWith(TEST_FAMILY_ID, 1);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockList);
  });

  test('useFetchMagicListById is disabled when id is 0', () => {
    const { result } = renderQueryHook(() => useFetchMagicListById(0));

    expect(magicListsService.getMagicListById).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe('idle');
  });

  test('useCreateMagicList calls service and invalidates queries', async () => {
    const mockList = aMagicList({ id: 3, name: 'Nouvelle liste' });
    jest.mocked(magicListsService.createMagicList).mockResolvedValue(mockList);

    const { result } = renderMutateHook(() => useCreateMagicList());
    result.current.mutate({ name: 'Nouvelle liste', type: 'PERSONAL', kind: 'SIMPLE' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(magicListsService.createMagicList).toHaveBeenCalledWith(
      TEST_FAMILY_ID,
      { name: 'Nouvelle liste', type: 'PERSONAL', kind: 'SIMPLE' }
    );
  });

  test('useDeleteMagicList calls service with list id', async () => {
    jest.mocked(magicListsService.deleteMagicList).mockResolvedValue(undefined);

    const { result } = renderMutateHook(() => useDeleteMagicList());
    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(magicListsService.deleteMagicList).toHaveBeenCalledWith(TEST_FAMILY_ID, 1);
  });

  test('useAddItemToMagicList calls service with list id and item input', async () => {
    const mockList = aMagicList({ id: 1, items: [aMagicItem()] });
    jest.mocked(magicListsService.addItemToMagicList).mockResolvedValue(mockList);

    const { result } = renderMutateHook(() => useAddItemToMagicList());
    result.current.mutate({ listId: 1, input: { title: 'Nouvelle tâche' } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(magicListsService.addItemToMagicList).toHaveBeenCalledWith(
      TEST_FAMILY_ID, 1, { title: 'Nouvelle tâche' }
    );
  });

  test('useUpdateItemInMagicList calls service with correct args', async () => {
    const mockList = aMagicList({ id: 1 });
    jest.mocked(magicListsService.updateItemInMagicList).mockResolvedValue(mockList);

    const { result } = renderMutateHook(() => useUpdateItemInMagicList());
    result.current.mutate({ listId: 1, itemId: 10, input: { status: 'DONE' } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(magicListsService.updateItemInMagicList).toHaveBeenCalledWith(
      TEST_FAMILY_ID, 1, 10, { status: 'DONE' }
    );
  });

  test('useDeleteItemFromMagicList calls service with list and item ids', async () => {
    const mockList = aMagicList({ id: 1 });
    jest.mocked(magicListsService.deleteItemFromMagicList).mockResolvedValue(mockList);

    const { result } = renderMutateHook(() => useDeleteItemFromMagicList());
    result.current.mutate({ listId: 1, itemId: 10 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(magicListsService.deleteItemFromMagicList).toHaveBeenCalledWith(TEST_FAMILY_ID, 1, 10);
  });

  test('useClearCompletedMagicListItems calls service with list id', async () => {
    const mockList = aMagicList({ id: 1 });
    jest.mocked(magicListsService.clearCompletedMagicListItems).mockResolvedValue(mockList);

    const { result } = renderMutateHook(() => useClearCompletedMagicListItems());
    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(magicListsService.clearCompletedMagicListItems).toHaveBeenCalledWith(TEST_FAMILY_ID, 1);
  });
});
