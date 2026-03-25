import type { MealsList, CreateMealsListInput, UpdateMealsListInput } from './meals.types';

let mealsLists: MealsList[] = [];
let nextId = 1;

export const getAllMealsLists = (): MealsList[] => {
  return mealsLists;
};

export const getMealsListById = (id: number): MealsList | undefined => {
  return mealsLists.find((list) => list.id === id);
};

export const createMealsList = (input: CreateMealsListInput): MealsList => {
  const now = new Date().toISOString();
  const newList: MealsList = {
    id: nextId++,
    name: input.name,
    startDate: input.startDate,
    endDate: input.endDate,
    recipes: [],
    isActiveShoppingList: false,
    createdAt: now,
    updatedAt: now,
  };
  mealsLists.push(newList);
  return newList;
};

export const updateMealsList = (id: number, input: UpdateMealsListInput): MealsList | undefined => {
  const listIndex = mealsLists.findIndex((list) => list.id === id);
  if (listIndex === -1) {
    return undefined;
  }

  const updatedList: MealsList = {
    ...mealsLists[listIndex],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  mealsLists[listIndex] = updatedList;
  return updatedList;
};

export const deleteMealsList = (id: number): boolean => {
  const initialLength = mealsLists.length;
  mealsLists = mealsLists.filter((list) => list.id !== id);
  return mealsLists.length < initialLength;
};

export const addRecipeToMealsList = (
  listId: number,
  recipeId: number,
  recipeName: string,
  assignedDays?: string[]
): MealsList | undefined => {
  const list = mealsLists.find((l) => l.id === listId);
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

export const removeRecipeFromMealsList = (listId: number, recipeId: number): MealsList | undefined => {
  const list = mealsLists.find((l) => l.id === listId);
  if (!list) {
    return undefined;
  }

  list.recipes = list.recipes.filter((r) => r.recipeId !== recipeId);
  list.updatedAt = new Date().toISOString();
  return list;
};
