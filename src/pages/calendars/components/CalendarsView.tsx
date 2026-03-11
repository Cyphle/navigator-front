import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/fr';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { Calendar, CalendarEvent, UpdateCalendarEventInput } from '../../../stores/calendars/calendars.types';

try { dayjs.locale('fr'); } catch (_) { /* locale plugin not available */ }

type ViewMode = 'month' | 'week' | 'year';

interface CalendarsViewProps {
  calendars: Calendar[];
  onCreateCalendar: () => void;
  onDeleteCalendar: (id: number) => void;
  onCreateEvent: (calendarId: number, eventId?: number) => void;
  onUpdateEvent: (calendarId: number, eventId: number, input: UpdateCalendarEventInput) => void;
  onDeleteEvent: (calendarId: number, eventId: number) => void;
}

const WEEK_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const RECURRENCE_LABELS: Record<string, string> = {
  NONE: 'Aucune',
  DAILY: 'Quotidienne',
  WEEKLY: 'Hebdomadaire',
  MONTHLY: 'Mensuelle',
  YEARLY: 'Annuelle',
};

/** Build a 6-row month grid (Mon-first). */
const buildMonthGrid = (month: Dayjs): Dayjs[][] => {
  const startOfMonth = month.startOf('month');
  // Monday = 1, but dayjs isoWeekday needs plugin — use manual offset
  const firstDayOfWeek = (startOfMonth.day() + 6) % 7; // 0=Mon, 6=Sun
  const start = startOfMonth.subtract(firstDayOfWeek, 'day');

  const weeks: Dayjs[][] = [];
  let current = start;
  for (let w = 0; w < 6; w++) {
    const week: Dayjs[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(current);
      current = current.add(1, 'day');
    }
    weeks.push(week);
  }
  return weeks;
};

/** Build week grid (Mon–Sun of selectedDate's week). */
const buildWeekGrid = (date: Dayjs): Dayjs[] => {
  const dow = (date.day() + 6) % 7;
  const monday = date.subtract(dow, 'day');
  return Array.from({ length: 7 }, (_, i) => monday.add(i, 'day'));
};

export const CalendarsView = ({
  calendars,
  onCreateCalendar,
  onDeleteCalendar,
  onCreateEvent,
  onDeleteEvent,
}: CalendarsViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedEvent, setSelectedEvent] = useState<(CalendarEvent & { calendar: Calendar }) | null>(null);
  const [visibleCalendars, setVisibleCalendars] = useState<Set<number>>(
    new Set(calendars.map((c) => c.id))
  );

  const allEvents = useMemo(
    () =>
      calendars
        .filter((c) => visibleCalendars.has(c.id))
        .flatMap((c) => c.events.map((e) => ({ ...e, calendar: c }))),
    [calendars, visibleCalendars]
  );

  const getEventsForDate = (date: Dayjs) =>
    allEvents.filter((e) => dayjs(e.date).isSame(date, 'day'));

  const toggleCalendar = (id: number) => {
    setVisibleCalendars((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const navigate = (dir: -1 | 1) => {
    if (viewMode === 'month') setSelectedDate((d) => d.add(dir, 'month'));
    else if (viewMode === 'week') setSelectedDate((d) => d.add(dir * 7, 'day'));
    else setSelectedDate((d) => d.add(dir, 'year'));
  };

  const currentLabel = useMemo(() => {
    if (viewMode === 'month') return selectedDate.format('MMMM YYYY');
    if (viewMode === 'week') {
      const week = buildWeekGrid(selectedDate);
      return `${week[0].format('D MMM')} – ${week[6].format('D MMM YYYY')}`;
    }
    return selectedDate.format('YYYY');
  }, [selectedDate, viewMode]);

  const monthGrid = useMemo(() => buildMonthGrid(selectedDate), [selectedDate]);
  const weekGrid = useMemo(() => buildWeekGrid(selectedDate), [selectedDate]);

  const today = dayjs();

  const EventChip = ({ event }: { event: CalendarEvent & { calendar: Calendar } }) => (
    <button
      className="w-full text-left text-[10px] font-semibold px-1.5 py-0.5 rounded-md truncate transition-opacity hover:opacity-80"
      style={{ background: `${event.calendar.color}22`, color: event.calendar.color }}
      onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
    >
      {event.time} {event.title}
    </button>
  );

  const DayCell = ({ day, isCurrentMonth = true }: { day: Dayjs; isCurrentMonth?: boolean }) => {
    const events = getEventsForDate(day);
    const isToday = day.isSame(today, 'day');
    return (
      <div className={cn('min-h-[52px] md:min-h-[80px] p-1 md:p-1.5 border-b border-r border-black/5', !isCurrentMonth && 'opacity-40')}>
        <div className="flex items-center justify-between mb-1">
          <span
            className={cn(
              'w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-full',
              isToday ? 'text-white' : 'text-[var(--stone)]'
            )}
            style={isToday ? { background: 'var(--ocean)' } : {}}
          >
            {day.date()}
          </span>
        </div>
        <div className="space-y-0.5">
          {events.slice(0, 2).map((e) => <EventChip key={e.id} event={e} />)}
          {events.length > 2 && (
            <p className="text-[10px] pl-1.5 m-0" style={{ color: 'var(--mist)' }}>
              +{events.length - 2} autres
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 min-h-full" style={{ background: 'var(--sand)' }}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-5">
        {/* Calendar filter chips */}
        <div className="flex flex-wrap gap-2">
          {calendars.map((cal) => {
            const active = visibleCalendars.has(cal.id);
            return (
              <button
                key={cal.id}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
                style={{
                  borderColor: cal.color,
                  background: active ? `${cal.color}18` : 'transparent',
                  color: active ? cal.color : 'var(--mist)',
                }}
                onClick={() => toggleCalendar(cal.id)}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: cal.color }}
                />
                {cal.name}
                {cal.type === 'SHARED' && (
                  <span className="opacity-60 text-[9px] uppercase tracking-wide">· Partagé</span>
                )}
              </button>
            );
          })}
          <button
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-dashed transition-colors hover:bg-[var(--ocean-pale)]"
            style={{ borderColor: 'var(--ocean)', color: 'var(--ocean)' }}
            onClick={onCreateCalendar}
          >
            <Plus className="w-3 h-3" />
            Nouveau
          </button>
        </div>
      </div>

      {/* Calendar card */}
      <div className="bg-white rounded-[var(--radius-lg)] overflow-hidden" style={{ boxShadow: 'var(--shadow-soft)' }}>
        {/* Controls bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 px-4 md:px-5 py-3 md:py-4 border-b border-black/5">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center border border-black/10 transition-colors hover:bg-[var(--sand)]"
              onClick={() => navigate(-1)}
              aria-label="Précédent"
            >
              <ChevronLeft className="w-4 h-4" style={{ color: 'var(--stone)' }} />
            </button>
            <h3 className="font-display text-sm md:text-base font-semibold min-w-[120px] md:min-w-[160px] text-center capitalize" style={{ color: 'var(--stone)' }}>
              {currentLabel}
            </h3>
            <button
              className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center border border-black/10 transition-colors hover:bg-[var(--sand)]"
              onClick={() => navigate(1)}
              aria-label="Suivant"
            >
              <ChevronRight className="w-4 h-4" style={{ color: 'var(--stone)' }} />
            </button>
            <button
              className="hidden md:block text-xs font-semibold px-3 py-1.5 rounded-[var(--radius-sm)] border border-black/10 transition-colors hover:bg-[var(--ocean-pale)] ml-1"
              style={{ color: 'var(--ocean)' }}
              onClick={() => setSelectedDate(dayjs())}
            >
              Aujourd'hui
            </button>
          </div>

          {/* View mode */}
          <div className="flex rounded-[var(--radius-sm)] border border-black/10 overflow-hidden">
            <button
              className={cn(
                'px-3 py-1.5 text-xs font-semibold transition-colors',
                viewMode === 'month' ? 'text-white' : 'hover:bg-[var(--sand)]'
              )}
              style={viewMode === 'month' ? { background: 'var(--ocean)', color: 'white' } : { color: 'var(--stone)' }}
              onClick={() => setViewMode('month')}
            >
              Mois
            </button>
            <button
              className={cn(
                'hidden md:block px-3 py-1.5 text-xs font-semibold transition-colors',
                viewMode === 'week' ? 'text-white' : 'hover:bg-[var(--sand)]'
              )}
              style={viewMode === 'week' ? { background: 'var(--ocean)', color: 'white' } : { color: 'var(--stone)' }}
              onClick={() => setViewMode('week')}
            >
              Semaine
            </button>
            <button
              className={cn(
                'hidden md:block px-3 py-1.5 text-xs font-semibold transition-colors',
                viewMode === 'year' ? 'text-white' : 'hover:bg-[var(--sand)]'
              )}
              style={viewMode === 'year' ? { background: 'var(--ocean)', color: 'white' } : { color: 'var(--stone)' }}
              onClick={() => setViewMode('year')}
            >
              Année
            </button>
          </div>
        </div>

        {/* Month view */}
        {viewMode === 'month' && (
          <>
            <div className="grid grid-cols-7 border-b border-black/5">
              {WEEK_DAYS.map((d) => (
                <div key={d} className="py-2 text-center text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--mist)' }}>
                  <span className="md:hidden">{d[0]}</span>
                  <span className="hidden md:inline">{d}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {monthGrid.flat().map((day, i) => (
                <DayCell
                  key={i}
                  day={day}
                  isCurrentMonth={day.month() === selectedDate.month()}
                />
              ))}
            </div>
          </>
        )}

        {/* Week view */}
        {viewMode === 'week' && (
          <>
            <div className="grid grid-cols-7 border-b border-black/5">
              {weekGrid.map((day) => (
                <div key={day.toString()} className="py-2 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-wider m-0" style={{ color: 'var(--mist)' }}>
                    {day.format('ddd')}
                  </p>
                  <span
                    className={cn(
                      'w-7 h-7 mx-auto mt-0.5 flex items-center justify-center text-sm font-semibold rounded-full',
                      day.isSame(today, 'day') ? 'text-white' : ''
                    )}
                    style={day.isSame(today, 'day') ? { background: 'var(--ocean)' } : { color: 'var(--stone)' }}
                  >
                    {day.date()}
                  </span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 min-h-[200px]">
              {weekGrid.map((day, i) => {
                const events = getEventsForDate(day);
                return (
                  <div key={i} className="p-2 border-r border-black/5 space-y-1">
                    {events.map((e) => <EventChip key={e.id} event={e} />)}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Year view */}
        {viewMode === 'year' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
            {Array.from({ length: 12 }, (_, i) => {
              const month = dayjs().year(selectedDate.year()).month(i);
              const eventsThisMonth = allEvents.filter((e) => dayjs(e.date).month() === i && dayjs(e.date).year() === selectedDate.year());
              return (
                <button
                  key={i}
                  className="rounded-[var(--radius-md)] p-3 text-left border border-black/5 transition-all hover:border-[var(--ocean-light)] hover:bg-[var(--ocean-pale)]"
                  onClick={() => { setSelectedDate(month); setViewMode('month'); }}
                >
                  <p className="text-sm font-semibold capitalize m-0" style={{ color: 'var(--stone)' }}>
                    {month.format('MMMM')}
                  </p>
                  {eventsThisMonth.length > 0 && (
                    <p className="text-[10px] mt-1 m-0" style={{ color: 'var(--ocean)' }}>
                      {eventsThisMonth.length} événement{eventsThisMonth.length > 1 ? 's' : ''}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Calendars management */}
      {calendars.length > 0 && (
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
      )}

      {/* Event detail dialog */}
      <Dialog open={selectedEvent !== null} onOpenChange={(o) => !o && setSelectedEvent(null)}>
        <DialogContent className="rounded-[var(--radius-md)] border-none sm:max-w-[420px]" style={{ boxShadow: 'var(--shadow-card)' }}>
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold" style={{ color: 'var(--stone)' }}>
              {selectedEvent?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-3 pt-1">
              {/* Calendar badge */}
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: `${selectedEvent.calendar.color}18`, color: selectedEvent.calendar.color }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: selectedEvent.calendar.color }} />
                {selectedEvent.calendar.name}
              </span>

              <div className="rounded-[var(--radius-sm)] p-4 space-y-2.5" style={{ background: 'var(--sand)' }}>
                <Row label="Date" value={dayjs(selectedEvent.date).format('DD MMMM YYYY')} />
                <Row label="Heure" value={selectedEvent.time} />
                <Row label="Durée" value={`${selectedEvent.duration} min`} />
                {selectedEvent.recurrence !== 'NONE' && (
                  <Row label="Récurrence" value={RECURRENCE_LABELS[selectedEvent.recurrence]} />
                )}
                {selectedEvent.description && (
                  <Row label="Description" value={selectedEvent.description} />
                )}
                {selectedEvent.invites && selectedEvent.invites.length > 0 && (
                  <Row label="Invités" value={selectedEvent.invites.join(', ')} />
                )}
              </div>

              <div className="flex justify-between pt-2">
                <button
                  className="text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)] border transition-colors hover:bg-[var(--coral-pale)]"
                  style={{ borderColor: 'var(--coral)', color: 'var(--coral)' }}
                  onClick={() => {
                    onDeleteEvent(selectedEvent.calendar.id, selectedEvent.id);
                    setSelectedEvent(null);
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
                  onClick={() => setSelectedEvent(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-[10px] font-semibold uppercase tracking-wide shrink-0 mt-0.5" style={{ color: 'var(--mist)' }}>
      {label}
    </span>
    <span className="text-sm font-medium text-right" style={{ color: 'var(--stone)' }}>{value}</span>
  </div>
);
