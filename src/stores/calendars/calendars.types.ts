export type CalendarType = 'SHARED' | 'PERSONAL';
export type RecurrenceType = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

export interface CalendarEvent {
  id: number;
  calendarId: number;
  title: string;
  description?: string;
  invites?: string[];
  date: string;
  time: string;
  duration: number; // in minutes
  recurrence: RecurrenceType;
  createdAt: string;
  updatedAt: string;
}

export interface Calendar {
  id: number;
  name: string;
  color: string;
  type: CalendarType;
  familyId?: number;
  events: CalendarEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCalendarInput {
  name: string;
  color: string;
  type: CalendarType;
  familyId?: number;
}

export interface UpdateCalendarInput {
  name?: string;
  color?: string;
}

export interface CreateCalendarEventInput {
  title: string;
  description?: string;
  invites?: string[];
  date: string;
  time: string;
  duration: number;
  recurrence?: RecurrenceType;
}

export interface UpdateCalendarEventInput {
  title?: string;
  description?: string;
  invites?: string[];
  date?: string;
  time?: string;
  duration?: number;
  recurrence?: RecurrenceType;
}
