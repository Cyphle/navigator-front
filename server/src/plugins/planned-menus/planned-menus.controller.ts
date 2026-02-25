import type { FastifyPluginAsync } from 'fastify';
import {
  getAllPlannedMenuLists,
  getPlannedMenuListById,
  createPlannedMenuList,
  updatePlannedMenuList,
  deletePlannedMenuList,
  addRecipeToPlannedMenuList,
  removeRecipeFromPlannedMenuList,
} from './planned-menus.handlers';
import type { CreatePlannedMenuListInput, UpdatePlannedMenuListInput } from './planned-menus.types';

export const plannedMenusController: FastifyPluginAsync = async (fastify) => {
  // Get all planned menu lists
  fastify.get('/planned-menus', async (_request, reply) => {
    const lists = getAllPlannedMenuLists();
    return reply.code(200).send(lists);
  });

  // Get a specific planned menu list
  fastify.get<{ Params: { id: string } }>('/planned-menus/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const list = getPlannedMenuListById(id);

    if (!list) {
      return reply.code(404).send({ error: 'Planned menu list not found' });
    }

    return reply.code(200).send(list);
  });

  // Create a new planned menu list
  fastify.post<{ Body: CreatePlannedMenuListInput }>('/planned-menus', async (request, reply) => {
    const newList = createPlannedMenuList(request.body);
    return reply.code(201).send(newList);
  });

  // Update a planned menu list
  fastify.put<{ Params: { id: string }; Body: UpdatePlannedMenuListInput }>(
    '/planned-menus/:id',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const updatedList = updatePlannedMenuList(id, request.body);

      if (!updatedList) {
        return reply.code(404).send({ error: 'Planned menu list not found' });
      }

      return reply.code(200).send(updatedList);
    }
  );

  // Delete a planned menu list
  fastify.delete<{ Params: { id: string } }>('/planned-menus/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const deleted = deletePlannedMenuList(id);

    if (!deleted) {
      return reply.code(404).send({ error: 'Planned menu list not found' });
    }

    return reply.code(204).send();
  });

  // Add a recipe to a planned menu list
  fastify.post<{
    Params: { id: string };
    Body: { recipeId: number; recipeName: string; assignedDays?: string[] };
  }>('/planned-menus/:id/recipes', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const { recipeId, recipeName, assignedDays } = request.body;

    const updatedList = addRecipeToPlannedMenuList(id, recipeId, recipeName, assignedDays);

    if (!updatedList) {
      return reply.code(404).send({ error: 'Planned menu list not found' });
    }

    return reply.code(200).send(updatedList);
  });

  // Remove a recipe from a planned menu list
  fastify.delete<{ Params: { id: string; recipeId: string } }>(
    '/planned-menus/:id/recipes/:recipeId',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const recipeId = parseInt(request.params.recipeId, 10);

      const updatedList = removeRecipeFromPlannedMenuList(id, recipeId);

      if (!updatedList) {
        return reply.code(404).send({ error: 'Planned menu list not found' });
      }

      return reply.code(200).send(updatedList);
    }
  );
};
