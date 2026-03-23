import type { PlannedMenuList, CreatePlannedMenuListInput, UpdatePlannedMenuListInput } from '../stores/planned-menus/planned-menus.types';
import type { DashboardWeeklyMenu } from '../stores/dashboard/dashboard.types.ts';
import { getOne, post, put, deleteOne } from '../helpers/http';

export const getAllPlannedMenuLists = (familyId: string): Promise<PlannedMenuList[]> => {
  return getOne(`families/${encodeURIComponent(familyId)}/planned-menus`, (data: any) => {
    if (!Array.isArray(data)) return [];
    return data.map(responseToPlannedMenuList);
  });
};

export const getPlannedMenuListById = (familyId: string, id: number): Promise<PlannedMenuList> => {
  return getOne(`families/${encodeURIComponent(familyId)}/planned-menus/${id}`, responseToPlannedMenuList);
};

export const createPlannedMenuList = (familyId: string, input: CreatePlannedMenuListInput): Promise<PlannedMenuList> => {
  return post(`families/${encodeURIComponent(familyId)}/planned-menus`, input, responseToPlannedMenuList);
};

export const updatePlannedMenuList = (familyId: string, id: number, input: UpdatePlannedMenuListInput): Promise<PlannedMenuList> => {
  return put(`families/${encodeURIComponent(familyId)}/planned-menus/${id}`, input, responseToPlannedMenuList);
};

export const deletePlannedMenuList = (familyId: string, id: number): Promise<void> => {
  return deleteOne(`families/${encodeURIComponent(familyId)}/planned-menus/${id}`);
};

export const addRecipeToPlannedMenuList = (
  familyId: string,
  listId: number,
  recipeId: number,
  recipeName: string,
  assignedDays?: string[]
): Promise<PlannedMenuList> => {
  return post(
    `families/${encodeURIComponent(familyId)}/planned-menus/${listId}/recipes`,
    { recipeId, recipeName, assignedDays },
    responseToPlannedMenuList
  );
};

export const removeRecipeFromPlannedMenuList = (familyId: string, listId: number, recipeId: number): Promise<PlannedMenuList> => {
  return deleteOne(`families/${encodeURIComponent(familyId)}/planned-menus/${listId}/recipes/${recipeId}`, responseToPlannedMenuList);
};

export const getPlannedMenuSummary = (familyId: string): Promise<DashboardWeeklyMenu> => {
  return getOne(`families/${encodeURIComponent(familyId)}/planned-menus/summary`, (data: any): DashboardWeeklyMenu => ({
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
