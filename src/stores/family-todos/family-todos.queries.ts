import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateTodoListInput,
  UpdateTodoListInput,
  CreateTodoItemInput,
  UpdateTodoItemInput,
} from './family-todos.types';
import * as familyTodosService from '../../services/family-todos.service';
import { useFamily } from '../../contexts/family/family.context.tsx';

const QUERY_KEY = 'family-todos';

export const useFetchAllTodoLists = () => {
  const { currentFamily } = useFamily();
  return useQuery({
    queryKey: [QUERY_KEY, currentFamily?.id],
    queryFn: () => familyTodosService.getAllTodoLists(currentFamily?.id ?? ''),
    enabled: Boolean(currentFamily?.id),
  });
};

export const useFetchTodoListById = (id: number) => {
  const { currentFamily } = useFamily();
  return useQuery({
    queryKey: [QUERY_KEY, currentFamily?.id, id],
    queryFn: () => familyTodosService.getTodoListById(currentFamily?.id ?? '', id),
    enabled: id > 0 && Boolean(currentFamily?.id),
  });
};

export const useCreateTodoList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: (input: CreateTodoListInput) => familyTodosService.createTodoList(currentFamily?.id ?? '', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateTodoList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateTodoListInput }) =>
      familyTodosService.updateTodoList(currentFamily?.id ?? '', id, input),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, currentFamily?.id, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};

export const useDeleteTodoList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: (id: number) => familyTodosService.deleteTodoList(currentFamily?.id ?? '', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useAddItemToTodoList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ listId, input }: { listId: number; input: CreateTodoItemInput }) =>
      familyTodosService.addItemToTodoList(currentFamily?.id ?? '', listId, input),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, currentFamily?.id, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};

export const useUpdateItemInTodoList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ listId, itemId, input }: { listId: number; itemId: number; input: UpdateTodoItemInput }) =>
      familyTodosService.updateItemInTodoList(currentFamily?.id ?? '', listId, itemId, input),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, currentFamily?.id, data.id], data);
    },
  });
};

export const useDeleteItemFromTodoList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ listId, itemId }: { listId: number; itemId: number }) =>
      familyTodosService.deleteItemFromTodoList(currentFamily?.id ?? '', listId, itemId),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, currentFamily?.id, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};

export const useClearCompletedTodos = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: (listId: number) => familyTodosService.clearCompletedTodos(currentFamily?.id ?? '', listId),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, currentFamily?.id, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};
