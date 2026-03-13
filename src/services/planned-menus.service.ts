import type { PlannedMenuList, CreatePlannedMenuListInput, UpdatePlannedMenuListInput } from '../stores/planned-menus/planned-menus.types';
import { getOne, post, put, deleteOne } from '../helpers/http';

const withFamily = (path: string, familyId: string) =>
  `${path}${path.includes('?') ? '&' : '?'}familyId=${encodeURIComponent(familyId)}`;

export const getAllPlannedMenuLists = (familyId: string): Promise<PlannedMenuList[]> => {
  return getOne(withFamily('planned-menus', familyId), (data: any) => {
    if (!Array.isArray(data)) return [];
    return data.map(responseToPlannedMenuList);
  });
};

export const getPlannedMenuListById = (familyId: string, id: number): Promise<PlannedMenuList> => {
  return getOne(withFamily(`planned-menus/${id}`, familyId), responseToPlannedMenuList);
};

export const createPlannedMenuList = (familyId: string, input: CreatePlannedMenuListInput): Promise<PlannedMenuList> => {
  return post(withFamily('planned-menus', familyId), input, responseToPlannedMenuList);
};

export const updatePlannedMenuList = (familyId: string, id: number, input: UpdatePlannedMenuListInput): Promise<PlannedMenuList> => {
  return put(withFamily(`planned-menus/${id}`, familyId), input, responseToPlannedMenuList);
};

export const deletePlannedMenuList = (familyId: string, id: number): Promise<void> => {
  return deleteOne(withFamily(`planned-menus/${id}`, familyId));
};

export const addRecipeToPlannedMenuList = (
  familyId: string,
  listId: number,
  recipeId: number,
  recipeName: string,
  assignedDays?: string[]
): Promise<PlannedMenuList> => {
  return post(
    withFamily(`planned-menus/${listId}/recipes`, familyId),
    { recipeId, recipeName, assignedDays },
    responseToPlannedMenuList
  );
};

export const removeRecipeFromPlannedMenuList = (familyId: string, listId: number, recipeId: number): Promise<PlannedMenuList> => {
  return deleteOne(withFamily(`planned-menus/${listId}/recipes/${recipeId}`, familyId), responseToPlannedMenuList);
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
