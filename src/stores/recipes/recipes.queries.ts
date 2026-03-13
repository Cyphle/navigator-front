import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getRecipesPage } from '../../services/recipes.service';
import type { RecipesPage } from './recipes.types';
import { useFamily } from '../../contexts/family/family.context.tsx';

export const useFetchRecipesPage = (
  page: number,
  pageSize: number,
  category?: string,
  search?: string,
  minRating?: number,
  sort?: string
): UseQueryResult<RecipesPage, Error> => {
  const { currentFamily } = useFamily();
  return useQuery({
    queryKey: ['recipes', currentFamily?.id, page, pageSize, category, search, minRating, sort],
    queryFn: () => getRecipesPage(currentFamily?.id ?? '', page, pageSize, category, search, minRating, sort),
    enabled: Boolean(currentFamily?.id),
  });
};
