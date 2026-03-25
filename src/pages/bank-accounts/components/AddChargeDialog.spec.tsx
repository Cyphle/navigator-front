import { render, screen, fireEvent } from '../../../../test-utils';
import { waitFor } from '@testing-library/react';
import { AddChargeDialog } from './AddChargeDialog';

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  isPending: false,
};

describe('AddChargeDialog', () => {
  test('renders the dialog when open', () => {
    render(<AddChargeDialog {...defaultProps} />);
    expect(screen.getByText('Nouvelle charge')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(<AddChargeDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Nouvelle charge')).not.toBeInTheDocument();
  });

  test('submit button is disabled when form is empty', () => {
    render(<AddChargeDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Ajouter' })).toBeDisabled();
  });

  test('clicking Annuler calls onClose', () => {
    const onClose = jest.fn();
    render(<AddChargeDialog {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByText('Annuler'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('shows periodicity options', () => {
    render(<AddChargeDialog {...defaultProps} />);
    expect(screen.getByText('Mensuelle')).toBeInTheDocument();
    expect(screen.getByText('Annuelle')).toBeInTheDocument();
  });

  test('calls onSubmit when form is valid and submitted', async () => {
    const onSubmit = jest.fn();
    render(<AddChargeDialog {...defaultProps} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Ex : Loyer'), { target: { value: 'Loyer' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '900' } });

    await waitFor(() => expect(screen.getByRole('button', { name: 'Ajouter' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ description: 'Loyer' }))
    );
  });
});
