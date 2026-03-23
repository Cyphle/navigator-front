import { screen } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import NoFamilyOverlay from './NoFamilyOverlay';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('NoFamilyOverlay', () => {
  test('renders welcome message and CTA', () => {
    (useNavigate as jest.Mock).mockReturnValue(jest.fn());

    render(
      <MemoryRouter>
        <NoFamilyOverlay />
      </MemoryRouter>
    );

    expect(screen.getByText('Bienvenue sur Navigator')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créez votre première famille/i })).toBeInTheDocument();
  });

  test('CTA navigates to /families', () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    render(
      <MemoryRouter>
        <NoFamilyOverlay />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /créez votre première famille/i }));

    expect(navigate).toHaveBeenCalledWith('/families');
  });
});
