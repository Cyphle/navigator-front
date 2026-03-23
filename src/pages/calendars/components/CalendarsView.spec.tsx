import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { CalendarsView } from './CalendarsView';
import { aCalendar, aCalendarEvent } from '../../../../test-utils/factories';

describe('CalendarsView', () => {
  const onCreateCalendar = jest.fn();
  const onDeleteCalendar = jest.fn();
  const onCreateEvent = jest.fn();
  const onUpdateEvent = jest.fn();
  const onDeleteEvent = jest.fn();

  const defaultProps = {
    calendars: [],
    onCreateCalendar,
    onDeleteCalendar,
    onCreateEvent,
    onUpdateEvent,
    onDeleteEvent,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders calendar filter chips for each calendar', () => {
    const calendars = [
      aCalendar({ id: 1, name: 'Perso', color: '#1890ff' }),
      aCalendar({ id: 2, name: 'Famille', color: '#52c41a', type: 'SHARED' }),
    ];

    render(<CalendarsView {...defaultProps} calendars={calendars} />);

    // Each calendar name appears in the toolbar chip + management section
    expect(screen.getAllByText('Perso').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Famille').length).toBeGreaterThanOrEqual(1);
  });

  test('renders "Nouveau" button and calls onCreateCalendar when clicked', () => {
    render(<CalendarsView {...defaultProps} />);

    fireEvent.click(screen.getByText('Nouveau'));

    expect(onCreateCalendar).toHaveBeenCalled();
  });

  test('renders navigation buttons', () => {
    render(<CalendarsView {...defaultProps} />);

    expect(screen.getByLabelText('Précédent')).toBeInTheDocument();
    expect(screen.getByLabelText('Suivant')).toBeInTheDocument();
  });

  test('renders view mode buttons', () => {
    render(<CalendarsView {...defaultProps} />);

    expect(screen.getByText('Mois')).toBeInTheDocument();
    expect(screen.getByText('Semaine')).toBeInTheDocument();
    expect(screen.getByText('Année')).toBeInTheDocument();
  });

  test('shows "Mes calendriers" management section when calendars exist', () => {
    const calendars = [aCalendar({ id: 1, name: 'Perso' })];

    render(<CalendarsView {...defaultProps} calendars={calendars} />);

    expect(screen.getByText('Mes calendriers')).toBeInTheDocument();
  });

  test('does not show management section when no calendars', () => {
    render(<CalendarsView {...defaultProps} calendars={[]} />);

    expect(screen.queryByText('Mes calendriers')).not.toBeInTheDocument();
  });

  test('calls onDeleteCalendar when delete button clicked in management section', () => {
    const calendars = [aCalendar({ id: 1, name: 'Perso' })];

    render(<CalendarsView {...defaultProps} calendars={calendars} />);

    fireEvent.click(screen.getByLabelText('Supprimer Perso'));

    expect(onDeleteCalendar).toHaveBeenCalledWith(1);
  });

  test('calls onCreateEvent when "Événement" button clicked in management section', () => {
    const calendars = [aCalendar({ id: 1, name: 'Perso' })];

    render(<CalendarsView {...defaultProps} calendars={calendars} />);

    fireEvent.click(screen.getByText('Événement'));

    expect(onCreateEvent).toHaveBeenCalledWith(1);
  });

  test('shows event detail dialog when event chip is clicked', () => {
    const event = aCalendarEvent({ id: 1, title: 'Réunion', date: '2026-03-23', time: '10:00', duration: 60, recurrence: 'NONE' });
    const calendars = [aCalendar({ id: 1, name: 'Perso', events: [event] })];

    render(<CalendarsView {...defaultProps} calendars={calendars} />);

    fireEvent.click(screen.getByText(/Réunion/));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getAllByText('Réunion').length).toBeGreaterThan(0);
  });

  test('calls onDeleteEvent when delete button clicked in event detail dialog', () => {
    const event = aCalendarEvent({ id: 1, title: 'Réunion', date: '2026-03-23', time: '10:00', duration: 60, recurrence: 'NONE', calendarId: 1 });
    const calendars = [aCalendar({ id: 1, name: 'Perso', events: [event] })];

    render(<CalendarsView {...defaultProps} calendars={calendars} />);

    fireEvent.click(screen.getByText(/Réunion/));
    fireEvent.click(screen.getByText('Supprimer'));

    expect(onDeleteEvent).toHaveBeenCalledWith(1, 1);
  });
});
