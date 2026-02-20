import { FastifyInstance, FastifyReply } from 'fastify';
import { Database } from '../../database/database';
import { CustomFastifyRequest } from '../../fastify.types';
import { getNumberParam, getStringBodyElement, getStringQuery } from '../../helpers/fastify.helpers';
import { Recipe, RecipesPage } from './recipes.types';

export const getRecipesController =
  (handler: (database: Database) => (page: number, pageSize: number, category?: string, search?: string, minRating?: number, sort?: string) => RecipesPage) =>
    (fastify: FastifyInstance): void => {
      fastify.get('/', (request: CustomFastifyRequest, reply: FastifyReply) => {
        const pageQuery = getStringQuery(request, 'page');
        const pageSizeQuery = getStringQuery(request, 'pageSize');
        const categoryQuery = getStringQuery(request, 'category');
        const searchQuery = getStringQuery(request, 'search');
        const minRatingQuery = getStringQuery(request, 'minRating');
        const sortQuery = getStringQuery(request, 'sort');
        const page = Number.parseInt(pageQuery ?? '1', 10);
        const pageSize = Number.parseInt(pageSizeQuery ?? '6', 10);
        const minRating = minRatingQuery ? Number.parseInt(minRatingQuery, 10) : undefined;
        const recipes = handler(request.database!!)(page, pageSize, categoryQuery, searchQuery, minRating, sortQuery);

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

export const updateRecipeRatingController =
  (handler: (database: Database) => (id: number, rating: number) => Recipe | undefined) =>
    (fastify: FastifyInstance): void => {
      fastify.post('/:id/rating', (request: CustomFastifyRequest, reply: FastifyReply) => {
        const id = getNumberParam(request, 'id');
        const ratingValue = getStringBodyElement<number | string>(request, 'rating');
        const rating = typeof ratingValue === 'number'
          ? ratingValue
          : Number.parseFloat(ratingValue ?? 'NaN');
        const recipe = handler(request.database!!)(id, rating);

        reply
          .code(recipe ? 200 : 404)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send(recipe ?? {});
      });
    };
