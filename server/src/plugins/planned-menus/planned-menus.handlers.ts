import type { PlannedMenuList, CreatePlannedMenuListInput, UpdatePlannedMenuListInput } from './planned-menus.types';

let plannedMenuLists: PlannedMenuList[] = [];
let nextId = 1;

export const getAllPlannedMenuLists = (): PlannedMenuList[] => {
  return plannedMenuLists;
};

export const getPlannedMenuListById = (id: number): PlannedMenuList | undefined => {
  return plannedMenuLists.find((list) => list.id === id);
};

export const createPlannedMenuList = (input: CreatePlannedMenuListInput): PlannedMenuList => {
  const now = new Date().toISOString();
  const newList: PlannedMenuList = {
    id: nextId++,
    name: input.name,
    startDate: input.startDate,
    endDate: input.endDate,
    recipes: [],
    isActiveShoppingList: false,
    createdAt: now,
    updatedAt: now,
  };
  plannedMenuLists.push(newList);
  return newList;
};

export const updatePlannedMenuList = (id: number, input: UpdatePlannedMenuListInput): PlannedMenuList | undefined => {
  const listIndex = plannedMenuLists.findIndex((list) => list.id === id);
  if (listIndex === -1) {
    return undefined;
  }

  const updatedList: PlannedMenuList = {
    ...plannedMenuLists[listIndex],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  plannedMenuLists[listIndex] = updatedList;
  return updatedList;
};

export const deletePlannedMenuList = (id: number): boolean => {
  const initialLength = plannedMenuLists.length;
  plannedMenuLists = plannedMenuLists.filter((list) => list.id !== id);
  return plannedMenuLists.length < initialLength;
};

export const addRecipeToPlannedMenuList = (
  listId: number,
  recipeId: number,
  recipeName: string,
  assignedDays?: string[]
): PlannedMenuList | undefined => {
  const list = plannedMenuLists.find((l) => l.id === listId);
  if (!list) {
    return undefined;
  }

  // Check if recipe already exists
  const existingRecipeIndex = list.recipes.findIndex((r) => r.recipeId === recipeId);
  if (existingRecipeIndex !== -1) {
    // Update existing recipe
    list.recipes[existingRecipeIndex] = {
      recipeId,
      recipeName,
      assignedDays: assignedDays || list.recipes[existingRecipeIndex].assignedDays,
    };
  } else {
    // Add new recipe
    list.recipes.push({
      recipeId,
      recipeName,
      assignedDays,
    });
  }

  list.updatedAt = new Date().toISOString();
  return list;
};

export const removeRecipeFromPlannedMenuList = (listId: number, recipeId: number): PlannedMenuList | undefined => {
  const list = plannedMenuLists.find((l) => l.id === listId);
  if (!list) {
    return undefined;
  }

  list.recipes = list.recipes.filter((r) => r.recipeId !== recipeId);
  list.updatedAt = new Date().toISOString();
  return list;
};
