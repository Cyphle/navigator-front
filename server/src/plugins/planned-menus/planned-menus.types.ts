export interface PlannedMenuRecipe {
  recipeId: number;
  recipeName: string;
  assignedDays?: string[]; // ISO date strings (optional)
}

export interface PlannedMenuList {
  id: number;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  recipes: PlannedMenuRecipe[];
  isActiveShoppingList: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlannedMenuListInput {
  name: string;
  startDate: string;
  endDate: string;
}

export interface UpdatePlannedMenuListInput {
  name?: string;
  startDate?: string;
  endDate?: string;
  recipes?: PlannedMenuRecipe[];
  isActiveShoppingList?: boolean;
}
