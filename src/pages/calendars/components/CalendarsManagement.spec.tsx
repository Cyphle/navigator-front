import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { CalendarsManagement } from './CalendarsManagement';
import { aCalendar } from '../../../../test-utils/factories';

describe('CalendarsManagement', () => {
  const onCreateEvent = jest.fn();
  const onDeleteCalendar = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders nothing when calendars list is empty', () => {
    render(
      <CalendarsManagement calendars={[]} onCreateEvent={onCreateEvent} onDeleteCalendar={onDeleteCalendar} />
    );

    expect(screen.queryByText('Mes calendriers')).not.toBeInTheDocument();
  });

  test('renders each calendar name and type badge', () => {
    const calendars = [
      aCalendar({ id: 1, name: 'Perso', type: 'PERSONAL' }),
      aCalendar({ id: 2, name: 'Famille', type: 'SHARED' }),
    ];

    render(
      <CalendarsManagement calendars={calendars} onCreateEvent={onCreateEvent} onDeleteCalendar={onDeleteCalendar} />
    );

    expect(screen.getByText('Perso')).toBeInTheDocument();
    expect(screen.getByText('Personnel')).toBeInTheDocument();
    expect(screen.getByText('Famille')).toBeInTheDocument();
    expect(screen.getByText('Partagé')).toBeInTheDocument();
  });

  test('calls onCreateEvent with calendar id when "Événement" button is clicked', () => {
    const calendars = [aCalendar({ id: 7, name: 'Perso' })];

    render(
      <CalendarsManagement calendars={calendars} onCreateEvent={onCreateEvent} onDeleteCalendar={onDeleteCalendar} />
    );

    fireEvent.click(screen.getByText('Événement'));

    expect(onCreateEvent).toHaveBeenCalledWith(7);
  });

  test('calls onDeleteCalendar with calendar id when delete button is clicked', () => {
    const calendars = [aCalendar({ id: 7, name: 'Perso' })];

    render(
      <CalendarsManagement calendars={calendars} onCreateEvent={onCreateEvent} onDeleteCalendar={onDeleteCalendar} />
    );

    fireEvent.click(screen.getByLabelText('Supprimer Perso'));

    expect(onDeleteCalendar).toHaveBeenCalledWith(7);
  });
});
