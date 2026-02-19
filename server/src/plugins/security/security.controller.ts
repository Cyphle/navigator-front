import { Database } from '../../database/database';
import { FastifyInstance, FastifyReply } from 'fastify';
import { CustomFastifyRequest } from '../../fastify.types';
import { getStringBodyElement } from '../../helpers/fastify.helpers';
import { RegisterRequest } from './security.types';

export const registerController = (handler: (database: Database) => (request: RegisterRequest) => void) => (fastify: FastifyInstance): void => {
  fastify.post('/register', (request: CustomFastifyRequest, reply: FastifyReply) => {
    const command: RegisterRequest = {
      username: getStringBodyElement<string>(request, 'username'),
      email: getStringBodyElement<string>(request, 'email'),
      firstName: getStringBodyElement<string>(request, 'first_name'),
      lastName: getStringBodyElement<string>(request, 'last_name'),
    }

    handler(request.database!!)(command);

    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send();
  });
}
