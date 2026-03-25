import { render, screen, fireEvent } from '../../../../test-utils';
import { waitFor } from '@testing-library/react';
import { AddBudgetDialog } from './AddBudgetDialog';

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  isPending: false,
};

describe('AddBudgetDialog', () => {
  test('renders the dialog when open', () => {
    render(<AddBudgetDialog {...defaultProps} />);
    expect(screen.getByText('Nouveau budget')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(<AddBudgetDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Nouveau budget')).not.toBeInTheDocument();
  });

  test('submit button is disabled when form is empty', () => {
    render(<AddBudgetDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Ajouter' })).toBeDisabled();
  });

  test('clicking Annuler calls onClose', () => {
    const onClose = jest.fn();
    render(<AddBudgetDialog {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByText('Annuler'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onSubmit with correct values when form is valid', async () => {
    const onSubmit = jest.fn();
    render(<AddBudgetDialog {...defaultProps} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Ex : Alimentation'), { target: { value: 'Alimentation' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '400' } });

    await waitFor(() => expect(screen.getByRole('button', { name: 'Ajouter' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Alimentation' }))
    );
  });
});
