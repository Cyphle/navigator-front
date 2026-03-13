import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRecipe, updateRecipeRating } from '../../services/recipes.service';
import { useFamily } from '../../contexts/family/family.context.tsx';

export const useDeleteRecipe = (onError: (error?: any) => void, onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: (id: number) => deleteRecipe(currentFamily?.id ?? '', id),
    onError: (error: any) => onError(error),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['recipes'] });
      onSuccess();
    },
  });
};

export const useUpdateRecipeRating = (onError: (error?: any) => void, onSuccess: () => void) => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ id, rating }: { id: number; rating: number }) => updateRecipeRating(currentFamily?.id ?? '', id, rating),
    onError: (error: any) => onError(error),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['recipes'] });
      onSuccess();
    },
  });
};
