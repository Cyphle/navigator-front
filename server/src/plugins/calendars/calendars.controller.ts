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
  // Get agenda summary for a family (registered FIRST to avoid conflict with /:familyId/calendars/:id)
  fastify.get<{ Params: { familyId: string } }>('/:familyId/calendars/summary', async (request, reply) => {
    const familyId = parseInt(request.params.familyId, 10);
    const familyCalendars = getAllCalendars().filter((c) => c.familyId === familyId || c.type === 'PERSONAL');
    const summary = familyCalendars.flatMap((calendar) =>
      calendar.events.map((event) => ({
        id: event.id,
        title: event.title,
        time: event.time,
        person: calendar.name,
        accentColor: calendar.color,
        visibility: calendar.type === 'SHARED' ? 'FAMILY' : 'PERSONAL',
        attendees: event.invites ?? [],
      }))
    );
    return reply.code(200).send(summary);
  });

  // Get all calendars
  fastify.get<{ Params: { familyId: string } }>('/:familyId/calendars', async (_request, reply) => {
    const calendars = getAllCalendars();
    return reply.code(200).send(calendars);
  });

  // Get a specific calendar
  fastify.get<{ Params: { familyId: string; id: string } }>('/:familyId/calendars/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const calendar = getCalendarById(id);

    if (!calendar) {
      return reply.code(404).send({ error: 'Calendar not found' });
    }

    return reply.code(200).send(calendar);
  });

  // Create a new calendar
  fastify.post<{ Params: { familyId: string }; Body: CreateCalendarInput }>('/:familyId/calendars', async (request, reply) => {
    const newCalendar = createCalendar(request.body);
    return reply.code(201).send(newCalendar);
  });

  // Update a calendar
  fastify.put<{ Params: { familyId: string; id: string }; Body: UpdateCalendarInput }>(
    '/:familyId/calendars/:id',
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
  fastify.delete<{ Params: { familyId: string; id: string } }>('/:familyId/calendars/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    const deleted = deleteCalendar(id);

    if (!deleted) {
      return reply.code(404).send({ error: 'Calendar not found' });
    }

    return reply.code(204).send();
  });

  // Add an event to a calendar
  fastify.post<{ Params: { familyId: string; id: string }; Body: CreateCalendarEventInput }>(
    '/:familyId/calendars/:id/events',
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
  fastify.put<{ Params: { familyId: string; id: string; eventId: string }; Body: UpdateCalendarEventInput }>(
    '/:familyId/calendars/:id/events/:eventId',
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
  fastify.delete<{ Params: { familyId: string; id: string; eventId: string } }>(
    '/:familyId/calendars/:id/events/:eventId',
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
