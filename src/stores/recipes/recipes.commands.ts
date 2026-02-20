import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRecipe, updateRecipeRating } from '../../services/recipes.service';

export const useDeleteRecipe = (onError: (error?: any) => void, onSuccess: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteRecipe(id),
    onError: (error: any) => onError(error),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['recipes'] });
      onSuccess();
    },
  });
};

export const useUpdateRecipeRating = (onError: (error?: any) => void, onSuccess: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rating }: { id: number; rating: number }) => updateRecipeRating(id, rating),
    onError: (error: any) => onError(error),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['recipes'] });
      onSuccess();
    },
  });
};
