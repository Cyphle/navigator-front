import type {
  ShoppingList,
  CreateShoppingListInput,
  UpdateShoppingListInput,
  CreateShoppingListItemInput,
  UpdateShoppingListItemInput,
} from '../stores/shopping-lists/shopping-lists.types';
import { getOne, post, put, deleteOne } from '../helpers/http';

const withFamily = (path: string, familyId: string) =>
  `${path}${path.includes('?') ? '&' : '?'}familyId=${encodeURIComponent(familyId)}`;

export const getAllShoppingLists = (familyId: string): Promise<ShoppingList[]> => {
  return getOne(withFamily('shopping-lists', familyId), (data: any) => {
    if (!Array.isArray(data)) return [];
    return data.map(responseToShoppingList);
  });
};

export const getShoppingListById = (familyId: string, id: number): Promise<ShoppingList> => {
  return getOne(withFamily(`shopping-lists/${id}`, familyId), responseToShoppingList);
};

export const createShoppingList = (familyId: string, input: CreateShoppingListInput): Promise<ShoppingList> => {
  return post(withFamily('shopping-lists', familyId), input, responseToShoppingList);
};

export const updateShoppingList = (familyId: string, id: number, input: UpdateShoppingListInput): Promise<ShoppingList> => {
  return put(withFamily(`shopping-lists/${id}`, familyId), input, responseToShoppingList);
};

export const deleteShoppingList = (familyId: string, id: number): Promise<void> => {
  return deleteOne(withFamily(`shopping-lists/${id}`, familyId));
};

export const addItemToShoppingList = (
  familyId: string,
  listId: number,
  input: CreateShoppingListItemInput
): Promise<ShoppingList> => {
  return post(withFamily(`shopping-lists/${listId}/items`, familyId), input, responseToShoppingList);
};

export const updateItemInShoppingList = (
  familyId: string,
  listId: number,
  itemId: number,
  input: UpdateShoppingListItemInput
): Promise<ShoppingList> => {
  return put(withFamily(`shopping-lists/${listId}/items/${itemId}`, familyId), input, responseToShoppingList);
};

export const deleteItemFromShoppingList = (familyId: string, listId: number, itemId: number): Promise<ShoppingList> => {
  return deleteOne(withFamily(`shopping-lists/${listId}/items/${itemId}`, familyId), responseToShoppingList);
};

export const clearCompletedItems = (familyId: string, listId: number): Promise<ShoppingList> => {
  return deleteOne(withFamily(`shopping-lists/${listId}/items/completed`, familyId), responseToShoppingList);
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
