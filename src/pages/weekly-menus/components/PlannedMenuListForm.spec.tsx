import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { PlannedMenuListForm } from './PlannedMenuListForm';

describe('PlannedMenuListForm', () => {
  test('does not render when closed', () => {
    render(
      <PlannedMenuListForm
        open={false}
        onCancel={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('renders form when open', async () => {
    render(
      <PlannedMenuListForm
        open={true}
        onCancel={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Nouvelle liste de menus planifiés')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Nom de la liste')).toBeInTheDocument();
    expect(screen.getByLabelText('Date de début')).toBeInTheDocument();
  });

  test('calls onCancel when cancel button clicked', async () => {
    const onCancel = jest.fn();

    render(
      <PlannedMenuListForm
        open={true}
        onCancel={onCancel}
        onSubmit={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: /annuler/i });
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });

  test('automatically calculates end date based on range', async () => {
    render(
      <PlannedMenuListForm
        open={true}
        onCancel={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Date de fin')).toBeInTheDocument();
    });

    // The end date field should be disabled
    const endDateInput = screen.getByLabelText('Date de fin');
    expect(endDateInput).toBeDisabled();
  });

  test('shows loading state on submit button when loading', async () => {
    render(
      <PlannedMenuListForm
        open={true}
        onCancel={jest.fn()}
        onSubmit={jest.fn()}
        isLoading={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /créer/i })).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /créer/i });

    // Ant Design loading button has the loading class
    expect(submitButton.className).toContain('ant-btn-loading');
  });
});
