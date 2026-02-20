import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getRecipesPage } from '../../services/recipes.service';
import type { RecipesPage } from './recipes.types';

export const useFetchRecipesPage = (
  page: number,
  pageSize: number,
  category?: string,
  search?: string
): UseQueryResult<RecipesPage, Error> => {
  return useQuery({
    queryKey: ['recipes', page, pageSize, category, search],
    queryFn: () => getRecipesPage(page, pageSize, category, search)
  });
};
