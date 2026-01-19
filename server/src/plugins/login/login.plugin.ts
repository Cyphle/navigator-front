import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { loginController } from './login.controller';
import { loginHandler } from './login.handler';

interface SetUsernameRequest {
  Body: {
    username: string;
  };
}

export const loginPlugin = async (fastify: FastifyInstance, _: FastifyPluginOptions) => {
  fastify.log.info('Initiating fake login plugin');

  fastify.get('/', async (request, reply) => {
    const query = request.query as { redirectTo?: string };
    const redirectTo = query.redirectTo ?? request.headers.referer ?? '/';

    return reply.view('login.ejs', {
      title: 'Connexion',
      actionUrl: '/login',
      redirectTo,
    });
  });

  loginController(loginHandler)(fastify);
}
