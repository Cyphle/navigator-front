import type {
  TodoList,
  CreateTodoListInput,
  UpdateTodoListInput,
  CreateTodoItemInput,
  UpdateTodoItemInput,
} from '../stores/family-todos/family-todos.types';
import { getOne, post, put, deleteOne } from '../helpers/http';

const withFamily = (path: string, familyId: string) =>
  `${path}${path.includes('?') ? '&' : '?'}familyId=${encodeURIComponent(familyId)}`;

export const getAllTodoLists = (familyId: string): Promise<TodoList[]> => {
  return getOne(withFamily('family-todos', familyId), (data: any) => {
    if (!Array.isArray(data)) return [];
    return data.map(responseToTodoList);
  });
};

export const getTodoListById = (familyId: string, id: number): Promise<TodoList> => {
  return getOne(withFamily(`family-todos/${id}`, familyId), responseToTodoList);
};

export const createTodoList = (familyId: string, input: CreateTodoListInput): Promise<TodoList> => {
  return post(withFamily('family-todos', familyId), input, responseToTodoList);
};

export const updateTodoList = (familyId: string, id: number, input: UpdateTodoListInput): Promise<TodoList> => {
  return put(withFamily(`family-todos/${id}`, familyId), input, responseToTodoList);
};

export const deleteTodoList = (familyId: string, id: number): Promise<void> => {
  return deleteOne(withFamily(`family-todos/${id}`, familyId));
};

export const addItemToTodoList = (
  familyId: string,
  listId: number,
  input: CreateTodoItemInput
): Promise<TodoList> => {
  return post(withFamily(`family-todos/${listId}/items`, familyId), input, responseToTodoList);
};

export const updateItemInTodoList = (
  familyId: string,
  listId: number,
  itemId: number,
  input: UpdateTodoItemInput
): Promise<TodoList> => {
  return put(withFamily(`family-todos/${listId}/items/${itemId}`, familyId), input, responseToTodoList);
};

export const deleteItemFromTodoList = (familyId: string, listId: number, itemId: number): Promise<TodoList> => {
  return deleteOne(withFamily(`family-todos/${listId}/items/${itemId}`, familyId), responseToTodoList);
};

export const clearCompletedTodos = (familyId: string, listId: number): Promise<TodoList> => {
  return deleteOne(withFamily(`family-todos/${listId}/items/completed`, familyId), responseToTodoList);
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
