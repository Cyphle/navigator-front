import { Button, Calendar as AntCalendar, Badge, Card, List, Modal, Popconfirm, Radio, Select, Space, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useState } from 'react';
import type { Calendar, CalendarEvent, UpdateCalendarEventInput } from '../../../stores/calendars/calendars.types';
import './CalendarsView.scss';

type ViewMode = 'month' | 'week' | 'year';

interface CalendarsViewProps {
  calendars: Calendar[];
  onCreateCalendar: () => void;
  onDeleteCalendar: (id: number) => void;
  onCreateEvent: (calendarId: number, eventId?: number) => void;
  onUpdateEvent: (calendarId: number, eventId: number, input: UpdateCalendarEventInput) => void;
  onDeleteEvent: (calendarId: number, eventId: number) => void;
}

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
    new Set(calendars.map((cal) => cal.id))
  );

  // Get all events from visible calendars
  const allEvents = calendars
    .filter((cal) => visibleCalendars.has(cal.id))
    .flatMap((cal) =>
      cal.events.map((event) => ({
        ...event,
        calendar: cal,
      }))
    );

  // Get events for selected date
  const eventsForSelectedDate = allEvents.filter((event) =>
    dayjs(event.date).isSame(selectedDate, 'day')
  );

  // Get events grouped by date
  const getEventsForDate = (date: Dayjs) => {
    return allEvents.filter((event) => dayjs(event.date).isSame(date, 'day'));
  };

  const dateCellRender = (value: Dayjs) => {
    const events = getEventsForDate(value);
    return (
      <ul className="events">
        {events.slice(0, 3).map((event) => (
          <li key={event.id} onClick={() => setSelectedEvent(event)} style={{ cursor: 'pointer' }}>
            <Badge color={event.calendar.color} text={event.title} />
          </li>
        ))}
        {events.length > 3 && (
          <li>
            <span style={{ color: '#999', fontSize: '12px' }}>
              +{events.length - 3} autres
            </span>
          </li>
        )}
      </ul>
    );
  };

  const toggleCalendarVisibility = (calendarId: number) => {
    const newVisible = new Set(visibleCalendars);
    if (newVisible.has(calendarId)) {
      newVisible.delete(calendarId);
    } else {
      newVisible.add(calendarId);
    }
    setVisibleCalendars(newVisible);
  };

  const goToPrevious = () => {
    if (viewMode === 'month') {
      setSelectedDate(selectedDate.subtract(1, 'month'));
    } else if (viewMode === 'week') {
      setSelectedDate(selectedDate.subtract(1, 'week'));
    } else {
      setSelectedDate(selectedDate.subtract(1, 'year'));
    }
  };

  const goToNext = () => {
    if (viewMode === 'month') {
      setSelectedDate(selectedDate.add(1, 'month'));
    } else if (viewMode === 'week') {
      setSelectedDate(selectedDate.add(1, 'week'));
    } else {
      setSelectedDate(selectedDate.add(1, 'year'));
    }
  };

  const goToToday = () => {
    setSelectedDate(dayjs());
  };

  const getNavigationLabel = () => {
    if (viewMode === 'month') {
      return { prev: 'Mois précédent', next: 'Mois suivant' };
    } else if (viewMode === 'week') {
      return { prev: 'Semaine précédente', next: 'Semaine suivante' };
    } else {
      return { prev: 'Année précédente', next: 'Année suivante' };
    }
  };

  const navigationLabels = getNavigationLabel();

  return (
    <div className="calendars-view">
      <div className="calendars-header">
        <Select
          mode="multiple"
          placeholder="Mes calendriers"
          value={Array.from(visibleCalendars)}
          onChange={(values) => setVisibleCalendars(new Set(values))}
          style={{ width: 300 }}
          size="large"
          maxTagCount="responsive"
          options={calendars.map((cal) => ({
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: cal.color,
                  }}
                />
                <span>{cal.name}</span>
                {cal.type === 'SHARED' && (
                  <Tag color="blue" style={{ marginLeft: 'auto' }}>
                    Partagé
                  </Tag>
                )}
              </div>
            ),
            value: cal.id,
          }))}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateCalendar}>
          Nouveau calendrier
        </Button>
      </div>

      <div className="calendars-content">
        <Card>
            <div className="calendar-controls">
              <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)} buttonStyle="solid">
                <Radio.Button value="month">Mois</Radio.Button>
                <Radio.Button value="week">Semaine</Radio.Button>
                <Radio.Button value="year">Année</Radio.Button>
              </Radio.Group>

              <div className="calendar-navigation">
                <Button
                  icon={<LeftOutlined />}
                  onClick={goToPrevious}
                  size="large"
                >
                  {navigationLabels.prev}
                </Button>
                <Button onClick={goToToday} size="large">
                  Aujourd'hui
                </Button>
                <Button
                  icon={<RightOutlined />}
                  onClick={goToNext}
                  iconPosition="end"
                  size="large"
                >
                  {navigationLabels.next}
                </Button>
              </div>
            </div>

            <AntCalendar
              mode={viewMode === 'week' ? 'month' : viewMode}
              cellRender={dateCellRender}
              onSelect={setSelectedDate}
              value={selectedDate}
            />
          </Card>

        <Modal
          title="Détails de l'événement"
          open={selectedEvent !== null}
          onCancel={() => setSelectedEvent(null)}
          footer={[
            <Popconfirm
              key="delete"
              title="Supprimer cet événement ?"
              onConfirm={() => {
                if (selectedEvent) {
                  onDeleteEvent(selectedEvent.calendar.id, selectedEvent.id);
                  setSelectedEvent(null);
                }
              }}
              okText="Oui"
              cancelText="Non"
            >
              <Button danger>Supprimer</Button>
            </Popconfirm>,
            <Button key="close" type="primary" onClick={() => setSelectedEvent(null)}>
              Fermer
            </Button>,
          ]}
        >
          {selectedEvent && (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <Tag color={selectedEvent.calendar.color}>
                  {selectedEvent.calendar.name}
                </Tag>
              </div>

              <h3 style={{ marginTop: 0 }}>{selectedEvent.title}</h3>

              <div style={{ marginBottom: '8px' }}>
                <strong>Date:</strong> {dayjs(selectedEvent.date).format('DD/MM/YYYY')}
              </div>

              <div style={{ marginBottom: '8px' }}>
                <strong>Heure:</strong> {selectedEvent.time}
              </div>

              <div style={{ marginBottom: '8px' }}>
                <strong>Durée:</strong> {selectedEvent.duration} minutes
              </div>

              {selectedEvent.description && (
                <div style={{ marginBottom: '8px' }}>
                  <strong>Description:</strong>
                  <div>{selectedEvent.description}</div>
                </div>
              )}

              {selectedEvent.invites && selectedEvent.invites.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                  <strong>Invités:</strong>
                  <div>{selectedEvent.invites.join(', ')}</div>
                </div>
              )}

              {selectedEvent.recurrence !== 'NONE' && (
                <div style={{ marginBottom: '8px' }}>
                  <strong>Récurrence:</strong> {selectedEvent.recurrence}
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};
