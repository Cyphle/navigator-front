import type { MealsList, CreateMealsListInput, UpdateMealsListInput } from '../stores/meals/meals.types';
import type { DashboardMeals } from '../stores/dashboard/dashboard.types.ts';
import { getOne, post, put, deleteOne } from '../helpers/http';

export const getAllMealsLists = (familyId: string): Promise<MealsList[]> => {
  return getOne(`families/${encodeURIComponent(familyId)}/meals`, (data: any) => {
    if (!Array.isArray(data)) return [];
    return data.map(responseToMealsList);
  });
};

export const getMealsListById = (familyId: string, id: number): Promise<MealsList> => {
  return getOne(`families/${encodeURIComponent(familyId)}/meals/${id}`, responseToMealsList);
};

export const createMealsList = (familyId: string, input: CreateMealsListInput): Promise<MealsList> => {
  return post(`families/${encodeURIComponent(familyId)}/meals`, input, responseToMealsList);
};

export const updateMealsList = (familyId: string, id: number, input: UpdateMealsListInput): Promise<MealsList> => {
  return put(`families/${encodeURIComponent(familyId)}/meals/${id}`, input, responseToMealsList);
};

export const deleteMealsList = (familyId: string, id: number): Promise<void> => {
  return deleteOne(`families/${encodeURIComponent(familyId)}/meals/${id}`);
};

export const addRecipeToMealsList = (
  familyId: string,
  listId: number,
  recipeId: number,
  recipeName: string,
  assignedDays?: string[]
): Promise<MealsList> => {
  return post(
    `families/${encodeURIComponent(familyId)}/meals/${listId}/recipes`,
    { recipeId, recipeName, assignedDays },
    responseToMealsList
  );
};

export const removeRecipeFromMealsList = (familyId: string, listId: number, recipeId: number): Promise<MealsList> => {
  return deleteOne(`families/${encodeURIComponent(familyId)}/meals/${listId}/recipes/${recipeId}`, responseToMealsList);
};

export const getMealsSummary = (familyId: string): Promise<DashboardMeals> => {
  return getOne(`families/${encodeURIComponent(familyId)}/meals/summary`, (data: any): DashboardMeals => ({
    weekLabel: data?.weekLabel ?? '',
    days: Array.isArray(data?.days)
      ? data.days.map((day: any) => ({
          id: day.id,
          label: day.label,
          entries: Array.isArray(day.entries)
            ? day.entries.map((entry: any) => ({
                id: entry.id,
                name: entry.name,
                time: entry.time,
                person: entry.person,
                favorite: entry.favorite,
                thumbnailColor: entry.thumbnailColor,
                visibility: entry.visibility,
              }))
            : [],
        }))
      : [],
  }));
};

const responseToMealsList = (data: any): MealsList => ({
  id: data?.id ?? 0,
  name: data?.name ?? '',
  startDate: data?.startDate ?? '',
  endDate: data?.endDate ?? '',
  recipes: Array.isArray(data?.recipes)
    ? data.recipes.map((r: any) => ({
        recipeId: r?.recipeId ?? 0,
        recipeName: r?.recipeName ?? '',
        assignedDays: Array.isArray(r?.assignedDays) ? r.assignedDays : undefined,
      }))
    : [],
  isActiveShoppingList: Boolean(data?.isActiveShoppingList),
  createdAt: data?.createdAt ?? '',
  updatedAt: data?.updatedAt ?? '',
});
