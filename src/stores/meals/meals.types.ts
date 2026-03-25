export interface MealsRecipe {
  recipeId: number;
  recipeName: string;
  assignedDays?: string[]; // ISO date strings (optional)
}

export interface MealsList {
  id: number;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  recipes: MealsRecipe[];
  isActiveShoppingList: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMealsListInput {
  name: string;
  startDate: string;
  endDate: string;
}

export interface UpdateMealsListInput {
  name?: string;
  startDate?: string;
  endDate?: string;
  recipes?: MealsRecipe[];
  isActiveShoppingList?: boolean;
}
