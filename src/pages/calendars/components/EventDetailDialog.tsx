import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Calendar, CalendarEvent } from '@/stores/calendars/calendars.types.ts';

try { dayjs.locale('fr'); } catch (_) { /* locale plugin not available */ }

const RECURRENCE_LABELS: Record<string, string> = {
  NONE: 'Aucune',
  DAILY: 'Quotidienne',
  WEEKLY: 'Hebdomadaire',
  MONTHLY: 'Mensuelle',
  YEARLY: 'Annuelle',
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-[10px] font-semibold uppercase tracking-wide shrink-0 mt-0.5" style={{ color: 'var(--mist)' }}>
      {label}
    </span>
    <span className="text-sm font-medium text-right" style={{ color: 'var(--stone)' }}>{value}</span>
  </div>
);

interface EventDetailDialogProps {
  event: (CalendarEvent & { calendar: Calendar }) | null;
  onClose: () => void;
  onDelete: (calendarId: number, eventId: number) => void;
}

export const EventDetailDialog = ({ event, onClose, onDelete }: EventDetailDialogProps) => (
  <Dialog open={event !== null} onOpenChange={(o) => !o && onClose()}>
    <DialogContent className="rounded-[var(--radius-md)] border-none sm:max-w-[420px]" style={{ boxShadow: 'var(--shadow-card)' }}>
      <DialogHeader>
        <DialogTitle className="font-display text-xl font-bold" style={{ color: 'var(--stone)' }}>
          {event?.title}
        </DialogTitle>
      </DialogHeader>
      {event && (
        <div className="space-y-3 pt-1">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: `${event.calendar.color}18`, color: event.calendar.color }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: event.calendar.color }} />
            {event.calendar.name}
          </span>

          <div className="rounded-[var(--radius-sm)] p-4 space-y-2.5" style={{ background: 'var(--sand)' }}>
            <Row label="Date" value={dayjs(event.date).format('DD MMMM YYYY')} />
            <Row label="Heure" value={event.time} />
            <Row label="Durée" value={`${event.duration} min`} />
            {event.recurrence !== 'NONE' && (
              <Row label="Récurrence" value={RECURRENCE_LABELS[event.recurrence]} />
            )}
            {event.description && (
              <Row label="Description" value={event.description} />
            )}
            {event.invites && event.invites.length > 0 && (
              <Row label="Invités" value={event.invites.join(', ')} />
            )}
          </div>

          <div className="flex justify-between pt-2">
            <button
              className="text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)] border transition-colors hover:bg-[var(--coral-pale)]"
              style={{ borderColor: 'var(--coral)', color: 'var(--coral)' }}
              onClick={() => {
                onDelete(event.calendar.id, event.id);
                onClose();
              }}
            >
              Supprimer
            </button>
            <button
              className="text-sm font-semibold text-white px-5 py-2 rounded-[var(--radius-sm)] transition-all hover:-translate-y-px"
              style={{
                background: 'linear-gradient(135deg, var(--ocean) 0%, var(--ocean-light) 100%)',
                boxShadow: '0 3px 12px rgba(27,79,138,0.3)',
              }}
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
);
