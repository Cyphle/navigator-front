import type {
  Calendar,
  CalendarEvent,
  CreateCalendarInput,
  UpdateCalendarInput,
  CreateCalendarEventInput,
  UpdateCalendarEventInput,
} from './calendars.types';

// Initialize with mock data
let calendars: Calendar[] = [
  {
    id: 1,
    name: 'Personnel',
    color: '#1890ff',
    type: 'PERSONAL',
    events: [
      {
        id: 1,
        calendarId: 1,
        title: 'Rendez-vous chez le dentiste',
        description: 'Contrôle annuel',
        date: '2026-03-05',
        time: '10:00',
        duration: 60,
        recurrence: 'NONE',
        createdAt: new Date('2026-02-20').toISOString(),
        updatedAt: new Date('2026-02-20').toISOString(),
      },
      {
        id: 2,
        calendarId: 1,
        title: 'Gym',
        date: '2026-02-27',
        time: '18:00',
        duration: 90,
        recurrence: 'WEEKLY',
        createdAt: new Date('2026-02-15').toISOString(),
        updatedAt: new Date('2026-02-15').toISOString(),
      },
    ],
    createdAt: new Date('2026-02-15').toISOString(),
    updatedAt: new Date('2026-02-20').toISOString(),
  },
  {
    id: 2,
    name: 'Famille Martin',
    color: '#52c41a',
    type: 'SHARED',
    familyId: 1,
    events: [
      {
        id: 3,
        calendarId: 2,
        title: 'Réunion parents-professeurs',
        description: 'École primaire',
        invites: ['marie.martin@example.com', 'paul.martin@example.com'],
        date: '2026-03-10',
        time: '17:30',
        duration: 45,
        recurrence: 'NONE',
        createdAt: new Date('2026-02-20').toISOString(),
        updatedAt: new Date('2026-02-20').toISOString(),
      },
      {
        id: 4,
        calendarId: 2,
        title: 'Dîner en famille',
        description: 'Chez grand-mère',
        invites: ['marie.martin@example.com', 'paul.martin@example.com'],
        date: '2026-02-28',
        time: '19:00',
        duration: 180,
        recurrence: 'MONTHLY',
        createdAt: new Date('2026-02-15').toISOString(),
        updatedAt: new Date('2026-02-15').toISOString(),
      },
    ],
    createdAt: new Date('2026-02-15').toISOString(),
    updatedAt: new Date('2026-02-20').toISOString(),
  },
];
let nextCalendarId = 3;
let nextEventId = 5;

export const getAllCalendars = (): Calendar[] => {
  return calendars;
};

export const getCalendarById = (id: number): Calendar | undefined => {
  return calendars.find((calendar) => calendar.id === id);
};

export const createCalendar = (input: CreateCalendarInput): Calendar => {
  const now = new Date().toISOString();
  const newCalendar: Calendar = {
    id: nextCalendarId++,
    name: input.name,
    color: input.color,
    type: input.type,
    familyId: input.familyId,
    events: [],
    createdAt: now,
    updatedAt: now,
  };
  calendars.push(newCalendar);
  return newCalendar;
};

export const updateCalendar = (id: number, input: UpdateCalendarInput): Calendar | undefined => {
  const calendarIndex = calendars.findIndex((calendar) => calendar.id === id);
  if (calendarIndex === -1) {
    return undefined;
  }

  const updatedCalendar: Calendar = {
    ...calendars[calendarIndex],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  calendars[calendarIndex] = updatedCalendar;
  return updatedCalendar;
};

export const deleteCalendar = (id: number): boolean => {
  const initialLength = calendars.length;
  calendars = calendars.filter((calendar) => calendar.id !== id);
  return calendars.length < initialLength;
};

export const addEventToCalendar = (
  calendarId: number,
  input: CreateCalendarEventInput
): Calendar | undefined => {
  const calendar = calendars.find((c) => c.id === calendarId);
  if (!calendar) {
    return undefined;
  }

  const now = new Date().toISOString();
  const newEvent: CalendarEvent = {
    id: nextEventId++,
    calendarId,
    title: input.title,
    description: input.description,
    invites: input.invites,
    date: input.date,
    time: input.time,
    duration: input.duration,
    recurrence: input.recurrence || 'NONE',
    createdAt: now,
    updatedAt: now,
  };

  calendar.events.push(newEvent);
  calendar.updatedAt = new Date().toISOString();
  return calendar;
};

export const updateEventInCalendar = (
  calendarId: number,
  eventId: number,
  input: UpdateCalendarEventInput
): Calendar | undefined => {
  const calendar = calendars.find((c) => c.id === calendarId);
  if (!calendar) {
    return undefined;
  }

  const eventIndex = calendar.events.findIndex((event) => event.id === eventId);
  if (eventIndex === -1) {
    return undefined;
  }

  calendar.events[eventIndex] = {
    ...calendar.events[eventIndex],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  calendar.updatedAt = new Date().toISOString();
  return calendar;
};

export const deleteEventFromCalendar = (calendarId: number, eventId: number): Calendar | undefined => {
  const calendar = calendars.find((c) => c.id === calendarId);
  if (!calendar) {
    return undefined;
  }

  calendar.events = calendar.events.filter((event) => event.id !== eventId);
  calendar.updatedAt = new Date().toISOString();
  return calendar;
};
