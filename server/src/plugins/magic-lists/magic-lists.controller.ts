import type { FastifyPluginAsync } from 'fastify';
import {
  getAllMagicLists,
  getMagicListById,
  createMagicList,
  updateMagicList,
  deleteMagicList,
  addItemToMagicList,
  updateItemInMagicList,
  deleteItemFromMagicList,
  clearCompletedMagicListItems,
} from './magic-lists.handlers';
import type {
  CreateMagicListInput,
  UpdateMagicListInput,
  CreateMagicItemInput,
  UpdateMagicItemInput,
} from './magic-lists.types';

export const magicListsController: FastifyPluginAsync = async (fastify) => {
  // Get magic lists summary for a family (registered FIRST to avoid conflict with /:familyId/magic-lists/:id)
  fastify.get<{ Params: { familyId: string } }>('/:familyId/magic-lists/summary', async (request, reply) => {
    const familyId = parseInt(request.params.familyId, 10);
    const familyLists = getAllMagicLists().filter((list) => list.familyId === familyId);
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

  // Get all magic lists
  fastify.get<{ Params: { familyId: string } }>('/:familyId/magic-lists', async (_request, reply) => {
    const lists = getAllMagicLists();
    return reply.code(200).send(lists);
  });

  // Get a specific magic list
  fastify.get<{ Params: { familyId: string; id: string } }>('/:familyId/magic-lists/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const list = getMagicListById(id);

    if (!list) {
      return reply.code(404).send({ error: 'Magic list not found' });
    }

    return reply.code(200).send(list);
  });

  // Create a new magic list
  fastify.post<{ Params: { familyId: string }; Body: CreateMagicListInput }>('/:familyId/magic-lists', async (request, reply) => {
    const newList = createMagicList(request.body);
    return reply.code(201).send(newList);
  });

  // Update a magic list
  fastify.put<{ Params: { familyId: string; id: string }; Body: UpdateMagicListInput }>(
    '/:familyId/magic-lists/:id',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const updatedList = updateMagicList(id, request.body);

      if (!updatedList) {
        return reply.code(404).send({ error: 'Magic list not found' });
      }

      return reply.code(200).send(updatedList);
    }
  );

  // Delete a magic list
  fastify.delete<{ Params: { familyId: string; id: string } }>('/:familyId/magic-lists/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const deleted = deleteMagicList(id);

    if (!deleted) {
      return reply.code(404).send({ error: 'Magic list not found' });
    }

    return reply.code(204).send();
  });

  // Clear all completed items from a magic list (registered BEFORE /:familyId/magic-lists/:id/items/:itemId)
  fastify.delete<{ Params: { familyId: string; id: string } }>(
    '/:familyId/magic-lists/:id/items/completed',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const updatedList = clearCompletedMagicListItems(id);

      if (!updatedList) {
        return reply.code(404).send({ error: 'Magic list not found' });
      }

      return reply.code(200).send(updatedList);
    }
  );

  // Add an item to a magic list
  fastify.post<{ Params: { familyId: string; id: string }; Body: CreateMagicItemInput }>(
    '/:familyId/magic-lists/:id/items',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const updatedList = addItemToMagicList(id, request.body);

      if (!updatedList) {
        return reply.code(404).send({ error: 'Magic list not found' });
      }

      return reply.code(200).send(updatedList);
    }
  );

  // Update an item in a magic list
  fastify.put<{ Params: { familyId: string; id: string; itemId: string }; Body: UpdateMagicItemInput }>(
    '/:familyId/magic-lists/:id/items/:itemId',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const itemId = parseInt(request.params.itemId, 10);
      const updatedList = updateItemInMagicList(id, itemId, request.body);

      if (!updatedList) {
        return reply.code(404).send({ error: 'Magic list or item not found' });
      }

      return reply.code(200).send(updatedList);
    }
  );

  // Delete an item from a magic list
  fastify.delete<{ Params: { familyId: string; id: string; itemId: string } }>(
    '/:familyId/magic-lists/:id/items/:itemId',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const itemId = parseInt(request.params.itemId, 10);
      const updatedList = deleteItemFromMagicList(id, itemId);

      if (!updatedList) {
        return reply.code(404).send({ error: 'Magic list or item not found' });
      }

      return reply.code(200).send(updatedList);
    }
  );
};
