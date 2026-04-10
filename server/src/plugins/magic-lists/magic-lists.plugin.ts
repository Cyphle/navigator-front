import type { FastifyPluginAsync } from 'fastify';
import { magicListsController } from './magic-lists.controller';

export const magicListsPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(magicListsController);
};
