import { FastifyInstance, FastifyReply } from 'fastify';
import { Database } from '../../database/database';
import { CustomFastifyRequest } from '../../fastify.types';
import { getNumberParam, getStringQuery } from '../../helpers/fastify.helpers';
import { RecipesPage } from './recipes.types';

export const getRecipesController =
  (handler: (database: Database) => (page: number, pageSize: number, category?: string, search?: string) => RecipesPage) =>
    (fastify: FastifyInstance): void => {
      fastify.get('/', (request: CustomFastifyRequest, reply: FastifyReply) => {
        const pageQuery = getStringQuery(request, 'page');
        const pageSizeQuery = getStringQuery(request, 'pageSize');
        const categoryQuery = getStringQuery(request, 'category');
        const searchQuery = getStringQuery(request, 'search');
        const page = Number.parseInt(pageQuery ?? '1', 10);
        const pageSize = Number.parseInt(pageSizeQuery ?? '6', 10);
        const recipes = handler(request.database!!)(page, pageSize, categoryQuery, searchQuery);

        reply
          .code(200)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send(recipes);
      });
    };

export const deleteRecipeController =
  (handler: (database: Database) => (id: number) => boolean) =>
    (fastify: FastifyInstance): void => {
      fastify.post('/:id/delete', (request: CustomFastifyRequest, reply: FastifyReply) => {
        const id = getNumberParam(request, 'id');
        const success = handler(request.database!!)(id);

        reply
          .code(success ? 200 : 404)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send({ success });
      });
    };
