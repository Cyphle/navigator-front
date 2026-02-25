import type { FastifyInstance, FastifyPluginOptions, FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { plannedMenusController } from './planned-menus.controller';

export const plannedMenusPlugin = async (fastify: FastifyInstance, _options: FastifyPluginOptions) => {
  fastify.log.info('Initiating planned menus plugin');

  fastify.setErrorHandler((error: FastifyError, _request: FastifyRequest, _reply: FastifyReply) => {
    throw error;
  });

  await fastify.register(plannedMenusController);
};
