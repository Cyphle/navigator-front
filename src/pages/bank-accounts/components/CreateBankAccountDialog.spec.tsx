import { render, screen, fireEvent } from '../../../../test-utils';
import { waitFor } from '@testing-library/react';
import { CreateBankAccountDialog } from './CreateBankAccountDialog';

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onSubmit: jest.fn(),
  isPending: false,
};

describe('CreateBankAccountDialog', () => {
  test('renders the dialog when open', () => {
    render(<CreateBankAccountDialog {...defaultProps} />);
    expect(screen.getByText('Nouveau compte bancaire')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(<CreateBankAccountDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Nouveau compte bancaire')).not.toBeInTheDocument();
  });

  test('submit button is disabled when form is empty', () => {
    render(<CreateBankAccountDialog {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Créer' })).toBeDisabled();
  });

  test('clicking Annuler calls onClose', () => {
    const onClose = jest.fn();
    render(<CreateBankAccountDialog {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByText('Annuler'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('shows visibility options', () => {
    render(<CreateBankAccountDialog {...defaultProps} />);
    expect(screen.getByText('Partagé')).toBeInTheDocument();
    expect(screen.getByText('Personnel')).toBeInTheDocument();
  });

  test('submit button becomes enabled after filling the name', async () => {
    render(<CreateBankAccountDialog {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText('Ex : Compte courant'), { target: { value: 'Mon compte' } });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Créer' })).toBeEnabled());
  });

  test('calls onSubmit with the account name when form is submitted', async () => {
    const onSubmit = jest.fn();
    render(<CreateBankAccountDialog {...defaultProps} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Ex : Compte courant'), { target: { value: 'Mon compte' } });

    await waitFor(() => expect(screen.getByRole('button', { name: 'Créer' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Créer' }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Mon compte' }))
    );
  });
});
