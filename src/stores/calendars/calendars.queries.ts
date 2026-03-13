import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateCalendarInput,
  UpdateCalendarInput,
  CreateCalendarEventInput,
  UpdateCalendarEventInput,
} from './calendars.types';
import * as calendarsService from '../../services/calendars.service';
import { useFamily } from '../../contexts/family/family.context.tsx';

const QUERY_KEY = 'calendars';

export const useFetchAllCalendars = () => {
  const { currentFamily } = useFamily();
  return useQuery({
    queryKey: [QUERY_KEY, currentFamily?.id],
    queryFn: () => calendarsService.getAllCalendars(currentFamily?.id ?? ''),
    enabled: Boolean(currentFamily?.id),
  });
};

export const useFetchCalendarById = (id: number) => {
  const { currentFamily } = useFamily();
  return useQuery({
    queryKey: [QUERY_KEY, currentFamily?.id, id],
    queryFn: () => calendarsService.getCalendarById(currentFamily?.id ?? '', id),
    enabled: id > 0 && Boolean(currentFamily?.id),
  });
};

export const useCreateCalendar = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: (input: CreateCalendarInput) => calendarsService.createCalendar(currentFamily?.id ?? '', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateCalendar = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateCalendarInput }) =>
      calendarsService.updateCalendar(currentFamily?.id ?? '', id, input),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, currentFamily?.id, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};

export const useDeleteCalendar = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: (id: number) => calendarsService.deleteCalendar(currentFamily?.id ?? '', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useAddEventToCalendar = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ calendarId, input }: { calendarId: number; input: CreateCalendarEventInput }) =>
      calendarsService.addEventToCalendar(currentFamily?.id ?? '', calendarId, input),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, currentFamily?.id, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};

export const useUpdateEventInCalendar = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ calendarId, eventId, input }: { calendarId: number; eventId: number; input: UpdateCalendarEventInput }) =>
      calendarsService.updateEventInCalendar(currentFamily?.id ?? '', calendarId, eventId, input),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, currentFamily?.id, data.id], data);
    },
  });
};

export const useDeleteEventFromCalendar = () => {
  const queryClient = useQueryClient();
  const { currentFamily } = useFamily();

  return useMutation({
    mutationFn: ({ calendarId, eventId }: { calendarId: number; eventId: number }) =>
      calendarsService.deleteEventFromCalendar(currentFamily?.id ?? '', calendarId, eventId),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY, currentFamily?.id, data.id], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY], exact: true });
    },
  });
};
