import { FastifyInstance, FastifyReply } from 'fastify';
import { Database } from '../../database/database';
import { CustomFastifyRequest } from '../../fastify.types';
import { Dashboard } from './dashboard.types';

export const dashboardController = (handler: (database: Database) => () => Dashboard) => (fastify: FastifyInstance): void => {
  fastify.get('/', (request: CustomFastifyRequest, reply: FastifyReply) => {
    const dashboard = handler(request.database!!)();

    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(dashboard);
  });
}
