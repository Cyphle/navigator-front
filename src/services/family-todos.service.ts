import type {
  TodoList,
  CreateTodoListInput,
  UpdateTodoListInput,
  CreateTodoItemInput,
  UpdateTodoItemInput,
} from '../stores/family-todos/family-todos.types';
import type { DashboardTodoItem } from '../stores/dashboard/dashboard.types.ts';
import { getOne, post, put, deleteOne } from '../helpers/http';

export const getAllTodoLists = (familyId: string): Promise<TodoList[]> => {
  return getOne(`families/${encodeURIComponent(familyId)}/todos`, (data: any) => {
    if (!Array.isArray(data)) return [];
    return data.map(responseToTodoList);
  });
};

export const getTodoListById = (familyId: string, id: number): Promise<TodoList> => {
  return getOne(`families/${encodeURIComponent(familyId)}/todos/${id}`, responseToTodoList);
};

export const createTodoList = (familyId: string, input: CreateTodoListInput): Promise<TodoList> => {
  return post(`families/${encodeURIComponent(familyId)}/todos`, input, responseToTodoList);
};

export const updateTodoList = (familyId: string, id: number, input: UpdateTodoListInput): Promise<TodoList> => {
  return put(`families/${encodeURIComponent(familyId)}/todos/${id}`, input, responseToTodoList);
};

export const deleteTodoList = (familyId: string, id: number): Promise<void> => {
  return deleteOne(`families/${encodeURIComponent(familyId)}/todos/${id}`);
};

export const addItemToTodoList = (
  familyId: string,
  listId: number,
  input: CreateTodoItemInput
): Promise<TodoList> => {
  return post(`families/${encodeURIComponent(familyId)}/todos/${listId}/items`, input, responseToTodoList);
};

export const updateItemInTodoList = (
  familyId: string,
  listId: number,
  itemId: number,
  input: UpdateTodoItemInput
): Promise<TodoList> => {
  return put(`families/${encodeURIComponent(familyId)}/todos/${listId}/items/${itemId}`, input, responseToTodoList);
};

export const deleteItemFromTodoList = (familyId: string, listId: number, itemId: number): Promise<TodoList> => {
  return deleteOne(`families/${encodeURIComponent(familyId)}/todos/${listId}/items/${itemId}`, responseToTodoList);
};

export const clearCompletedTodos = (familyId: string, listId: number): Promise<TodoList> => {
  return deleteOne(`families/${encodeURIComponent(familyId)}/todos/${listId}/items/completed`, responseToTodoList);
};

export const getTodosSummary = (familyId: string): Promise<DashboardTodoItem[]> => {
  return getOne(`families/${encodeURIComponent(familyId)}/todos/summary`, (data: any) => {
    if (!Array.isArray(data)) return [];
    return data.map((item: any): DashboardTodoItem => ({
      id: item.id,
      label: item.label,
      assignee: item.assignee,
      completed: item.completed,
      visibility: item.visibility,
    }));
  });
};

const responseToTodoList = (data: any): TodoList => ({
  id: data?.id ?? 0,
  name: data?.name ?? '',
  type: data?.type ?? 'PERSONAL',
  familyId: data?.familyId,
  items: Array.isArray(data?.items)
    ? data.items.map((item: any) => ({
        id: item?.id ?? 0,
        title: item?.title ?? '',
        description: item?.description,
        dueDate: item?.dueDate,
        status: item?.status ?? 'TODO',
        createdAt: item?.createdAt ?? '',
        updatedAt: item?.updatedAt ?? '',
      }))
    : [],
  createdAt: data?.createdAt ?? '',
  updatedAt: data?.updatedAt ?? '',
});
