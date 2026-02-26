export type TodoStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TodoListType = 'SHARED' | 'PERSONAL';

export interface TodoItem {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TodoList {
  id: number;
  name: string;
  type: TodoListType;
  familyId?: number;
  items: TodoItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoListInput {
  name: string;
  type: TodoListType;
  familyId?: number;
}

export interface UpdateTodoListInput {
  name?: string;
}

export interface CreateTodoItemInput {
  title: string;
  description?: string;
  dueDate?: string;
  status?: TodoStatus;
}

export interface UpdateTodoItemInput {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: TodoStatus;
}
