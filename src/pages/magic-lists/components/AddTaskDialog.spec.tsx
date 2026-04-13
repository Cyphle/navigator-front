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
    render(<AddTaskDialog open={true} listType="SIMPLE" onClose={onClose} onSubmit={onSubmit} />);

    expect(screen.getByText('Ajouter un élément')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex : Acheter du lait')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(<AddTaskDialog open={false} listType="SIMPLE" onClose={onClose} onSubmit={onSubmit} />);

    expect(screen.queryByText('Ajouter un élément')).not.toBeInTheDocument();
  });

  test('submit button is disabled when title is empty', () => {
    render(<AddTaskDialog open={true} listType="SIMPLE" onClose={onClose} onSubmit={onSubmit} />);

    expect(screen.getByRole('button', { name: /ajouter/i })).toBeDisabled();
  });

  test('calls onClose when cancel button is clicked', () => {
    render(<AddTaskDialog open={true} listType="SIMPLE" onClose={onClose} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));

    expect(onClose).toHaveBeenCalled();
  });

  test('calls onSubmit with title and no status when status not selected', async () => {
    render(<AddTaskDialog open={true} listType="SIMPLE" onClose={onClose} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Ex : Acheter du lait'), {
      target: { value: 'Acheter du pain' },
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ajouter/i })).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /ajouter/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Acheter du pain', status: undefined })
      );
      expect(onClose).toHaveBeenCalled();
    });
  });

  test('shows checkbox field only for TASK lists', () => {
    const { rerender } = render(<AddTaskDialog open={true} listType="SIMPLE" onClose={onClose} onSubmit={onSubmit} />);

    expect(screen.queryByText('Déjà réalisé')).not.toBeInTheDocument();

    rerender(<AddTaskDialog open={true} listType="TASK" onClose={onClose} onSubmit={onSubmit} />);

    expect(screen.getByText('Déjà réalisé')).toBeInTheDocument();
  });
});
