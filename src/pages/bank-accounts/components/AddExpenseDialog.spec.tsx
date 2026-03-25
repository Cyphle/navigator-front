import { render, screen, fireEvent } from '../../../../test-utils';
import { waitFor } from '@testing-library/react';
import { AddExpenseDialog } from './AddExpenseDialog';

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  isPending: false,
};

describe('AddExpenseDialog', () => {
  test('renders the dialog when open', () => {
    render(<AddExpenseDialog {...defaultProps} />);
    expect(screen.getByText('Nouvelle dépense')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(<AddExpenseDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Nouvelle dépense')).not.toBeInTheDocument();
  });

  test('submit button is disabled when form is empty', () => {
    render(<AddExpenseDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Ajouter' })).toBeDisabled();
  });

  test('clicking Annuler calls onClose', () => {
    const onClose = jest.fn();
    render(<AddExpenseDialog {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByText('Annuler'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onSubmit when form is valid and submitted', async () => {
    const onSubmit = jest.fn();
    render(<AddExpenseDialog {...defaultProps} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Ex : Restaurant'), { target: { value: 'Restaurant' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '45' } });

    await waitFor(() => expect(screen.getByRole('button', { name: 'Ajouter' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ description: 'Restaurant' }))
    );
  });
});
