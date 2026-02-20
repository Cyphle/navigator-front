import { Database } from '../../database/database';
import { Recipe, RecipeCategory, RecipesPage } from './recipes.types';

export const getRecipesHandler = (database: Database) => (
  page: number,
  pageSize: number,
  category?: RecipeCategory,
  search?: string,
  minRating?: number,
  sort?: string
): RecipesPage => {
  const recipes = database.read<Recipe>('recipes');
  const normalizedSearch = search?.trim().toLowerCase();
  const filtered = recipes.filter((recipe) => {
    if (category && recipe.category !== category) {
      return false;
    }

    const ratingValue = typeof recipe.rating === 'number' ? recipe.rating : 0;
    if (minRating && ratingValue < minRating) {
      return false;
    }

    if (normalizedSearch && normalizedSearch.length >= 3) {
      return recipe.name.toLowerCase().includes(normalizedSearch);
    }

    return true;
  });

  const sorted = [...filtered];
  switch (sort) {
    case 'NAME_DESC':
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'RATING_DESC':
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      break;
    case 'RATING_ASC':
      sorted.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
      break;
    default:
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  const total = sorted.length;
  const safePage = page > 0 ? page : 1;
  const safePageSize = pageSize > 0 ? pageSize : 6;
  const start = (safePage - 1) * safePageSize;
  const items = sorted.slice(start, start + safePageSize);

  return {
    items,
    page: safePage,
    pageSize: safePageSize,
    total,
  };
};

export const deleteRecipeHandler = (database: Database) => (id: number): boolean => {
  const existing = database.readOneById<Recipe>('recipes', id);

  if (!existing) {
    return false;
  }

  database.delete('recipes', id);
  return true;
};

export const updateRecipeRatingHandler = (database: Database) => (id: number, rating: number): Recipe | undefined => {
  const existing = database.readOneById<Recipe>('recipes', id);

  if (!existing) {
    return undefined;
  }

  if (!Number.isFinite(rating)) {
    return existing;
  }

  const normalizedRating = Math.max(1, Math.min(5, Math.round(rating)));
  const updated: Recipe = {
    ...existing,
    rating: normalizedRating,
  };

  database.update<Recipe>('recipes', id, updated);
  return updated;
};
