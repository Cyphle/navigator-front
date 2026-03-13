import type {
  Calendar,
  CreateCalendarInput,
  UpdateCalendarInput,
  CreateCalendarEventInput,
  UpdateCalendarEventInput,
} from '../stores/calendars/calendars.types';
import { getOne, post, put, deleteOne } from '../helpers/http';

const withFamily = (path: string, familyId: string) =>
  `${path}${path.includes('?') ? '&' : '?'}familyId=${encodeURIComponent(familyId)}`;

export const getAllCalendars = (familyId: string): Promise<Calendar[]> => {
  return getOne(withFamily('calendars', familyId), (data: any) => {
    if (!Array.isArray(data)) return [];
    return data.map(responseToCalendar);
  });
};

export const getCalendarById = (familyId: string, id: number): Promise<Calendar> => {
  return getOne(withFamily(`calendars/${id}`, familyId), responseToCalendar);
};

export const createCalendar = (familyId: string, input: CreateCalendarInput): Promise<Calendar> => {
  return post(withFamily('calendars', familyId), input, responseToCalendar);
};

export const updateCalendar = (familyId: string, id: number, input: UpdateCalendarInput): Promise<Calendar> => {
  return put(withFamily(`calendars/${id}`, familyId), input, responseToCalendar);
};

export const deleteCalendar = (familyId: string, id: number): Promise<void> => {
  return deleteOne(withFamily(`calendars/${id}`, familyId));
};

export const addEventToCalendar = (
  familyId: string,
  calendarId: number,
  input: CreateCalendarEventInput
): Promise<Calendar> => {
  return post(withFamily(`calendars/${calendarId}/events`, familyId), input, responseToCalendar);
};

export const updateEventInCalendar = (
  familyId: string,
  calendarId: number,
  eventId: number,
  input: UpdateCalendarEventInput
): Promise<Calendar> => {
  return put(withFamily(`calendars/${calendarId}/events/${eventId}`, familyId), input, responseToCalendar);
};

export const deleteEventFromCalendar = (familyId: string, calendarId: number, eventId: number): Promise<Calendar> => {
  return deleteOne(withFamily(`calendars/${calendarId}/events/${eventId}`, familyId), responseToCalendar);
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
