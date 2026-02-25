import type { PlannedMenuList, CreatePlannedMenuListInput, UpdatePlannedMenuListInput } from '../stores/planned-menus/planned-menus.types';
import { getOne, post, put, deleteOne } from '../helpers/http';

export const getAllPlannedMenuLists = (): Promise<PlannedMenuList[]> => {
  return getOne('planned-menus', (data: any) => {
    if (!Array.isArray(data)) return [];
    return data.map(responseToPlannedMenuList);
  });
};

export const getPlannedMenuListById = (id: number): Promise<PlannedMenuList> => {
  return getOne(`planned-menus/${id}`, responseToPlannedMenuList);
};

export const createPlannedMenuList = (input: CreatePlannedMenuListInput): Promise<PlannedMenuList> => {
  return post('planned-menus', input, responseToPlannedMenuList);
};

export const updatePlannedMenuList = (id: number, input: UpdatePlannedMenuListInput): Promise<PlannedMenuList> => {
  return put(`planned-menus/${id}`, input, responseToPlannedMenuList);
};

export const deletePlannedMenuList = (id: number): Promise<void> => {
  return deleteOne(`planned-menus/${id}`);
};

export const addRecipeToPlannedMenuList = (
  listId: number,
  recipeId: number,
  recipeName: string,
  assignedDays?: string[]
): Promise<PlannedMenuList> => {
  return post(
    `planned-menus/${listId}/recipes`,
    { recipeId, recipeName, assignedDays },
    responseToPlannedMenuList
  );
};

export const removeRecipeFromPlannedMenuList = (listId: number, recipeId: number): Promise<PlannedMenuList> => {
  return deleteOne(`planned-menus/${listId}/recipes/${recipeId}`, responseToPlannedMenuList);
};

const responseToPlannedMenuList = (data: any): PlannedMenuList => ({
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
