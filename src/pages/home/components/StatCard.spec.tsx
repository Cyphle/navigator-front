import { render, screen } from '../../../../test-utils';
import { StatCard } from './StatCard';

describe('StatCard', () => {
  const baseProps = {
    title: 'Tâches en cours',
    value: 7,
    subtitle: 'tâches actives',
    icon: <span data-testid="stat-icon" />,
    iconColor: '#000',
    iconBg: '#eee',
  };

  test('renders value, subtitle and title', () => {
    render(<StatCard {...baseProps} />);

    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('tâches actives')).toBeInTheDocument();
    expect(screen.getByText('Tâches en cours')).toBeInTheDocument();
  });

  test('renders icon', () => {
    render(<StatCard {...baseProps} />);

    expect(screen.getByTestId('stat-icon')).toBeInTheDocument();
  });
});
