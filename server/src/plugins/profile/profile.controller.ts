import {FastifyInstance, FastifyReply} from 'fastify';
import {Database} from '../../database/database';
import {CustomFastifyRequest} from '../../fastify.types';
import {Profile} from './profile.types';

export const getProfileController = (handler: (database: Database) => Profile) => (fastify: FastifyInstance): void => {
  fastify.get('/', (request: CustomFastifyRequest, reply: FastifyReply) => {
    const profile = handler(request.database!!);
    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send({ profile });
  });
}
