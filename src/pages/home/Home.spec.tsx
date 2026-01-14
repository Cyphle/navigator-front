import { render, screen } from '../../../test-utils';
import { Home } from './Home.tsx';
import { useFetchDashboard } from '../../stores/dashboard/dashboard.queries.ts';

jest.mock('../../stores/dashboard/dashboard.queries.ts', () => ({
  useFetchDashboard: jest.fn(),
}));

describe('Home', () => {
  test('should render dashboard cards', () => {
    (useFetchDashboard as jest.Mock).mockImplementation(() => ({
      data: {
        agenda: [],
        todos: [],
        weeklyMenu: { weekLabel: 'Jul 9', days: [] },
        recipes: [],
        shopping: { items: 0 }
      },
      isPending: false,
      isError: false
    }));

    render(<Home />);

    expect(screen.getByText('Agenda familial')).toBeInTheDocument();
    expect(screen.getByText('Todos familiaux')).toBeInTheDocument();
    expect(screen.getByText('Menus de la semaine')).toBeInTheDocument();
  })
});
