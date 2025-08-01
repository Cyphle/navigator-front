import { FastifyError, FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { createAccountController, getAccountByIdController, listAccountsController } from './account.controller';
import { createAccountHandler, getAccountByIdHandler, getAccountsHandler } from './account.handlers';

export const accountPlugin = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
  fastify.log.info('Initiating account plugin');

  fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    throw error
  })

  listAccountsController(getAccountsHandler)(fastify);
  getAccountByIdController(getAccountByIdHandler)(fastify);
  createAccountController(createAccountHandler)(fastify);
}