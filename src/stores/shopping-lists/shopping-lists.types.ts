export type ShoppingListType = 'SHARED' | 'PERSONAL';
export type DesireLevel = 'REALLY_WANT' | 'MAYBE' | 'NOTED';

export interface ShoppingListItem {
  id: number;
  title: string;
  shop?: string;
  desireLevel?: DesireLevel;
  completed: boolean;
  createdAt: string;
}

export interface ShoppingList {
  id: number;
  name: string;
  type: ShoppingListType;
  familyId?: number;
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateShoppingListInput {
  name: string;
  type: ShoppingListType;
  familyId?: number;
}

export interface UpdateShoppingListInput {
  name?: string;
}

export interface CreateShoppingListItemInput {
  title: string;
  shop?: string;
  desireLevel?: DesireLevel;
}

export interface UpdateShoppingListItemInput {
  title?: string;
  shop?: string;
  desireLevel?: DesireLevel;
  completed?: boolean;
}
