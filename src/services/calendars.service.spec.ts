import { getOne, post, put, deleteOne } from '../helpers/http';
import {
  getAllCalendars,
  getCalendarById,
  createCalendar,
  updateCalendar,
  deleteCalendar,
  addEventToCalendar,
  updateEventInCalendar,
  deleteEventFromCalendar,
} from './calendars.service';

jest.mock('../helpers/http', () => ({
  getOne: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  deleteOne: jest.fn(),
}));

describe('Calendars service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get all calendars', async () => {
    const apiResponse = [
      {
        id: 1,
        name: 'Mon calendrier',
        color: '#1890ff',
        type: 'PERSONAL',
        events: [],
        createdAt: '2026-02-25T10:00:00Z',
        updatedAt: '2026-02-25T10:00:00Z',
      },
    ];

    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await getAllCalendars();

    expect(getOne).toHaveBeenCalledWith('calendars', expect.any(Function));
    expect(response).toHaveLength(1);
    expect(response[0].name).toBe('Mon calendrier');
  });

  test('should get calendar by id', async () => {
    const apiResponse = {
      id: 1,
      name: 'Famille',
      color: '#52c41a',
      type: 'SHARED',
      familyId: 5,
      events: [
        {
          id: 1,
          calendarId: 1,
          title: 'Réunion',
          date: '2026-03-01',
          time: '10:00',
          duration: 60,
          recurrence: 'NONE',
          createdAt: '2026-02-25T10:00:00Z',
          updatedAt: '2026-02-25T10:00:00Z',
        },
      ],
      createdAt: '2026-02-25T10:00:00Z',
      updatedAt: '2026-02-25T10:00:00Z',
    };

    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await getCalendarById(1);

    expect(getOne).toHaveBeenCalledWith('calendars/1', expect.any(Function));
    expect(response.id).toBe(1);
    expect(response.events).toHaveLength(1);
  });

  test('should create calendar', async () => {
    const input = {
      name: 'Nouveau calendrier',
      color: '#1890ff',
      type: 'PERSONAL' as const,
    };

    const apiResponse = {
      id: 2,
      ...input,
      events: [],
      createdAt: '2026-02-25T10:00:00Z',
      updatedAt: '2026-02-25T10:00:00Z',
    };

    (post as jest.Mock).mockImplementation((_path: string, _body: any, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await createCalendar(input);

    expect(post).toHaveBeenCalledWith('calendars', input, expect.any(Function));
    expect(response.id).toBe(2);
    expect(response.name).toBe('Nouveau calendrier');
  });

  test('should add event to calendar', async () => {
    const input = {
      title: 'Rendez-vous',
      description: 'Chez le dentiste',
      date: '2026-03-05',
      time: '14:00',
      duration: 45,
    };

    const apiResponse = {
      id: 1,
      name: 'Mon calendrier',
      color: '#1890ff',
      type: 'PERSONAL',
      events: [
        {
          id: 1,
          calendarId: 1,
          title: 'Rendez-vous',
          description: 'Chez le dentiste',
          date: '2026-03-05',
          time: '14:00',
          duration: 45,
          recurrence: 'NONE',
          createdAt: '2026-02-25T10:00:00Z',
          updatedAt: '2026-02-25T10:00:00Z',
        },
      ],
      createdAt: '2026-02-25T10:00:00Z',
      updatedAt: '2026-02-25T11:00:00Z',
    };

    (post as jest.Mock).mockImplementation((_path: string, _body: any, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await addEventToCalendar(1, input);

    expect(post).toHaveBeenCalledWith('calendars/1/events', input, expect.any(Function));
    expect(response.events).toHaveLength(1);
    expect(response.events[0].title).toBe('Rendez-vous');
  });

  test('should update event in calendar', async () => {
    const input = {
      title: 'Réunion mise à jour',
    };

    const apiResponse = {
      id: 1,
      name: 'Mon calendrier',
      color: '#1890ff',
      type: 'PERSONAL',
      events: [
        {
          id: 1,
          calendarId: 1,
          title: 'Réunion mise à jour',
          date: '2026-03-01',
          time: '10:00',
          duration: 60,
          recurrence: 'NONE',
          createdAt: '2026-02-25T10:00:00Z',
          updatedAt: '2026-02-25T11:00:00Z',
        },
      ],
      createdAt: '2026-02-25T10:00:00Z',
      updatedAt: '2026-02-25T11:00:00Z',
    };

    (put as jest.Mock).mockImplementation((_path: string, _body: any, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await updateEventInCalendar(1, 1, input);

    expect(put).toHaveBeenCalledWith('calendars/1/events/1', input, expect.any(Function));
    expect(response.events[0].title).toBe('Réunion mise à jour');
  });

  test('should delete event from calendar', async () => {
    const apiResponse = {
      id: 1,
      name: 'Mon calendrier',
      color: '#1890ff',
      type: 'PERSONAL',
      events: [],
      createdAt: '2026-02-25T10:00:00Z',
      updatedAt: '2026-02-25T11:00:00Z',
    };

    (deleteOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(apiResponse));
    });

    const response = await deleteEventFromCalendar(1, 1);

    expect(deleteOne).toHaveBeenCalledWith('calendars/1/events/1', expect.any(Function));
    expect(response.events).toHaveLength(0);
  });

  test('should handle empty response for get all', async () => {
    (getOne as jest.Mock).mockImplementation((_path: string, mapper: (data: any) => any) => {
      return Promise.resolve(mapper(null));
    });

    const response = await getAllCalendars();

    expect(response).toEqual([]);
  });
});
