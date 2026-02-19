import { FastifyInstance, FastifyReply } from 'fastify';
import { Database } from '../../database/database';
import { CustomFastifyRequest } from '../../fastify.types';
import { getNumberParam, getStringBodyElement } from '../../helpers/fastify.helpers';
import { Family, FamilyUpsertRequest } from './families.types';

export const getFamiliesController = (handler: (database: Database) => Family[]) => (fastify: FastifyInstance): void => {
  fastify.get('/', (request: CustomFastifyRequest, reply: FastifyReply) => {
    const families = handler(request.database!!);
    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(families);
  });
};

export const createFamilyController = (handler: (database: Database) => (request: FamilyUpsertRequest) => Family) => (fastify: FastifyInstance): void => {
  fastify.post('/', (request: CustomFastifyRequest, reply: FastifyReply) => {
    const command: FamilyUpsertRequest = {
      name: getStringBodyElement<string>(request, 'name'),
      ownerEmail: getStringBodyElement<string>(request, 'ownerEmail'),
      ownerName: getStringBodyElement<string>(request, 'ownerName'),
      memberEmails: getStringBodyElement<string[]>(request, 'memberEmails') ?? [],
      status: getStringBodyElement<'ACTIVE' | 'INACTIVE' | undefined>(request, 'status')
    };

    const family = handler(request.database!!)(command);

    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(family);
  });
};

export const updateFamilyController = (handler: (database: Database) => (id: number, request: FamilyUpsertRequest) => Family | undefined) => (fastify: FastifyInstance): void => {
  fastify.post('/:id', (request: CustomFastifyRequest, reply: FastifyReply) => {
    const id = getNumberParam(request, 'id');
    const command: FamilyUpsertRequest = {
      name: getStringBodyElement<string>(request, 'name'),
      ownerEmail: getStringBodyElement<string>(request, 'ownerEmail'),
      ownerName: getStringBodyElement<string>(request, 'ownerName'),
      memberEmails: getStringBodyElement<string[]>(request, 'memberEmails') ?? [],
      status: getStringBodyElement<'ACTIVE' | 'INACTIVE' | undefined>(request, 'status')
    };

    const family = handler(request.database!!)(id, command);

    reply
      .code(family ? 200 : 404)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(family ?? {});
  });
};
