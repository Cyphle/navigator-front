import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
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
import { Loader2 } from 'lucide-react';

export const Calendars = () => {
  const [isCalendarFormOpen, setIsCalendarFormOpen] = useState(false);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedCalendarId, setSelectedCalendarId] = useState<number | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: calendars, isPending, isError } = useFetchAllCalendars();
  const { data: families } = useFetchFamilies();
  const createCalendarMutation = useCreateCalendar();
  const deleteCalendarMutation = useDeleteCalendar();
  const addEventMutation = useAddEventToCalendar();
  const updateEventMutation = useUpdateEventInCalendar();
  const deleteEventMutation = useDeleteEventFromCalendar();

  const handleCreateCalendar = (input: CreateCalendarInput) => {
    createCalendarMutation.mutate(input, {
      onSuccess: () => {
        toast({ title: 'Calendrier créé avec succès' });
        setIsCalendarFormOpen(false);
      },
      onError: () => toast({ title: 'Erreur lors de la création du calendrier', variant: 'destructive' }),
    });
  };

  const handleDeleteCalendar = (id: number) => {
    deleteCalendarMutation.mutate(id, {
      onSuccess: () => toast({ title: 'Calendrier supprimé' }),
      onError: () => toast({ title: 'Erreur lors de la suppression', variant: 'destructive' }),
    });
  };

  const handleCreateEvent = (input: CreateCalendarEventInput) => {
    if (!selectedCalendarId) return;
    addEventMutation.mutate(
      { calendarId: selectedCalendarId, input },
      {
        onSuccess: () => {
          toast({ title: 'Événement ajouté' });
          setIsEventFormOpen(false);
          setSelectedCalendarId(null);
          setSelectedEventId(null);
        },
        onError: () => toast({ title: "Erreur lors de l'ajout de l'événement", variant: 'destructive' }),
      }
    );
  };

  const handleUpdateEvent = (calendarId: number, eventId: number, input: UpdateCalendarEventInput) => {
    updateEventMutation.mutate(
      { calendarId, eventId, input },
      {
        onSuccess: () => toast({ title: 'Événement mis à jour' }),
        onError: () => toast({ title: "Erreur lors de la mise à jour de l'événement", variant: 'destructive' }),
      }
    );
  };

  const handleDeleteEvent = (calendarId: number, eventId: number) => {
    deleteEventMutation.mutate(
      { calendarId, eventId },
      {
        onSuccess: () => toast({ title: 'Événement supprimé' }),
        onError: () => toast({ title: "Erreur lors de la suppression de l'événement", variant: 'destructive' }),
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
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 min-h-full" style={{ background: 'var(--sand)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--ocean)' }} />
        <p className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--mist)' }}>
          Loading...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-12 min-h-full" style={{ background: 'var(--sand)' }}>
        <div
          className="rounded-[var(--radius-lg)] p-8 flex flex-col items-center gap-4"
          style={{ background: 'var(--coral-pale)', color: 'var(--coral)' }}
        >
          <p className="text-sm font-medium">Une erreur est survenue (error loading calendars).</p>
        </div>
      </div>
    );
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
