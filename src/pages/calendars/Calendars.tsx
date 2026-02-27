import './Calendars.scss';
import { useState } from 'react';
import { message } from 'antd';
import {
  useFetchAllCalendars,
  useCreateCalendar,
  useDeleteCalendar,
  useAddEventToCalendar,
  useUpdateEventInCalendar,
  useDeleteEventFromCalendar,
} from '../../stores/calendars/calendars.queries';
import { useFetchFamilies } from '../../stores/families/families.queries';
import { CalendarsView } from './components/CalendarsView';
import { CreateCalendarForm } from './components/CreateCalendarForm';
import { CreateEventForm } from './components/CreateEventForm';
import type { CreateCalendarInput, CreateCalendarEventInput, UpdateCalendarEventInput } from '../../stores/calendars/calendars.types';

export const Calendars = () => {
  const [isCalendarFormOpen, setIsCalendarFormOpen] = useState(false);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedCalendarId, setSelectedCalendarId] = useState<number | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const { data: calendars, isPending, isError, error } = useFetchAllCalendars();
  const { data: families } = useFetchFamilies();
  const createCalendarMutation = useCreateCalendar();
  const deleteCalendarMutation = useDeleteCalendar();
  const addEventMutation = useAddEventToCalendar();
  const updateEventMutation = useUpdateEventInCalendar();
  const deleteEventMutation = useDeleteEventFromCalendar();

  const handleCreateCalendar = (input: CreateCalendarInput) => {
    createCalendarMutation.mutate(input, {
      onSuccess: () => {
        message.success('Calendrier créé avec succès');
        setIsCalendarFormOpen(false);
      },
      onError: () => {
        message.error('Erreur lors de la création du calendrier');
      },
    });
  };

  const handleDeleteCalendar = (id: number) => {
    deleteCalendarMutation.mutate(id, {
      onSuccess: () => {
        message.success('Calendrier supprimé');
      },
      onError: () => {
        message.error('Erreur lors de la suppression');
      },
    });
  };

  const handleCreateEvent = (input: CreateCalendarEventInput) => {
    if (!selectedCalendarId) return;

    addEventMutation.mutate(
      { calendarId: selectedCalendarId, input },
      {
        onSuccess: () => {
          message.success('Événement ajouté');
          setIsEventFormOpen(false);
          setSelectedCalendarId(null);
          setSelectedEventId(null);
        },
        onError: () => {
          message.error("Erreur lors de l'ajout de l'événement");
        },
      }
    );
  };

  const handleUpdateEvent = (calendarId: number, eventId: number, input: UpdateCalendarEventInput) => {
    updateEventMutation.mutate(
      { calendarId, eventId, input },
      {
        onSuccess: () => {
          message.success('Événement mis à jour');
        },
        onError: () => {
          message.error("Erreur lors de la mise à jour de l'événement");
        },
      }
    );
  };

  const handleDeleteEvent = (calendarId: number, eventId: number) => {
    deleteEventMutation.mutate(
      { calendarId, eventId },
      {
        onSuccess: () => {
          message.success('Événement supprimé');
        },
        onError: () => {
          message.error("Erreur lors de la suppression de l'événement");
        },
      }
    );
  };

  const handleOpenEventForm = (calendarId: number, eventId?: number) => {
    setSelectedCalendarId(calendarId);
    setSelectedEventId(eventId || null);
    setIsEventFormOpen(true);
  };

  const handleCloseEventForm = () => {
    setIsEventFormOpen(false);
    setSelectedCalendarId(null);
    setSelectedEventId(null);
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <CalendarsView
        calendars={calendars || []}
        onCreateCalendar={() => setIsCalendarFormOpen(true)}
        onDeleteCalendar={handleDeleteCalendar}
        onCreateEvent={handleOpenEventForm}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
      />

      <CreateCalendarForm
        open={isCalendarFormOpen}
        onCancel={() => setIsCalendarFormOpen(false)}
        onSubmit={handleCreateCalendar}
        isLoading={createCalendarMutation.isPending}
        families={families || []}
      />

      <CreateEventForm
        open={isEventFormOpen}
        onCancel={handleCloseEventForm}
        onSubmit={handleCreateEvent}
        isLoading={addEventMutation.isPending}
        eventId={selectedEventId}
        calendars={calendars || []}
        selectedCalendarId={selectedCalendarId}
      />
    </>
  );
};
