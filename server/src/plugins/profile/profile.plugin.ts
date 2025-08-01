import { FastifyError, FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from 'fastify';
import { getProfileHandler } from './profile.handlers';
import { getProfileController } from './profile.controller';

export const profilePlugin = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    fastify.log.info('Initiating profile plugin');

    fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
        throw error
    })

    getProfileController(getProfileHandler)(fastify);
}