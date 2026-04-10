import { fireEvent, screen, waitFor } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { AddTaskDialog } from './AddTaskDialog';

describe('AddTaskDialog', () => {
  const onClose = jest.fn();
  const onSubmit = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders when open', () => {
    render(<AddTaskDialog open={true} onClose={onClose} onSubmit={onSubmit} />);

    expect(screen.getByText('Ajouter une tâche')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex : Faire les courses')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(<AddTaskDialog open={false} onClose={onClose} onSubmit={onSubmit} />);

    expect(screen.queryByText('Ajouter une tâche')).not.toBeInTheDocument();
  });

  test('submit button is disabled when title is empty', () => {
    render(<AddTaskDialog open={true} onClose={onClose} onSubmit={onSubmit} />);

    expect(screen.getByRole('button', { name: /ajouter/i })).toBeDisabled();
  });

  test('calls onClose when cancel button is clicked', () => {
    render(<AddTaskDialog open={true} onClose={onClose} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));

    expect(onClose).toHaveBeenCalled();
  });

  test('calls onSubmit with correct values and closes on submit', async () => {
    render(<AddTaskDialog open={true} onClose={onClose} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Ex : Faire les courses'), {
      target: { value: 'Acheter du pain' },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ajouter/i })).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /ajouter/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Acheter du pain', status: 'TODO' })
      );
      expect(onClose).toHaveBeenCalled();
    });
  });
});
