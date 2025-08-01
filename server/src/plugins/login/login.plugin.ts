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

  loginController(loginHandler)(fastify);
}