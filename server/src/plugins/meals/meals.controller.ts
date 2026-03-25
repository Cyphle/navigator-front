import type { FastifyPluginAsync } from 'fastify';
import {
  getAllMealsLists,
  getMealsListById,
  createMealsList,
  updateMealsList,
  deleteMealsList,
  addRecipeToMealsList,
  removeRecipeFromMealsList,
} from './meals.handlers';
import type { CreateMealsListInput, UpdateMealsListInput } from './meals.types';

export const mealsController: FastifyPluginAsync = async (fastify) => {
  // Get planned menu summary for a family (registered FIRST to avoid conflict with /:familyId/meals/:id)
  fastify.get<{ Params: { familyId: string } }>('/:familyId/meals/summary', async (_request, reply) => {
    const summary = {
      weekLabel: 'Mar. 23',
      days: [
        { id: 1, label: 'Lun. 23', entries: [] },
        { id: 2, label: 'Mar. 24', entries: [] },
        { id: 3, label: 'Mer. 25', entries: [] },
        { id: 4, label: 'Jeu. 26', entries: [] },
        { id: 5, label: 'Ven. 27', entries: [] },
        { id: 6, label: 'Sam. 28', entries: [] },
        { id: 7, label: 'Dim. 29', entries: [] },
      ],
    };
    return reply.code(200).send(summary);
  });

  // Get all planned menu lists
  fastify.get<{ Params: { familyId: string } }>('/:familyId/meals', async (_request, reply) => {
    const lists = getAllMealsLists();
    return reply.code(200).send(lists);
  });

  // Get a specific planned menu list
  fastify.get<{ Params: { familyId: string; id: string } }>('/:familyId/meals/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const list = getMealsListById(id);

    if (!list) {
      return reply.code(404).send({ error: 'Planned menu list not found' });
    }

    return reply.code(200).send(list);
  });

  // Create a new planned menu list
  fastify.post<{ Params: { familyId: string }; Body: CreateMealsListInput }>('/:familyId/meals', async (request, reply) => {
    const newList = createMealsList(request.body);
    return reply.code(201).send(newList);
  });

  // Update a planned menu list
  fastify.put<{ Params: { familyId: string; id: string }; Body: UpdateMealsListInput }>(
    '/:familyId/meals/:id',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const updatedList = updateMealsList(id, request.body);

      if (!updatedList) {
        return reply.code(404).send({ error: 'Planned menu list not found' });
      }

      return reply.code(200).send(updatedList);
    }
  );

  // Delete a planned menu list
  fastify.delete<{ Params: { familyId: string; id: string } }>('/:familyId/meals/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const deleted = deleteMealsList(id);

    if (!deleted) {
      return reply.code(404).send({ error: 'Planned menu list not found' });
    }

    return reply.code(204).send();
  });

  // Add a recipe to a planned menu list
  fastify.post<{
    Params: { familyId: string; id: string };
    Body: { recipeId: number; recipeName: string; assignedDays?: string[] };
  }>('/:familyId/meals/:id/recipes', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const { recipeId, recipeName, assignedDays } = request.body;

    const updatedList = addRecipeToMealsList(id, recipeId, recipeName, assignedDays);

    if (!updatedList) {
      return reply.code(404).send({ error: 'Planned menu list not found' });
    }

    return reply.code(200).send(updatedList);
  });

  // Remove a recipe from a planned menu list
  fastify.delete<{ Params: { familyId: string; id: string; recipeId: string } }>(
    '/:familyId/meals/:id/recipes/:recipeId',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const recipeId = parseInt(request.params.recipeId, 10);

      const updatedList = removeRecipeFromMealsList(id, recipeId);

      if (!updatedList) {
        return reply.code(404).send({ error: 'Planned menu list not found' });
      }

      return reply.code(200).send(updatedList);
    }
  );
};
