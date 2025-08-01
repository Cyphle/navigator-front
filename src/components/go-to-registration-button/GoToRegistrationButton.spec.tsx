import { render } from '../../../test-utils';
import { fireEvent, screen } from '@testing-library/react'
import { GoToRegistrationButton } from './GoToRegistrationButton.tsx';
import { useNavigate } from 'react-router';

jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
}));

describe('Go to registration page button', () => {
  it('should render the button', () => {
    render(<GoToRegistrationButton/>);

    expect(screen.getByRole('button')).toHaveTextContent('S\'inscrire');
  });

  it('should prevent from accessing unknown organizations', () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);
    render(<GoToRegistrationButton />);

    fireEvent.click(screen.getByRole('button'));

    expect(mockNavigate).toHaveBeenCalledWith('/registration');
  });
});