import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  Calendar,
  CreateCalendarInput,
  UpdateCalendarInput,
  CreateCalendarEventInput,
  UpdateCalendarEventInput,
} from './calendars.types';
import * as calendarsService from '../../services/calendars.service';

const QUERY_KEY = 'calendars';

export const useFetchAllCalendars = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: calendarsService.getAllCalendars,
  });
};

export const useFetchCalendarById = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => calendarsService.getCalendarById(id),
    enabled: id > 0,
  });
};

export const useCreateCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCalendarInput) => calendarsService.createCalendar(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateCalendarInput }) =>
      calendarsService.updateCalendar(id, input),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};

export const useDeleteCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => calendarsService.deleteCalendar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useAddEventToCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ calendarId, input }: { calendarId: number; input: CreateCalendarEventInput }) =>
      calendarsService.addEventToCalendar(calendarId, input),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};

export const useUpdateEventInCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ calendarId, eventId, input }: { calendarId: number; eventId: number; input: UpdateCalendarEventInput }) =>
      calendarsService.updateEventInCalendar(calendarId, eventId, input),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, data.id], data);
    },
  });
};

export const useDeleteEventFromCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ calendarId, eventId }: { calendarId: number; eventId: number }) =>
      calendarsService.deleteEventFromCalendar(calendarId, eventId),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};
