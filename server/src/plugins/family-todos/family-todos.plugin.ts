import type { FastifyPluginAsync } from 'fastify';
import { familyTodosController } from './family-todos.controller';

export const familyTodosPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(familyTodosController);
};
