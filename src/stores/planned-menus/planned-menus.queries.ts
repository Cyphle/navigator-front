import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreatePlannedMenuListInput, UpdatePlannedMenuListInput } from './planned-menus.types';
import * as plannedMenusService from '../../services/planned-menus.service';
import { useFamily } from '../../contexts/family/family.context.tsx';

const QUERY_KEY = 'planned-menus';

export const useFetchAllPlannedMenuLists = () => {
  const { currentFamily } = useFamily();
  return useQuery({
    queryKey: [QUERY_KEY, currentFamily?.id],
    queryFn: () => plannedMenusService.getAllPlannedMenuLists(currentFamily?.id ?? ''),
    enabled: Boolean(currentFamily?.id),
  });
};

export const useFetchPlannedMenuListById = (id: number) => {
  const { currentFamily } = useFamily();
  return useQuery({
    queryKey: [QUERY_KEY, currentFamily?.id, id],
    queryFn: () => plannedMenusService.getPlannedMenuListById(currentFamily?.id ?? '', id),
    enabled: id > 0 && Boolean(currentFamily?.id),
  });
};

export const useCreatePlannedMenuList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: (input: CreatePlannedMenuListInput) => plannedMenusService.createPlannedMenuList(currentFamily?.id ?? '', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdatePlannedMenuList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdatePlannedMenuListInput }) =>
      plannedMenusService.updatePlannedMenuList(currentFamily?.id ?? '', id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, currentFamily?.id, data.id] });
    },
  });
};

export const useDeletePlannedMenuList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: (id: number) => plannedMenusService.deletePlannedMenuList(currentFamily?.id ?? '', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useAddRecipeToPlannedMenuList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({
      listId,
      recipeId,
      recipeName,
      assignedDays,
    }: {
      listId: number;
      recipeId: number;
      recipeName: string;
      assignedDays?: string[];
    }) => plannedMenusService.addRecipeToPlannedMenuList(currentFamily?.id ?? '', listId, recipeId, recipeName, assignedDays),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, currentFamily?.id, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};

export const useRemoveRecipeFromPlannedMenuList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ listId, recipeId }: { listId: number; recipeId: number }) =>
      plannedMenusService.removeRecipeFromPlannedMenuList(currentFamily?.id ?? '', listId, recipeId),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, currentFamily?.id, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};
