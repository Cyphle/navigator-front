import { Database } from '../../database/database';
import { Recipe, RecipeCategory, RecipesPage } from './recipes.types';

export const getRecipesHandler = (database: Database) => (
  page: number,
  pageSize: number,
  category?: RecipeCategory,
  search?: string
): RecipesPage => {
  const recipes = database.read<Recipe>('recipes');
  const normalizedSearch = search?.trim().toLowerCase();
  const filtered = recipes.filter((recipe) => {
    if (category && recipe.category !== category) {
      return false;
    }

    if (normalizedSearch && normalizedSearch.length >= 3) {
      return recipe.name.toLowerCase().includes(normalizedSearch);
    }

    return true;
  });
  const total = filtered.length;
  const safePage = page > 0 ? page : 1;
  const safePageSize = pageSize > 0 ? pageSize : 6;
  const start = (safePage - 1) * safePageSize;
  const items = filtered.slice(start, start + safePageSize);

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
