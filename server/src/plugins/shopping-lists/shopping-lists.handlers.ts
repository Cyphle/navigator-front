import type {
  ShoppingList,
  ShoppingListItem,
  CreateShoppingListInput,
  UpdateShoppingListInput,
  CreateShoppingListItemInput,
  UpdateShoppingListItemInput,
} from './shopping-lists.types';

// Initialize with mock data
let shoppingLists: ShoppingList[] = [
  {
    id: 1,
    name: 'Famille Martin',
    type: 'SHARED',
    familyId: 1,
    items: [
      {
        id: 1,
        title: 'Pain',
        shop: 'Intermarché',
        desireLevel: 'REALLY_WANT',
        completed: false,
        createdAt: new Date('2024-02-20').toISOString(),
      },
      {
        id: 2,
        title: 'Lait',
        shop: 'Intermarché',
        completed: false,
        createdAt: new Date('2024-02-20').toISOString(),
      },
      {
        id: 3,
        title: 'Tomates',
        shop: 'Marché',
        desireLevel: 'NOTED',
        completed: true,
        createdAt: new Date('2024-02-19').toISOString(),
      },
    ],
    createdAt: new Date('2024-02-15').toISOString(),
    updatedAt: new Date('2024-02-20').toISOString(),
  },
  {
    id: 2,
    name: 'Famille Dupont',
    type: 'SHARED',
    familyId: 2,
    items: [
      {
        id: 4,
        title: 'Chocolat',
        shop: 'Picard',
        desireLevel: 'MAYBE',
        completed: false,
        createdAt: new Date('2024-02-21').toISOString(),
      },
    ],
    createdAt: new Date('2024-02-15').toISOString(),
    updatedAt: new Date('2024-02-21').toISOString(),
  },
];
let nextListId = 3;
let nextItemId = 5;

export const getAllShoppingLists = (): ShoppingList[] => {
  return shoppingLists;
};

export const getShoppingListById = (id: number): ShoppingList | undefined => {
  return shoppingLists.find((list) => list.id === id);
};

export const createShoppingList = (input: CreateShoppingListInput): ShoppingList => {
  const now = new Date().toISOString();
  const newList: ShoppingList = {
    id: nextListId++,
    name: input.name,
    type: input.type,
    familyId: input.familyId,
    items: [],
    createdAt: now,
    updatedAt: now,
  };
  shoppingLists.push(newList);
  return newList;
};

export const updateShoppingList = (id: number, input: UpdateShoppingListInput): ShoppingList | undefined => {
  const listIndex = shoppingLists.findIndex((list) => list.id === id);
  if (listIndex === -1) {
    return undefined;
  }

  const updatedList: ShoppingList = {
    ...shoppingLists[listIndex],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  shoppingLists[listIndex] = updatedList;
  return updatedList;
};

export const deleteShoppingList = (id: number): boolean => {
  const initialLength = shoppingLists.length;
  shoppingLists = shoppingLists.filter((list) => list.id !== id);
  return shoppingLists.length < initialLength;
};

export const addItemToShoppingList = (
  listId: number,
  input: CreateShoppingListItemInput
): ShoppingList | undefined => {
  const list = shoppingLists.find((l) => l.id === listId);
  if (!list) {
    return undefined;
  }

  const newItem: ShoppingListItem = {
    id: nextItemId++,
    title: input.title,
    shop: input.shop,
    desireLevel: input.desireLevel,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  list.items.push(newItem);
  list.updatedAt = new Date().toISOString();
  return list;
};

export const updateItemInShoppingList = (
  listId: number,
  itemId: number,
  input: UpdateShoppingListItemInput
): ShoppingList | undefined => {
  const list = shoppingLists.find((l) => l.id === listId);
  if (!list) {
    return undefined;
  }

  const itemIndex = list.items.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) {
    return undefined;
  }

  list.items[itemIndex] = {
    ...list.items[itemIndex],
    ...input,
  };

  list.updatedAt = new Date().toISOString();
  return list;
};

export const deleteItemFromShoppingList = (listId: number, itemId: number): ShoppingList | undefined => {
  const list = shoppingLists.find((l) => l.id === listId);
  if (!list) {
    return undefined;
  }

  list.items = list.items.filter((item) => item.id !== itemId);
  list.updatedAt = new Date().toISOString();
  return list;
};

export const clearCompletedItems = (listId: number): ShoppingList | undefined => {
  const list = shoppingLists.find((l) => l.id === listId);
  if (!list) {
    return undefined;
  }

  list.items = list.items.filter((item) => !item.completed);
  list.updatedAt = new Date().toISOString();
  return list;
};
