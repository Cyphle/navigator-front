import { FastifyInstance, FastifyReply } from 'fastify';
import { Database } from '../../database/database';
import { CustomFastifyRequest } from '../../fastify.types';
import { getNumberParam, getStringBodyElement } from '../../helpers/fastify.helpers';
import { Profile } from '../profile/profile.types';
import { AccountView, CreateAccountRequest } from './account.types';

export const listAccountsController = (handler: (database: Database) => (profile: Profile) => AccountView[]) => (fastify: FastifyInstance): void => {
  fastify.get('/', (request: CustomFastifyRequest, reply: FastifyReply) => {
    const connectedProfile = request.session.get('user');
    
    fastify.log.info(`Getting accounts for connected user ${connectedProfile.username}`);
    
    const accounts = handler(request.database!)(connectedProfile);

    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(accounts);
  })
}

export const getAccountByIdController = (handler: (database: Database) => (id: number, profile: Profile) => AccountView | undefined) => (fastify: FastifyInstance): void => {
  fastify.get('/:id', (request: CustomFastifyRequest, reply: FastifyReply) => {
    const connectedProfile = request.session.get('user');
    const accountId = getNumberParam(request, 'id');

    fastify.log.info(`Getting account ${accountId} for connected user ${connectedProfile.username}`);

    const account = handler(request.database!!)(accountId, connectedProfile);

    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(account);
  })
}

export const createAccountController = (handler: (database: Database) => (command: CreateAccountRequest) => AccountView) => (fastify: FastifyInstance) => {
  fastify.post('/', (request: CustomFastifyRequest, reply: FastifyReply) => {
    const command: CreateAccountRequest = {
      username: request.session.get('user'),
      name: getStringBodyElement<string>(request, 'name'),
      type: getStringBodyElement<string>(request, 'type'),
      startingBalance: getStringBodyElement<number>(request, 'startingBalance'),
      currentBalance: getStringBodyElement<number>(request, 'currentBalance'),
      projectedBalance: getStringBodyElement<number>(request, 'projectedBalance'),
    }
    
    const account = handler(request.database!!)(command);

    reply.code(200).send(account);
  });
}
