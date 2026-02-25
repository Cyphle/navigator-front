import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PlannedMenuList, CreatePlannedMenuListInput, UpdatePlannedMenuListInput } from './planned-menus.types';
import * as plannedMenusService from '../../services/planned-menus.service';

const QUERY_KEY = 'planned-menus';

export const useFetchAllPlannedMenuLists = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: plannedMenusService.getAllPlannedMenuLists,
  });
};

export const useFetchPlannedMenuListById = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => plannedMenusService.getPlannedMenuListById(id),
    enabled: id > 0,
  });
};

export const useCreatePlannedMenuList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePlannedMenuListInput) => plannedMenusService.createPlannedMenuList(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdatePlannedMenuList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdatePlannedMenuListInput }) =>
      plannedMenusService.updatePlannedMenuList(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, data.id] });
    },
  });
};

export const useDeletePlannedMenuList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => plannedMenusService.deletePlannedMenuList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useAddRecipeToPlannedMenuList = () => {
  const queryClient = useQueryClient();

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
    }) => plannedMenusService.addRecipeToPlannedMenuList(listId, recipeId, recipeName, assignedDays),
    onSuccess: (data) => {
      // Update the specific list query with the returned data
      queryClient.setQueryData([QUERY_KEY, data.id], data);
      // Invalidate the all lists query to update counts
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};

export const useRemoveRecipeFromPlannedMenuList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, recipeId }: { listId: number; recipeId: number }) =>
      plannedMenusService.removeRecipeFromPlannedMenuList(listId, recipeId),
    onSuccess: (data) => {
      // Update the specific list query with the returned data
      queryClient.setQueryData([QUERY_KEY, data.id], data);
      // Invalidate the all lists query to update counts
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};
