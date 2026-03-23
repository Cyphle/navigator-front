import type { FastifyPluginAsync } from 'fastify';
import {
  getAllTodoLists,
  getTodoListById,
  createTodoList,
  updateTodoList,
  deleteTodoList,
  addItemToTodoList,
  updateItemInTodoList,
  deleteItemFromTodoList,
  clearCompletedTodos,
} from './family-todos.handlers';
import type {
  CreateTodoListInput,
  UpdateTodoListInput,
  CreateTodoItemInput,
  UpdateTodoItemInput,
} from './family-todos.types';

export const familyTodosController: FastifyPluginAsync = async (fastify) => {
  // Get todos summary for a family (registered FIRST to avoid conflict with /:familyId/todos/:id)
  fastify.get<{ Params: { familyId: string } }>('/:familyId/todos/summary', async (request, reply) => {
    const familyId = parseInt(request.params.familyId, 10);
    const familyLists = getAllTodoLists().filter((list) => list.familyId === familyId);
    const summary = familyLists.flatMap((list) =>
      list.items.map((item) => ({
        id: item.id,
        label: item.title,
        assignee: list.name,
        completed: item.status === 'DONE',
        visibility: list.type === 'SHARED' ? 'FAMILY' : 'PERSONAL',
      }))
    );
    return reply.code(200).send(summary);
  });

  // Get all todo lists
  fastify.get<{ Params: { familyId: string } }>('/:familyId/todos', async (_request, reply) => {
    const lists = getAllTodoLists();
    return reply.code(200).send(lists);
  });

  // Get a specific todo list
  fastify.get<{ Params: { familyId: string; id: string } }>('/:familyId/todos/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const list = getTodoListById(id);

    if (!list) {
      return reply.code(404).send({ error: 'Todo list not found' });
    }

    return reply.code(200).send(list);
  });

  // Create a new todo list
  fastify.post<{ Params: { familyId: string }; Body: CreateTodoListInput }>('/:familyId/todos', async (request, reply) => {
    const newList = createTodoList(request.body);
    return reply.code(201).send(newList);
  });

  // Update a todo list
  fastify.put<{ Params: { familyId: string; id: string }; Body: UpdateTodoListInput }>(
    '/:familyId/todos/:id',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const updatedList = updateTodoList(id, request.body);

      if (!updatedList) {
        return reply.code(404).send({ error: 'Todo list not found' });
      }

      return reply.code(200).send(updatedList);
    }
  );

  // Delete a todo list
  fastify.delete<{ Params: { familyId: string; id: string } }>('/:familyId/todos/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const deleted = deleteTodoList(id);

    if (!deleted) {
      return reply.code(404).send({ error: 'Todo list not found' });
    }

    return reply.code(204).send();
  });

  // Clear all completed todos from a todo list (registered BEFORE /:familyId/todos/:id/items/:itemId)
  fastify.delete<{ Params: { familyId: string; id: string } }>(
    '/:familyId/todos/:id/items/completed',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const updatedList = clearCompletedTodos(id);

      if (!updatedList) {
        return reply.code(404).send({ error: 'Todo list not found' });
      }

      return reply.code(200).send(updatedList);
    }
  );

  // Add an item to a todo list
  fastify.post<{ Params: { familyId: string; id: string }; Body: CreateTodoItemInput }>(
    '/:familyId/todos/:id/items',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const updatedList = addItemToTodoList(id, request.body);

      if (!updatedList) {
        return reply.code(404).send({ error: 'Todo list not found' });
      }

      return reply.code(200).send(updatedList);
    }
  );

  // Update an item in a todo list
  fastify.put<{ Params: { familyId: string; id: string; itemId: string }; Body: UpdateTodoItemInput }>(
    '/:familyId/todos/:id/items/:itemId',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const itemId = parseInt(request.params.itemId, 10);
      const updatedList = updateItemInTodoList(id, itemId, request.body);

      if (!updatedList) {
        return reply.code(404).send({ error: 'Todo list or item not found' });
      }

      return reply.code(200).send(updatedList);
    }
  );

  // Delete an item from a todo list
  fastify.delete<{ Params: { familyId: string; id: string; itemId: string } }>(
    '/:familyId/todos/:id/items/:itemId',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const itemId = parseInt(request.params.itemId, 10);
      const updatedList = deleteItemFromTodoList(id, itemId);

      if (!updatedList) {
        return reply.code(404).send({ error: 'Todo list or item not found' });
      }

      return reply.code(200).send(updatedList);
    }
  );
};
