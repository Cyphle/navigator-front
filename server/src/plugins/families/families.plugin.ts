import { FastifyError, FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { createFamilyController, getFamiliesController, updateFamilyController } from './families.controller';
import { createFamilyHandler, getFamiliesHandler, updateFamilyHandler } from './families.handlers';

export const familiesPlugin = async (fastify: FastifyInstance, _options: FastifyPluginOptions) => {
  fastify.log.info('Initiating families plugin');

  fastify.setErrorHandler((error: FastifyError, _request: FastifyRequest, _reply: FastifyReply) => {
    throw error;
  });

  getFamiliesController(getFamiliesHandler)(fastify);
  createFamilyController(createFamilyHandler)(fastify);
  updateFamilyController(updateFamilyHandler)(fastify);
};
