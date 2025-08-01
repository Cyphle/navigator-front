import { FastifyError, FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { registerController } from './security.controller';
import { registerHandler } from './security.handlers';

export const securityPlugin = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  fastify.log.info('Initiating security plugin');

  fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    throw error
  })

  registerController(registerHandler)(fastify);
}