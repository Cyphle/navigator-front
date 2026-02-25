import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  ShoppingList,
  CreateShoppingListInput,
  UpdateShoppingListInput,
  CreateShoppingListItemInput,
  UpdateShoppingListItemInput,
} from './shopping-lists.types';
import * as shoppingListsService from '../../services/shopping-lists.service';

const QUERY_KEY = 'shopping-lists';

export const useFetchAllShoppingLists = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: shoppingListsService.getAllShoppingLists,
  });
};

export const useFetchShoppingListById = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => shoppingListsService.getShoppingListById(id),
    enabled: id > 0,
  });
};

export const useCreateShoppingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateShoppingListInput) => shoppingListsService.createShoppingList(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateShoppingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateShoppingListInput }) =>
      shoppingListsService.updateShoppingList(id, input),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};

export const useDeleteShoppingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => shoppingListsService.deleteShoppingList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useAddItemToShoppingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, input }: { listId: number; input: CreateShoppingListItemInput }) =>
      shoppingListsService.addItemToShoppingList(listId, input),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};

export const useUpdateItemInShoppingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, itemId, input }: { listId: number; itemId: number; input: UpdateShoppingListItemInput }) =>
      shoppingListsService.updateItemInShoppingList(listId, itemId, input),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, data.id], data);
    },
  });
};

export const useDeleteItemFromShoppingList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, itemId }: { listId: number; itemId: number }) =>
      shoppingListsService.deleteItemFromShoppingList(listId, itemId),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};

export const useClearCompletedItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listId: number) => shoppingListsService.clearCompletedItems(listId),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};
