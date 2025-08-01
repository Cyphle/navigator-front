import { render, screen } from '../../../test-utils';
import { Home } from './Home.tsx';

jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
}));

describe('Home', () => {
  test('should render', () => {
    render(<Home />);

    expect(screen.getByText('Banana')).toBeInTheDocument();
  })
});