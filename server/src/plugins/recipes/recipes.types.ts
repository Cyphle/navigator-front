export type RecipeCategory = 'ENTREE' | 'PLAT' | 'DESSERT' | 'SAUCE' | 'APERO';

export interface RecipePart {
  name: string;
  ingredients: string[];
  steps: string[];
}

export interface Recipe {
  id: number;
  name: string;
  category: RecipeCategory;
  imageUrl?: string;
  ingredients?: string[];
  steps?: string[];
  parts?: RecipePart[];
}

export interface RecipesPage {
  items: Recipe[];
  page: number;
  pageSize: number;
  total: number;
}
