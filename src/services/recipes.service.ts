import type { Recipe, RecipeCategory, RecipesPage } from '../stores/recipes/recipes.types';
import type { DashboardRecipe } from '../stores/dashboard/dashboard.types.ts';
import { getOne, post } from '../helpers/http';

export const getRecipesPage = (
  familyId: string,
  page: number,
  pageSize: number,
  category?: RecipeCategory | string,
  search?: string,
  minRating?: number,
  sort?: string
): Promise<RecipesPage> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (category) {
    params.set('category', category);
  }

  if (search) {
    params.set('search', search);
  }

  if (minRating && minRating > 0) {
    params.set('minRating', minRating.toString());
  }

  if (sort) {
    params.set('sort', sort);
  }

  return getOne(`families/${encodeURIComponent(familyId)}/recipes?${params.toString()}`, responseToRecipesPage);
};

export const deleteRecipe = (familyId: string, id: number): Promise<boolean> => {
  return post(`families/${encodeURIComponent(familyId)}/recipes/${id}/delete`, {}, (data: any) => Boolean(data?.success));
};

export const updateRecipeRating = (familyId: string, id: number, rating: number): Promise<Recipe> => {
  return post(`families/${encodeURIComponent(familyId)}/recipes/${id}/rating`, { rating }, responseToRecipe);
};

export const getRecipesSummary = (familyId: string): Promise<DashboardRecipe[]> => {
  return getOne(`families/${encodeURIComponent(familyId)}/recipes/summary`, (data: any) => {
    if (!Array.isArray(data)) return [];
    return data.map((item: any): DashboardRecipe => ({
      id: item.id,
      name: item.name,
      favorite: item.favorite,
      selectedForWeek: item.selectedForWeek,
      visibility: item.visibility,
    }));
  });
};

const responseToRecipesPage = (data: any): RecipesPage => {
  if (Array.isArray(data)) {
    const items = data.map(responseToRecipe);
    return {
      items,
      page: 1,
      pageSize: items.length,
      total: items.length,
    };
  }

  const rawItems = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.recipes)
      ? data.recipes
      : [];
  const items = rawItems.map(responseToRecipe);

  return {
    items,
    page: Number.isFinite(data?.page) ? data.page : 1,
    pageSize: Number.isFinite(data?.pageSize) ? data.pageSize : items.length,
    total: Number.isFinite(data?.total) ? data.total : items.length,
  };
};

const responseToRecipe = (data: any): Recipe => ({
  id: data?.id ?? 0,
  name: data?.name ?? 'Recette',
  category: data?.category ?? 'PLAT',
  imageUrl: data?.imageUrl ?? undefined,
  rating: typeof data?.rating === 'number' ? data.rating : 0,
  ingredients: Array.isArray(data?.ingredients) ? data.ingredients : undefined,
  steps: Array.isArray(data?.steps) ? data.steps : undefined,
  parts: Array.isArray(data?.parts)
    ? data.parts.map((part: any) => ({
      name: part?.name ?? 'Partie',
      ingredients: Array.isArray(part?.ingredients) ? part.ingredients : [],
      steps: Array.isArray(part?.steps) ? part.steps : [],
    }))
    : undefined,
});
