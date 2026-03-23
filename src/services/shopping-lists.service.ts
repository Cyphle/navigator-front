import type {
  ShoppingList,
  CreateShoppingListInput,
  UpdateShoppingListInput,
  CreateShoppingListItemInput,
  UpdateShoppingListItemInput,
} from '../stores/shopping-lists/shopping-lists.types';
import type { DashboardShopping } from '../stores/dashboard/dashboard.types.ts';
import { getOne, post, put, deleteOne } from '../helpers/http';

export const getAllShoppingLists = (familyId: string): Promise<ShoppingList[]> => {
  return getOne(`families/${encodeURIComponent(familyId)}/shopping-lists`, (data: any) => {
    if (!Array.isArray(data)) return [];
    return data.map(responseToShoppingList);
  });
};

export const getShoppingListById = (familyId: string, id: number): Promise<ShoppingList> => {
  return getOne(`families/${encodeURIComponent(familyId)}/shopping-lists/${id}`, responseToShoppingList);
};

export const createShoppingList = (familyId: string, input: CreateShoppingListInput): Promise<ShoppingList> => {
  return post(`families/${encodeURIComponent(familyId)}/shopping-lists`, input, responseToShoppingList);
};

export const updateShoppingList = (familyId: string, id: number, input: UpdateShoppingListInput): Promise<ShoppingList> => {
  return put(`families/${encodeURIComponent(familyId)}/shopping-lists/${id}`, input, responseToShoppingList);
};

export const deleteShoppingList = (familyId: string, id: number): Promise<void> => {
  return deleteOne(`families/${encodeURIComponent(familyId)}/shopping-lists/${id}`);
};

export const addItemToShoppingList = (
  familyId: string,
  listId: number,
  input: CreateShoppingListItemInput
): Promise<ShoppingList> => {
  return post(`families/${encodeURIComponent(familyId)}/shopping-lists/${listId}/items`, input, responseToShoppingList);
};

export const updateItemInShoppingList = (
  familyId: string,
  listId: number,
  itemId: number,
  input: UpdateShoppingListItemInput
): Promise<ShoppingList> => {
  return put(`families/${encodeURIComponent(familyId)}/shopping-lists/${listId}/items/${itemId}`, input, responseToShoppingList);
};

export const deleteItemFromShoppingList = (familyId: string, listId: number, itemId: number): Promise<ShoppingList> => {
  return deleteOne(`families/${encodeURIComponent(familyId)}/shopping-lists/${listId}/items/${itemId}`, responseToShoppingList);
};

export const clearCompletedItems = (familyId: string, listId: number): Promise<ShoppingList> => {
  return deleteOne(`families/${encodeURIComponent(familyId)}/shopping-lists/${listId}/items/completed`, responseToShoppingList);
};

export const getShoppingListSummary = (familyId: string): Promise<DashboardShopping> => {
  return getOne(`families/${encodeURIComponent(familyId)}/shopping-lists/summary`, (data: any): DashboardShopping => ({
    items: typeof data?.items === 'number' ? data.items : 0,
  }));
};

const responseToShoppingList = (data: any): ShoppingList => ({
  id: data?.id ?? 0,
  name: data?.name ?? '',
  type: data?.type ?? 'PERSONAL',
  familyId: data?.familyId,
  items: Array.isArray(data?.items)
    ? data.items.map((item: any) => ({
        id: item?.id ?? 0,
        title: item?.title ?? '',
        shop: item?.shop,
        desireLevel: item?.desireLevel,
        completed: Boolean(item?.completed),
        createdAt: item?.createdAt ?? '',
      }))
    : [],
  createdAt: data?.createdAt ?? '',
  updatedAt: data?.updatedAt ?? '',
});
