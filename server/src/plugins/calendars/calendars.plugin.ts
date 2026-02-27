import type { FastifyPluginAsync } from 'fastify';
import { calendarsController } from './calendars.controller';

export const calendarsPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(calendarsController);
};
