import type {
  TodoList,
  TodoItem,
  CreateTodoListInput,
  UpdateTodoListInput,
  CreateTodoItemInput,
  UpdateTodoItemInput,
} from './family-todos.types';

// Initialize with mock data
let todoLists: TodoList[] = [
  {
    id: 1,
    name: 'Famille Martin',
    type: 'SHARED',
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

export const getAllTodoLists = (): TodoList[] => {
  return todoLists;
};

export const getTodoListById = (id: number): TodoList | undefined => {
  return todoLists.find((list) => list.id === id);
};

export const createTodoList = (input: CreateTodoListInput): TodoList => {
  const now = new Date().toISOString();
  const newList: TodoList = {
    id: nextListId++,
    name: input.name,
    type: input.type,
    familyId: input.familyId,
    items: [],
    createdAt: now,
    updatedAt: now,
  };
  todoLists.push(newList);
  return newList;
};

export const updateTodoList = (id: number, input: UpdateTodoListInput): TodoList | undefined => {
  const listIndex = todoLists.findIndex((list) => list.id === id);
  if (listIndex === -1) {
    return undefined;
  }

  const updatedList: TodoList = {
    ...todoLists[listIndex],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  todoLists[listIndex] = updatedList;
  return updatedList;
};

export const deleteTodoList = (id: number): boolean => {
  const initialLength = todoLists.length;
  todoLists = todoLists.filter((list) => list.id !== id);
  return todoLists.length < initialLength;
};

export const addItemToTodoList = (
  listId: number,
  input: CreateTodoItemInput
): TodoList | undefined => {
  const list = todoLists.find((l) => l.id === listId);
  if (!list) {
    return undefined;
  }

  const now = new Date().toISOString();
  const newItem: TodoItem = {
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

export const updateItemInTodoList = (
  listId: number,
  itemId: number,
  input: UpdateTodoItemInput
): TodoList | undefined => {
  const list = todoLists.find((l) => l.id === listId);
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

export const deleteItemFromTodoList = (listId: number, itemId: number): TodoList | undefined => {
  const list = todoLists.find((l) => l.id === listId);
  if (!list) {
    return undefined;
  }

  list.items = list.items.filter((item) => item.id !== itemId);
  list.updatedAt = new Date().toISOString();
  return list;
};

export const clearCompletedTodos = (listId: number): TodoList | undefined => {
  const list = todoLists.find((l) => l.id === listId);
  if (!list) {
    return undefined;
  }

  list.items = list.items.filter((item) => item.status !== 'DONE');
  list.updatedAt = new Date().toISOString();
  return list;
};
