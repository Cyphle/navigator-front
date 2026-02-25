import type {
  ShoppingList,
  CreateShoppingListInput,
  UpdateShoppingListInput,
  CreateShoppingListItemInput,
  UpdateShoppingListItemInput,
} from '../stores/shopping-lists/shopping-lists.types';
import { getOne, post, put, deleteOne } from '../helpers/http';

export const getAllShoppingLists = (): Promise<ShoppingList[]> => {
  return getOne('shopping-lists', (data: any) => {
    if (!Array.isArray(data)) return [];
    return data.map(responseToShoppingList);
  });
};

export const getShoppingListById = (id: number): Promise<ShoppingList> => {
  return getOne(`shopping-lists/${id}`, responseToShoppingList);
};

export const createShoppingList = (input: CreateShoppingListInput): Promise<ShoppingList> => {
  return post('shopping-lists', input, responseToShoppingList);
};

export const updateShoppingList = (id: number, input: UpdateShoppingListInput): Promise<ShoppingList> => {
  return put(`shopping-lists/${id}`, input, responseToShoppingList);
};

export const deleteShoppingList = (id: number): Promise<void> => {
  return deleteOne(`shopping-lists/${id}`);
};

export const addItemToShoppingList = (
  listId: number,
  input: CreateShoppingListItemInput
): Promise<ShoppingList> => {
  return post(`shopping-lists/${listId}/items`, input, responseToShoppingList);
};

export const updateItemInShoppingList = (
  listId: number,
  itemId: number,
  input: UpdateShoppingListItemInput
): Promise<ShoppingList> => {
  return put(`shopping-lists/${listId}/items/${itemId}`, input, responseToShoppingList);
};

export const deleteItemFromShoppingList = (listId: number, itemId: number): Promise<ShoppingList> => {
  return deleteOne(`shopping-lists/${listId}/items/${itemId}`, responseToShoppingList);
};

export const clearCompletedItems = (listId: number): Promise<ShoppingList> => {
  return deleteOne(`shopping-lists/${listId}/items/completed`, responseToShoppingList);
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
