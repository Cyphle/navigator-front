import { FastifyInstance, FastifyReply } from 'fastify';
import { Database } from '../../database/database';
import { CustomFastifyRequest } from '../../fastify.types';
import { Dashboard } from './dashboard.types';

export const dashboardController = (handler: (database: Database) => (familyId: string) => Dashboard) => (fastify: FastifyInstance): void => {
  fastify.get('/:familyId', (request: CustomFastifyRequest, reply: FastifyReply) => {
    const familyId = (request.params as { familyId: string }).familyId;
    const dashboard = handler(request.database!!)(familyId);

    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(dashboard);
  });
}
