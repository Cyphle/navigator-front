import type {
  TodoList,
  CreateTodoListInput,
  UpdateTodoListInput,
  CreateTodoItemInput,
  UpdateTodoItemInput,
} from '../stores/family-todos/family-todos.types';
import { getOne, post, put, deleteOne } from '../helpers/http';

export const getAllTodoLists = (): Promise<TodoList[]> => {
  return getOne('family-todos', (data: any) => {
    if (!Array.isArray(data)) return [];
    return data.map(responseToTodoList);
  });
};

export const getTodoListById = (id: number): Promise<TodoList> => {
  return getOne(`family-todos/${id}`, responseToTodoList);
};

export const createTodoList = (input: CreateTodoListInput): Promise<TodoList> => {
  return post('family-todos', input, responseToTodoList);
};

export const updateTodoList = (id: number, input: UpdateTodoListInput): Promise<TodoList> => {
  return put(`family-todos/${id}`, input, responseToTodoList);
};

export const deleteTodoList = (id: number): Promise<void> => {
  return deleteOne(`family-todos/${id}`);
};

export const addItemToTodoList = (
  listId: number,
  input: CreateTodoItemInput
): Promise<TodoList> => {
  return post(`family-todos/${listId}/items`, input, responseToTodoList);
};

export const updateItemInTodoList = (
  listId: number,
  itemId: number,
  input: UpdateTodoItemInput
): Promise<TodoList> => {
  return put(`family-todos/${listId}/items/${itemId}`, input, responseToTodoList);
};

export const deleteItemFromTodoList = (listId: number, itemId: number): Promise<TodoList> => {
  return deleteOne(`family-todos/${listId}/items/${itemId}`, responseToTodoList);
};

export const clearCompletedTodos = (listId: number): Promise<TodoList> => {
  return deleteOne(`family-todos/${listId}/items/completed`, responseToTodoList);
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
