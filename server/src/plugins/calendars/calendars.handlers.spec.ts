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

describe('calendars handlers', () => {
  test('should create calendar', () => {
    const input = {
      name: 'Mon calendrier',
      color: '#1890ff',
      type: 'PERSONAL' as const,
    };

    const created = createCalendar(input);

    expect(created.id).toBeGreaterThan(0);
    expect(created.name).toBe('Mon calendrier');
    expect(created.color).toBe('#1890ff');
    expect(created.type).toBe('PERSONAL');
    expect(created.events).toEqual([]);
  });

  test('should get all calendars', () => {
    const calendar1 = createCalendar({ name: 'Calendrier 1', color: '#1890ff', type: 'PERSONAL' });
    const calendar2 = createCalendar({ name: 'Calendrier 2', color: '#52c41a', type: 'SHARED', familyId: 5 });

    const calendars = getAllCalendars();

    expect(calendars.length).toBeGreaterThanOrEqual(2);
    expect(calendars.some((c) => c.name === 'Calendrier 1')).toBe(true);
    expect(calendars.some((c) => c.name === 'Calendrier 2')).toBe(true);
  });

  test('should get calendar by id', () => {
    const created = createCalendar({ name: 'Test', color: '#1890ff', type: 'PERSONAL' });

    const found = getCalendarById(created.id);

    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
    expect(found?.name).toBe('Test');
  });

  test('should return undefined for non-existent id', () => {
    const found = getCalendarById(99999);

    expect(found).toBeUndefined();
  });

  test('should update calendar', () => {
    const created = createCalendar({ name: 'Original', color: '#1890ff', type: 'PERSONAL' });

    const updated = updateCalendar(created.id, { name: 'Updated' });

    expect(updated).toBeDefined();
    expect(updated?.name).toBe('Updated');
  });

  test('should delete calendar', () => {
    const created = createCalendar({ name: 'To Delete', color: '#1890ff', type: 'PERSONAL' });

    const deleted = deleteCalendar(created.id);

    expect(deleted).toBe(true);
    expect(getCalendarById(created.id)).toBeUndefined();
  });

  test('should add event to calendar', () => {
    const calendar = createCalendar({ name: 'Mon calendrier', color: '#1890ff', type: 'PERSONAL' });

    const updated = addEventToCalendar(calendar.id, {
      title: 'Réunion',
      description: 'Avec le client',
      date: '2026-03-01',
      time: '10:00',
      duration: 60,
      recurrence: 'NONE',
    });

    expect(updated).toBeDefined();
    expect(updated?.events).toHaveLength(1);
    expect(updated?.events[0].title).toBe('Réunion');
    expect(updated?.events[0].description).toBe('Avec le client');
  });

  test('should update event in calendar', () => {
    const calendar = createCalendar({ name: 'Mon calendrier', color: '#1890ff', type: 'PERSONAL' });
    const updatedCalendar = addEventToCalendar(calendar.id, {
      title: 'Réunion',
      date: '2026-03-01',
      time: '10:00',
      duration: 60,
    });

    const eventId = updatedCalendar?.events[0].id;
    expect(eventId).toBeDefined();

    const updated = updateEventInCalendar(calendar.id, eventId!, {
      title: 'Réunion mise à jour',
    });

    expect(updated).toBeDefined();
    expect(updated?.events[0].title).toBe('Réunion mise à jour');
  });

  test('should delete event from calendar', () => {
    const calendar = createCalendar({ name: 'Mon calendrier', color: '#1890ff', type: 'PERSONAL' });
    const updatedCalendar = addEventToCalendar(calendar.id, {
      title: 'Réunion',
      date: '2026-03-01',
      time: '10:00',
      duration: 60,
    });

    const eventId = updatedCalendar?.events[0].id;
    expect(eventId).toBeDefined();

    const updated = deleteEventFromCalendar(calendar.id, eventId!);

    expect(updated).toBeDefined();
    expect(updated?.events).toHaveLength(0);
  });

  test('should return undefined when adding event to non-existent calendar', () => {
    const result = addEventToCalendar(99999, {
      title: 'Test',
      date: '2026-03-01',
      time: '10:00',
      duration: 60,
    });

    expect(result).toBeUndefined();
  });

  test('should return undefined when updating non-existent event', () => {
    const calendar = createCalendar({ name: 'Test', color: '#1890ff', type: 'PERSONAL' });

    const result = updateEventInCalendar(calendar.id, 99999, {
      title: 'Updated',
    });

    expect(result).toBeUndefined();
  });
});
