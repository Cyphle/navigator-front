import { render, screen, fireEvent } from '../../../../test-utils';
import { waitFor } from '@testing-library/react';
import { AddBudgetExpenseDialog } from './AddBudgetExpenseDialog';

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  isPending: false,
};

describe('AddBudgetExpenseDialog', () => {
  test('renders the dialog when open', () => {
    render(<AddBudgetExpenseDialog {...defaultProps} />);
    expect(screen.getByText('Nouvelle dépense sur budget')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(<AddBudgetExpenseDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Nouvelle dépense sur budget')).not.toBeInTheDocument();
  });

  test('submit button is disabled when form is empty', () => {
    render(<AddBudgetExpenseDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Ajouter' })).toBeDisabled();
  });

  test('clicking Annuler calls onClose', () => {
    const onClose = jest.fn();
    render(<AddBudgetExpenseDialog {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByText('Annuler'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onSubmit with correct values when form is valid', async () => {
    const onSubmit = jest.fn();
    render(<AddBudgetExpenseDialog {...defaultProps} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Ex : Courses du week-end'), { target: { value: 'Marché' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '50' } });

    await waitFor(() => expect(screen.getByRole('button', { name: 'Ajouter' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ description: 'Marché' }))
    );
  });
});
