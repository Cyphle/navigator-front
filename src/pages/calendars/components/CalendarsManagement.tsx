import { Plus, X } from 'lucide-react';
import type { Calendar } from '@/stores/calendars/calendars.types.ts';

interface CalendarsManagementProps {
  calendars: Calendar[];
  onCreateEvent: (calendarId: number) => void;
  onDeleteCalendar: (id: number) => void;
}

export const CalendarsManagement = ({
  calendars,
  onCreateEvent,
  onDeleteCalendar,
}: CalendarsManagementProps) => {
  if (calendars.length === 0) return null;

  return (
    <div className="mt-5 bg-white rounded-[var(--radius-lg)] p-5" style={{ boxShadow: 'var(--shadow-soft)' }}>
      <p className="text-[10px] font-semibold uppercase tracking-widest mb-3 m-0" style={{ color: 'var(--mist)' }}>
        Mes calendriers
      </p>
      <div className="space-y-2">
        {calendars.map((cal) => (
          <div key={cal.id} className="flex items-center justify-between py-1.5 border-b border-black/5 last:border-0">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: cal.color }} />
              <span className="text-sm font-medium" style={{ color: 'var(--stone)' }}>{cal.name}</span>
              <span
                className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                style={
                  cal.type === 'SHARED'
                    ? { background: 'var(--ocean-pale)', color: 'var(--ocean)' }
                    : { background: 'var(--sage-pale)', color: 'var(--sage)' }
                }
              >
                {cal.type === 'SHARED' ? 'Partagé' : 'Personnel'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-[var(--radius-sm)] border transition-colors hover:bg-[var(--ocean-pale)]"
                style={{ borderColor: 'var(--ocean)', color: 'var(--ocean)' }}
                onClick={() => onCreateEvent(cal.id)}
              >
                <Plus className="w-3 h-3" />
                Événement
              </button>
              <button
                className="w-7 h-7 rounded-md flex items-center justify-center border border-black/10 transition-colors hover:bg-[var(--coral-pale)]"
                style={{ color: 'var(--coral)' }}
                aria-label={`Supprimer ${cal.name}`}
                onClick={() => onDeleteCalendar(cal.id)}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
