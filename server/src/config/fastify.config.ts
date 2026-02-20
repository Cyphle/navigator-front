import fastify, { FastifyInstance, FastifyPluginOptions } from 'fastify';
import cors from '@fastify/cors'
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/secure-session';
import fastifyView from '@fastify/view';
import fastifyFormbody from '@fastify/formbody';
import ejs from 'ejs';
import path from 'path';

export const initFastify = (
  decorators: ((fastify: FastifyInstance) => void)[] = [],
  plugins: { plugin: (fastify: FastifyInstance, options: FastifyPluginOptions) => void, routesPrefix: string }[],
): FastifyInstance => {
  const server = fastify({
    logger: true
  });

  server.register(cors, {
    origin: true,
    credentials: true
  });
  server.register(fastifyCookie, {});
  server.register(fastifyFormbody);
  // @ts-ignore
  server.register(fastifySession, {
    secret: 'a-very-secure-secret-keythatisverylonglonglong', // TODO Use a proper secret key in production
    cookie: {
      path: '/',
      httpOnly: true,
      secure: false,  // TODO In production, set to true for HTTPS
    },
  });
  server.register(fastifyView, {
    engine: { ejs },
    root: path.join(process.cwd(), '..', 'src', 'views'),
  });

  decorators.forEach(decorator => decorator(server));

  plugins.forEach(plugin => {
    server.register(
      plugin.plugin,
      {
        prefix: plugin.routesPrefix
      }
    );
  });

  return server;
}
