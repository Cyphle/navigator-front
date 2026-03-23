import { FastifyError, FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { deleteRecipeController, getRecipesController, updateRecipeRatingController } from './recipes.controller';
import { deleteRecipeHandler, getRecipesHandler, updateRecipeRatingHandler } from './recipes.handlers';
import { CustomFastifyRequest } from '../../fastify.types';
import { Recipe } from './recipes.types';

export const recipesPlugin = async (fastify: FastifyInstance, _options: FastifyPluginOptions) => {
  fastify.log.info('Initiating recipes plugin');

  fastify.setErrorHandler((error: FastifyError, _request: FastifyRequest, _reply: FastifyReply) => {
    throw error;
  });

  getRecipesController(getRecipesHandler)(fastify);
  deleteRecipeController(deleteRecipeHandler)(fastify);
  updateRecipeRatingController(updateRecipeRatingHandler)(fastify);

  // Get recipes summary (favorite and selected-for-week recipes)
  fastify.get('/:familyId/recipes/summary', (request: CustomFastifyRequest, reply: FastifyReply) => {
    const recipes = request.database!!.read<Recipe>('recipes');
    const summary = recipes.slice(0, 5).map((recipe) => ({
      id: recipe.id,
      name: recipe.name,
      favorite: (recipe.rating ?? 0) >= 4,
      selectedForWeek: (recipe.rating ?? 0) >= 5,
      visibility: 'FAMILY',
    }));
    reply.code(200).header('Content-Type', 'application/json; charset=utf-8').send(summary);
  });
};
