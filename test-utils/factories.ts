import type { PlannedMenuList, PlannedMenuRecipe } from '../src/stores/planned-menus/planned-menus.types';

export const aPlannedMenuRecipe = (
  overrides: Partial<PlannedMenuRecipe> = {}
): PlannedMenuRecipe => ({
  recipeId: overrides.recipeId ?? 1,
  recipeName: overrides.recipeName ?? 'Tarte aux pommes',
  assignedDays: overrides.assignedDays,
});

export const aPlannedMenuList = (
  overrides: Partial<PlannedMenuList> = {}
): PlannedMenuList => ({
  id: overrides.id ?? 1,
  name: overrides.name ?? 'Menu de la semaine',
  startDate: overrides.startDate ?? '2026-03-01',
  endDate: overrides.endDate ?? '2026-03-07',
  recipes: overrides.recipes ?? [],
  isActiveShoppingList: overrides.isActiveShoppingList ?? false,
  createdAt: overrides.createdAt ?? '2026-02-25T10:00:00Z',
  updatedAt: overrides.updatedAt ?? '2026-02-25T10:00:00Z',
});
