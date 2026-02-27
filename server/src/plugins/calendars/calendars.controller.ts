import type { FastifyPluginAsync } from 'fastify';
import {
  getAllCalendars,
  getCalendarById,
  createCalendar,
  updateCalendar,
  deleteCalendar,
  addEventToCalendar,
  updateEventInCalendar,
  deleteEventFromCalendar,
} from './calendars.handlers';
import type {
  CreateCalendarInput,
  UpdateCalendarInput,
  CreateCalendarEventInput,
  UpdateCalendarEventInput,
} from './calendars.types';

export const calendarsController: FastifyPluginAsync = async (fastify) => {
  // Get all calendars
  fastify.get('/calendars', async (_request, reply) => {
    const calendars = getAllCalendars();
    return reply.code(200).send(calendars);
  });

  // Get a specific calendar
  fastify.get<{ Params: { id: string } }>('/calendars/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const calendar = getCalendarById(id);

    if (!calendar) {
      return reply.code(404).send({ error: 'Calendar not found' });
    }

    return reply.code(200).send(calendar);
  });

  // Create a new calendar
  fastify.post<{ Body: CreateCalendarInput }>('/calendars', async (request, reply) => {
    const newCalendar = createCalendar(request.body);
    return reply.code(201).send(newCalendar);
  });

  // Update a calendar
  fastify.put<{ Params: { id: string }; Body: UpdateCalendarInput }>(
    '/calendars/:id',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const updatedCalendar = updateCalendar(id, request.body);

      if (!updatedCalendar) {
        return reply.code(404).send({ error: 'Calendar not found' });
      }

      return reply.code(200).send(updatedCalendar);
    }
  );

  // Delete a calendar
  fastify.delete<{ Params: { id: string } }>('/calendars/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const deleted = deleteCalendar(id);

    if (!deleted) {
      return reply.code(404).send({ error: 'Calendar not found' });
    }

    return reply.code(204).send();
  });

  // Add an event to a calendar
  fastify.post<{ Params: { id: string }; Body: CreateCalendarEventInput }>(
    '/calendars/:id/events',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const updatedCalendar = addEventToCalendar(id, request.body);

      if (!updatedCalendar) {
        return reply.code(404).send({ error: 'Calendar not found' });
      }

      return reply.code(200).send(updatedCalendar);
    }
  );

  // Update an event in a calendar
  fastify.put<{ Params: { id: string; eventId: string }; Body: UpdateCalendarEventInput }>(
    '/calendars/:id/events/:eventId',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const eventId = parseInt(request.params.eventId, 10);
      const updatedCalendar = updateEventInCalendar(id, eventId, request.body);

      if (!updatedCalendar) {
        return reply.code(404).send({ error: 'Calendar or event not found' });
      }

      return reply.code(200).send(updatedCalendar);
    }
  );

  // Delete an event from a calendar
  fastify.delete<{ Params: { id: string; eventId: string } }>(
    '/calendars/:id/events/:eventId',
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const eventId = parseInt(request.params.eventId, 10);
      const updatedCalendar = deleteEventFromCalendar(id, eventId);

      if (!updatedCalendar) {
        return reply.code(404).send({ error: 'Calendar or event not found' });
      }

      return reply.code(200).send(updatedCalendar);
    }
  );
};
