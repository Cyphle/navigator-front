import { FastifyError, FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { dashboardController } from './dashboard.controller';
import { getDashboardHandler } from './dashboard.handlers';

export const dashboardPlugin = async (fastify: FastifyInstance, _: FastifyPluginOptions) => {
  fastify.log.info('Initiating dashboard plugin');

  fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    throw error;
  });

  dashboardController(getDashboardHandler)(fastify);
}
