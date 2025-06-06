import { render, screen } from '@testing-library/react';
import App from '../App';
import '@testing-library/jest-dom';

describe('App', () => {
  it('renders the heading', () => {
    render(<App />);
    expect(screen.getByText(/Unifiez la gestion/i)).toBeInTheDocument();
  });
});
