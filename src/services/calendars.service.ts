import type {
  Calendar,
  CreateCalendarInput,
  UpdateCalendarInput,
  CreateCalendarEventInput,
  UpdateCalendarEventInput,
} from '../stores/calendars/calendars.types';
import type { DashboardAgendaItem } from '../stores/dashboard/dashboard.types.ts';
import { getOne, post, put, deleteOne } from '../helpers/http';

export const getAllCalendars = (familyId: string): Promise<Calendar[]> => {
  return getOne(`families/${encodeURIComponent(familyId)}/calendars`, (data: any) => {
    if (!Array.isArray(data)) return [];
    return data.map(responseToCalendar);
  });
};

export const getCalendarById = (familyId: string, id: number): Promise<Calendar> => {
  return getOne(`families/${encodeURIComponent(familyId)}/calendars/${id}`, responseToCalendar);
};

export const createCalendar = (familyId: string, input: CreateCalendarInput): Promise<Calendar> => {
  return post(`families/${encodeURIComponent(familyId)}/calendars`, input, responseToCalendar);
};

export const updateCalendar = (familyId: string, id: number, input: UpdateCalendarInput): Promise<Calendar> => {
  return put(`families/${encodeURIComponent(familyId)}/calendars/${id}`, input, responseToCalendar);
};

export const deleteCalendar = (familyId: string, id: number): Promise<void> => {
  return deleteOne(`families/${encodeURIComponent(familyId)}/calendars/${id}`);
};

export const addEventToCalendar = (
  familyId: string,
  calendarId: number,
  input: CreateCalendarEventInput
): Promise<Calendar> => {
  return post(`families/${encodeURIComponent(familyId)}/calendars/${calendarId}/events`, input, responseToCalendar);
};

export const updateEventInCalendar = (
  familyId: string,
  calendarId: number,
  eventId: number,
  input: UpdateCalendarEventInput
): Promise<Calendar> => {
  return put(`families/${encodeURIComponent(familyId)}/calendars/${calendarId}/events/${eventId}`, input, responseToCalendar);
};

export const deleteEventFromCalendar = (familyId: string, calendarId: number, eventId: number): Promise<Calendar> => {
  return deleteOne(`families/${encodeURIComponent(familyId)}/calendars/${calendarId}/events/${eventId}`, responseToCalendar);
};

export const getCalendarSummary = (familyId: string): Promise<DashboardAgendaItem[]> => {
  return getOne(`families/${encodeURIComponent(familyId)}/calendars/summary`, (data: any) => {
    if (!Array.isArray(data)) return [];
    return data.map((item: any): DashboardAgendaItem => ({
      id: item.id,
      title: item.title,
      time: item.time,
      person: item.person,
      calendarColor: item.calendarColor,
      visibility: item.visibility,
      attendees: item.attendees ?? [],
    }));
  });
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
