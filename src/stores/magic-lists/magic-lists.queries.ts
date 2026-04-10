import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateMagicListInput,
  UpdateMagicListInput,
  CreateMagicItemInput,
  UpdateMagicItemInput,
} from './magic-lists.types';
import * as magicListsService from '../../services/magic-lists.service';
import { useFamily } from '../../contexts/family/family.context.tsx';

const QUERY_KEY = 'magic-lists';

export const useFetchMagicListsSummary = () => {
  const { currentFamily } = useFamily();
  return useQuery({
    queryKey: [QUERY_KEY, 'summary', currentFamily?.id],
    queryFn: () => magicListsService.getMagicListsSummary(currentFamily?.id ?? ''),
    enabled: Boolean(currentFamily?.id),
  });
};

export const useFetchAllMagicLists = () => {
  const { currentFamily } = useFamily();
  return useQuery({
    queryKey: [QUERY_KEY, currentFamily?.id],
    queryFn: () => magicListsService.getAllMagicLists(currentFamily?.id ?? ''),
    enabled: Boolean(currentFamily?.id),
  });
};

export const useFetchMagicListById = (id: number) => {
  const { currentFamily } = useFamily();
  return useQuery({
    queryKey: [QUERY_KEY, currentFamily?.id, id],
    queryFn: () => magicListsService.getMagicListById(currentFamily?.id ?? '', id),
    enabled: id > 0 && Boolean(currentFamily?.id),
  });
};

export const useCreateMagicList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: (input: CreateMagicListInput) => magicListsService.createMagicList(currentFamily?.id ?? '', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateMagicList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateMagicListInput }) =>
      magicListsService.updateMagicList(currentFamily?.id ?? '', id, input),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, currentFamily?.id, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};

export const useDeleteMagicList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: (id: number) => magicListsService.deleteMagicList(currentFamily?.id ?? '', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useAddItemToMagicList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ listId, input }: { listId: number; input: CreateMagicItemInput }) =>
      magicListsService.addItemToMagicList(currentFamily?.id ?? '', listId, input),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, currentFamily?.id, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};

export const useUpdateItemInMagicList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ listId, itemId, input }: { listId: number; itemId: number; input: UpdateMagicItemInput }) =>
      magicListsService.updateItemInMagicList(currentFamily?.id ?? '', listId, itemId, input),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, currentFamily?.id, data.id], data);
    },
  });
};

export const useDeleteItemFromMagicList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ listId, itemId }: { listId: number; itemId: number }) =>
      magicListsService.deleteItemFromMagicList(currentFamily?.id ?? '', listId, itemId),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, currentFamily?.id, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};

export const useClearCompletedMagicListItems = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: (listId: number) => magicListsService.clearCompletedMagicListItems(currentFamily?.id ?? '', listId),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, currentFamily?.id, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};
