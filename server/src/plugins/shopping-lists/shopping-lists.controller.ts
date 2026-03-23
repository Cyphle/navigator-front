import type { FastifyPluginAsync } from 'fastify';
import {
  getAllShoppingLists,
  getShoppingListById,
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
  addItemToShoppingList,
  updateItemInShoppingList,
  deleteItemFromShoppingList,
  clearCompletedItems,
} from './shopping-lists.handlers';
import type {
  CreateShoppingListInput,
  UpdateShoppingListInput,
  CreateShoppingListItemInput,
  UpdateShoppingListItemInput,
} from './shopping-lists.types';

export const shoppingListsController: FastifyPluginAsync = async (fastify) => {
  // Get shopping summary for a family (registered FIRST to avoid conflict with /:familyId/shopping-lists/:id)
  fastify.get<{ Params: { familyId: string } }>('/:familyId/shopping-lists/summary', async (request, reply) => {
    const familyId = parseInt(request.params.familyId, 10);
    const familyLists = getAllShoppingLists().filter((list) => list.familyId === familyId);
    const itemCount = familyLists.reduce((sum, list) => sum + list.items.filter((item) => !item.completed).length, 0);
    return reply.code(200).send({ items: itemCount });
  });

  // Get all shopping lists
  fastify.get<{ Params: { familyId: string } }>('/:familyId/shopping-lists', async (_request, reply) => {
    const lists = getAllShoppingLists();
    return reply.code(200).send(lists);
  });

  // Get a specific shopping list
  fastify.get<{ Params: { familyId: string; id: string } }>('/:familyId/shopping-lists/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const list = getShoppingListById(id);

    if (!list) {
      return reply.code(404).send({ error: 'Shopping list not found' });
    }

    return reply.code(200).send(list);
  });

  // Create a new shopping list
  fastify.post<{ Params: { familyId: string }; Body: CreateShoppingListInput }>('/:familyId/shopping-lists', async (request, reply) => {
    const newList = createShoppingList(request.body);
    return reply.code(201).send(newList);
  });

  // Update a shopping list
  fastify.put<{ Params: { familyId: string; id: string }; Body: UpdateShoppingListInput }>(
    '/:familyId/shopping-lists/:id',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const updatedList = updateShoppingList(id, request.body);

      if (!updatedList) {
        return reply.code(404).send({ error: 'Shopping list not found' });
      }

      return reply.code(200).send(updatedList);
    }
  );

  // Delete a shopping list
  fastify.delete<{ Params: { familyId: string; id: string } }>('/:familyId/shopping-lists/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const deleted = deleteShoppingList(id);

    if (!deleted) {
      return reply.code(404).send({ error: 'Shopping list not found' });
    }

    return reply.code(204).send();
  });

  // Clear all completed items from a shopping list (registered BEFORE /:familyId/shopping-lists/:id/items/:itemId)
  fastify.delete<{ Params: { familyId: string; id: string } }>(
    '/:familyId/shopping-lists/:id/items/completed',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const updatedList = clearCompletedItems(id);

      if (!updatedList) {
        return reply.code(404).send({ error: 'Shopping list not found' });
      }

      return reply.code(200).send(updatedList);
    }
  );

  // Add an item to a shopping list
  fastify.post<{ Params: { familyId: string; id: string }; Body: CreateShoppingListItemInput }>(
    '/:familyId/shopping-lists/:id/items',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const updatedList = addItemToShoppingList(id, request.body);

      if (!updatedList) {
        return reply.code(404).send({ error: 'Shopping list not found' });
      }

      return reply.code(200).send(updatedList);
    }
  );

  // Update an item in a shopping list
  fastify.put<{ Params: { familyId: string; id: string; itemId: string }; Body: UpdateShoppingListItemInput }>(
    '/:familyId/shopping-lists/:id/items/:itemId',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const itemId = parseInt(request.params.itemId, 10);
      const updatedList = updateItemInShoppingList(id, itemId, request.body);

      if (!updatedList) {
        return reply.code(404).send({ error: 'Shopping list or item not found' });
      }

      return reply.code(200).send(updatedList);
    }
  );

  // Delete an item from a shopping list
  fastify.delete<{ Params: { familyId: string; id: string; itemId: string } }>(
    '/:familyId/shopping-lists/:id/items/:itemId',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const itemId = parseInt(request.params.itemId, 10);
      const updatedList = deleteItemFromShoppingList(id, itemId);

      if (!updatedList) {
        return reply.code(404).send({ error: 'Shopping list or item not found' });
      }

      return reply.code(200).send(updatedList);
    }
  );
};
