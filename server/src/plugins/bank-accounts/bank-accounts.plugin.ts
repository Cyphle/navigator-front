import type { FastifyPluginAsync } from 'fastify';
import { bankAccountsController } from './bank-accounts.controller';

export const bankAccountsPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(bankAccountsController);
};
