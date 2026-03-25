import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateMealsListInput, UpdateMealsListInput } from './meals.types';
import * as mealsService from '../../services/meals.service';
import { useFamily } from '../../contexts/family/family.context.tsx';

const QUERY_KEY = 'meals';

export const useFetchMealsSummary = () => {
  const { currentFamily } = useFamily();
  return useQuery({
    queryKey: [QUERY_KEY, 'summary', currentFamily?.id],
    queryFn: () => mealsService.getMealsSummary(currentFamily?.id ?? ''),
    enabled: Boolean(currentFamily?.id),
  });
};

export const useFetchAllMealsLists = () => {
  const { currentFamily } = useFamily();
  return useQuery({
    queryKey: [QUERY_KEY, currentFamily?.id],
    queryFn: () => mealsService.getAllMealsLists(currentFamily?.id ?? ''),
    enabled: Boolean(currentFamily?.id),
  });
};

export const useFetchMealsListById = (id: number) => {
  const { currentFamily } = useFamily();
  return useQuery({
    queryKey: [QUERY_KEY, currentFamily?.id, id],
    queryFn: () => mealsService.getMealsListById(currentFamily?.id ?? '', id),
    enabled: id > 0 && Boolean(currentFamily?.id),
  });
};

export const useCreateMealsList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: (input: CreateMealsListInput) => mealsService.createMealsList(currentFamily?.id ?? '', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateMealsList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateMealsListInput }) =>
      mealsService.updateMealsList(currentFamily?.id ?? '', id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, currentFamily?.id, data.id] });
    },
  });
};

export const useDeleteMealsList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: (id: number) => mealsService.deleteMealsList(currentFamily?.id ?? '', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useAddRecipeToMealsList = () => {
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
    }) => mealsService.addRecipeToMealsList(currentFamily?.id ?? '', listId, recipeId, recipeName, assignedDays),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, currentFamily?.id, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};

export const useRemoveRecipeFromMealsList = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ listId, recipeId }: { listId: number; recipeId: number }) =>
      mealsService.removeRecipeFromMealsList(currentFamily?.id ?? '', listId, recipeId),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, currentFamily?.id, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};
