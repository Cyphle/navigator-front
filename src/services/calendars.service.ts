import type {
  Calendar,
  CreateCalendarInput,
  UpdateCalendarInput,
  CreateCalendarEventInput,
  UpdateCalendarEventInput,
} from '../stores/calendars/calendars.types';
import { getOne, post, put, deleteOne } from '../helpers/http';

export const getAllCalendars = (): Promise<Calendar[]> => {
  return getOne('calendars', (data: any) => {
    if (!Array.isArray(data)) return [];
    return data.map(responseToCalendar);
  });
};

export const getCalendarById = (id: number): Promise<Calendar> => {
  return getOne(`calendars/${id}`, responseToCalendar);
};

export const createCalendar = (input: CreateCalendarInput): Promise<Calendar> => {
  return post('calendars', input, responseToCalendar);
};

export const updateCalendar = (id: number, input: UpdateCalendarInput): Promise<Calendar> => {
  return put(`calendars/${id}`, input, responseToCalendar);
};

export const deleteCalendar = (id: number): Promise<void> => {
  return deleteOne(`calendars/${id}`);
};

export const addEventToCalendar = (
  calendarId: number,
  input: CreateCalendarEventInput
): Promise<Calendar> => {
  return post(`calendars/${calendarId}/events`, input, responseToCalendar);
};

export const updateEventInCalendar = (
  calendarId: number,
  eventId: number,
  input: UpdateCalendarEventInput
): Promise<Calendar> => {
  return put(`calendars/${calendarId}/events/${eventId}`, input, responseToCalendar);
};

export const deleteEventFromCalendar = (calendarId: number, eventId: number): Promise<Calendar> => {
  return deleteOne(`calendars/${calendarId}/events/${eventId}`, responseToCalendar);
};

const responseToCalendar = (data: any): Calendar => ({
  id: data?.id ?? 0,
  name: data?.name ?? '',
  color: data?.color ?? '#1890ff',
  type: data?.type ?? 'PERSONAL',
  familyId: data?.familyId,
  events: Array.isArray(data?.events)
    ? data.events.map((event: any) => ({
        id: event?.id ?? 0,
        calendarId: event?.calendarId ?? 0,
        title: event?.title ?? '',
        description: event?.description,
        invites: event?.invites,
        date: event?.date ?? '',
        time: event?.time ?? '',
        duration: event?.duration ?? 60,
        recurrence: event?.recurrence ?? 'NONE',
        createdAt: event?.createdAt ?? '',
        updatedAt: event?.updatedAt ?? '',
      }))
    : [],
  createdAt: data?.createdAt ?? '',
  updatedAt: data?.updatedAt ?? '',
});
