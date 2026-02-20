import { FastifyError, FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { deleteRecipeController, getRecipesController, updateRecipeRatingController } from './recipes.controller';
import { deleteRecipeHandler, getRecipesHandler, updateRecipeRatingHandler } from './recipes.handlers';

export const recipesPlugin = async (fastify: FastifyInstance, _options: FastifyPluginOptions) => {
  fastify.log.info('Initiating recipes plugin');

  fastify.setErrorHandler((error: FastifyError, _request: FastifyRequest, _reply: FastifyReply) => {
    throw error;
  });

  getRecipesController(getRecipesHandler)(fastify);
  deleteRecipeController(deleteRecipeHandler)(fastify);
  updateRecipeRatingController(updateRecipeRatingHandler)(fastify);
};
