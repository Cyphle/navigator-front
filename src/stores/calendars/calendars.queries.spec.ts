import { waitFor } from '@testing-library/react';
import { renderQueryHook } from '../../../test-utils/render';
import { aCalendar, aCalendarEvent } from '../../../test-utils/factories';
import * as calendarsService from '../../services/calendars.service';
import {
  useFetchAllCalendars,
  useFetchCalendarById,
  useCreateCalendar,
  useDeleteCalendar,
  useAddEventToCalendar,
  useUpdateEventInCalendar,
  useDeleteEventFromCalendar,
} from './calendars.queries';

jest.mock('../../services/calendars.service', () => ({
  getAllCalendars: jest.fn(),
  getCalendarById: jest.fn(),
  createCalendar: jest.fn(),
  updateCalendar: jest.fn(),
  deleteCalendar: jest.fn(),
  addEventToCalendar: jest.fn(),
  updateEventInCalendar: jest.fn(),
  deleteEventFromCalendar: jest.fn(),
}));

describe('calendars queries', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch all calendars', async () => {
    const mockCalendars = [aCalendar({ id: 1 }), aCalendar({ id: 2 })];
    jest.mocked(calendarsService.getAllCalendars).mockResolvedValue(mockCalendars);

    const { result } = renderQueryHook(() => useFetchAllCalendars());

    expect(calendarsService.getAllCalendars).toHaveBeenCalled();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockCalendars);
  });

  test('should fetch calendar by id', async () => {
    const mockCalendar = aCalendar({ id: 1 });
    jest.mocked(calendarsService.getCalendarById).mockResolvedValue(mockCalendar);

    const { result } = renderQueryHook(() => useFetchCalendarById(1));

    expect(calendarsService.getCalendarById).toHaveBeenCalledWith(1);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockCalendar);
  });

  test('should create calendar', async () => {
    const input = { name: 'Nouveau calendrier', color: '#1890ff', type: 'PERSONAL' as const };
    const mockCreated = aCalendar({ id: 3, ...input });
    jest.mocked(calendarsService.createCalendar).mockResolvedValue(mockCreated);

    const { result } = renderQueryHook(() => useCreateCalendar());

    result.current.mutate(input);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(calendarsService.createCalendar).toHaveBeenCalledWith(input);
  });

  test('should delete calendar', async () => {
    jest.mocked(calendarsService.deleteCalendar).mockResolvedValue(undefined);

    const { result } = renderQueryHook(() => useDeleteCalendar());

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(calendarsService.deleteCalendar).toHaveBeenCalledWith(1);
  });

  test('should add event to calendar', async () => {
    const input = { title: 'Réunion', date: '2026-03-01', time: '10:00', duration: 60 };
    const mockUpdated = aCalendar({
      id: 1,
      events: [aCalendarEvent({ title: 'Réunion', date: '2026-03-01', time: '10:00', duration: 60 })],
    });
    jest.mocked(calendarsService.addEventToCalendar).mockResolvedValue(mockUpdated);

    const { result } = renderQueryHook(() => useAddEventToCalendar());

    result.current.mutate({ calendarId: 1, input });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(calendarsService.addEventToCalendar).toHaveBeenCalledWith(1, input);
  });

  test('should update event in calendar', async () => {
    const input = { title: 'Réunion mise à jour' };
    const mockUpdated = aCalendar({
      id: 1,
      events: [aCalendarEvent({ id: 1, title: 'Réunion mise à jour' })],
    });
    jest.mocked(calendarsService.updateEventInCalendar).mockResolvedValue(mockUpdated);

    const { result } = renderQueryHook(() => useUpdateEventInCalendar());

    result.current.mutate({ calendarId: 1, eventId: 1, input });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(calendarsService.updateEventInCalendar).toHaveBeenCalledWith(1, 1, input);
  });

  test('should delete event from calendar', async () => {
    const mockUpdated = aCalendar({ id: 1, events: [] });
    jest.mocked(calendarsService.deleteEventFromCalendar).mockResolvedValue(mockUpdated);

    const { result } = renderQueryHook(() => useDeleteEventFromCalendar());

    result.current.mutate({ calendarId: 1, eventId: 1 });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(calendarsService.deleteEventFromCalendar).toHaveBeenCalledWith(1, 1);
  });
});
