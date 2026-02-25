import type { FastifyInstance, FastifyPluginOptions, FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { shoppingListsController } from './shopping-lists.controller';

export const shoppingListsPlugin = async (fastify: FastifyInstance, _options: FastifyPluginOptions) => {
  fastify.log.info('Initiating shopping lists plugin');

  fastify.setErrorHandler((error: FastifyError, _request: FastifyRequest, _reply: FastifyReply) => {
    throw error;
  });

  await fastify.register(shoppingListsController);
};
