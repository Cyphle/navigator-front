import { render, screen, fireEvent } from '../../../../test-utils';
import { waitFor } from '@testing-library/react';
import { AddCreditDialog } from './AddCreditDialog';

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  isPending: false,
};

describe('AddCreditDialog', () => {
  test('renders the dialog when open', () => {
    render(<AddCreditDialog {...defaultProps} />);
    expect(screen.getByText('Nouveau crédit')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(<AddCreditDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Nouveau crédit')).not.toBeInTheDocument();
  });

  test('submit button is disabled when form is empty', () => {
    render(<AddCreditDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Ajouter' })).toBeDisabled();
  });

  test('clicking Annuler calls onClose', () => {
    const onClose = jest.fn();
    render(<AddCreditDialog {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByText('Annuler'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onSubmit when form is valid and submitted', async () => {
    const onSubmit = jest.fn();
    render(<AddCreditDialog {...defaultProps} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Ex : Salaire'), { target: { value: 'Salaire' } });
    fireEvent.change(screen.getByPlaceholderText('0.00'), { target: { value: '2500' } });

    await waitFor(() => expect(screen.getByRole('button', { name: 'Ajouter' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Ajouter' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ description: 'Salaire' }))
    );
  });
});
