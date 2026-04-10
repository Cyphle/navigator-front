import type {
  MagicList,
  MagicItem,
  MagicListKind,
  CreateMagicListInput,
  UpdateMagicListInput,
  CreateMagicItemInput,
  UpdateMagicItemInput,
} from './magic-lists.types';

// Initialize with mock data
let magicLists: MagicList[] = [
  {
    id: 1,
    name: 'Famille Martin',
    type: 'SHARED',
    kind: 'TASK' as MagicListKind,
    familyId: 1,
    items: [
      {
        id: 1,
        title: 'Réparer la fuite dans la salle de bain',
        description: 'Appeler le plombier',
        dueDate: new Date('2026-03-01').toISOString(),
        status: 'TODO',
        createdAt: new Date('2026-02-20').toISOString(),
        updatedAt: new Date('2026-02-20').toISOString(),
      },
      {
        id: 2,
        title: 'Organiser l\'anniversaire de Emma',
        description: 'Réserver le restaurant et préparer les invitations',
        dueDate: new Date('2026-03-15').toISOString(),
        status: 'IN_PROGRESS',
        createdAt: new Date('2026-02-18').toISOString(),
        updatedAt: new Date('2026-02-22').toISOString(),
      },
      {
        id: 3,
        title: 'Nettoyer le garage',
        status: 'DONE',
        createdAt: new Date('2026-02-15').toISOString(),
        updatedAt: new Date('2026-02-21').toISOString(),
      },
    ],
    createdAt: new Date('2026-02-15').toISOString(),
    updatedAt: new Date('2026-02-22').toISOString(),
  },
  {
    id: 2,
    name: 'Famille Dupont',
    type: 'SHARED',
    kind: 'SIMPLE' as MagicListKind,
    familyId: 2,
    items: [
      {
        id: 4,
        title: 'Préparer les vacances d\'été',
        description: 'Réserver l\'hôtel et les billets d\'avion',
        dueDate: new Date('2026-04-01').toISOString(),
        status: 'TODO',
        createdAt: new Date('2026-02-20').toISOString(),
        updatedAt: new Date('2026-02-20').toISOString(),
      },
    ],
    createdAt: new Date('2026-02-15').toISOString(),
    updatedAt: new Date('2026-02-20').toISOString(),
  },
];
let nextListId = 3;
let nextItemId = 5;

export const getAllMagicLists = (): MagicList[] => {
  return magicLists;
};

export const getMagicListById = (id: number): MagicList | undefined => {
  return magicLists.find((list) => list.id === id);
};

export const createMagicList = (input: CreateMagicListInput): MagicList => {
  const now = new Date().toISOString();
  const newList: MagicList = {
    id: nextListId++,
    name: input.name,
    type: input.type,
    kind: input.kind,
    familyId: input.familyId,
    items: [],
    createdAt: now,
    updatedAt: now,
  };
  magicLists.push(newList);
  return newList;
};

export const updateMagicList = (id: number, input: UpdateMagicListInput): MagicList | undefined => {
  const listIndex = magicLists.findIndex((list) => list.id === id);
  if (listIndex === -1) {
    return undefined;
  }

  const updatedList: MagicList = {
    ...magicLists[listIndex],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  magicLists[listIndex] = updatedList;
  return updatedList;
};

export const deleteMagicList = (id: number): boolean => {
  const initialLength = magicLists.length;
  magicLists = magicLists.filter((list) => list.id !== id);
  return magicLists.length < initialLength;
};

export const addItemToMagicList = (
  listId: number,
  input: CreateMagicItemInput
): MagicList | undefined => {
  const list = magicLists.find((l) => l.id === listId);
  if (!list) {
    return undefined;
  }

  const now = new Date().toISOString();
  const newItem: MagicItem = {
    id: nextItemId++,
    title: input.title,
    description: input.description,
    dueDate: input.dueDate,
    status: input.status || 'TODO',
    createdAt: now,
    updatedAt: now,
  };

  list.items.push(newItem);
  list.updatedAt = new Date().toISOString();
  return list;
};

export const updateItemInMagicList = (
  listId: number,
  itemId: number,
  input: UpdateMagicItemInput
): MagicList | undefined => {
  const list = magicLists.find((l) => l.id === listId);
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
    updatedAt: new Date().toISOString(),
  };

  list.updatedAt = new Date().toISOString();
  return list;
};

export const deleteItemFromMagicList = (listId: number, itemId: number): MagicList | undefined => {
  const list = magicLists.find((l) => l.id === listId);
  if (!list) {
    return undefined;
  }

  list.items = list.items.filter((item) => item.id !== itemId);
  list.updatedAt = new Date().toISOString();
  return list;
};

export const clearCompletedMagicListItems = (listId: number): MagicList | undefined => {
  const list = magicLists.find((l) => l.id === listId);
  if (!list) {
    return undefined;
  }

  list.items = list.items.filter((item) => item.status !== 'DONE');
  list.updatedAt = new Date().toISOString();
  return list;
};
