import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  TodoList,
  CreateTodoListInput,
  UpdateTodoListInput,
  CreateTodoItemInput,
  UpdateTodoItemInput,
} from './family-todos.types';
import * as familyTodosService from '../../services/family-todos.service';

const QUERY_KEY = 'family-todos';

export const useFetchAllTodoLists = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: familyTodosService.getAllTodoLists,
  });
};

export const useFetchTodoListById = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => familyTodosService.getTodoListById(id),
    enabled: id > 0,
  });
};

export const useCreateTodoList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTodoListInput) => familyTodosService.createTodoList(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateTodoList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateTodoListInput }) =>
      familyTodosService.updateTodoList(id, input),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};

export const useDeleteTodoList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => familyTodosService.deleteTodoList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useAddItemToTodoList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, input }: { listId: number; input: CreateTodoItemInput }) =>
      familyTodosService.addItemToTodoList(listId, input),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};

export const useUpdateItemInTodoList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, itemId, input }: { listId: number; itemId: number; input: UpdateTodoItemInput }) =>
      familyTodosService.updateItemInTodoList(listId, itemId, input),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, data.id], data);
    },
  });
};

export const useDeleteItemFromTodoList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, itemId }: { listId: number; itemId: number }) =>
      familyTodosService.deleteItemFromTodoList(listId, itemId),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};

export const useClearCompletedTodos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listId: number) => familyTodosService.clearCompletedTodos(listId),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};
