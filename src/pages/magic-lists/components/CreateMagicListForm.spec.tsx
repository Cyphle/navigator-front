import { render, screen } from '../../../../test-utils';
import { CreateMagicListForm } from './CreateMagicListForm';
import { fireEvent, waitFor } from '@testing-library/react';

describe('CreateMagicListForm', () => {
  test('does not render when closed', () => {
    render(
      <CreateMagicListForm open={false} onCancel={jest.fn()} onSubmit={jest.fn()} />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('submit button is disabled when name is empty', () => {
    render(
      <CreateMagicListForm open onCancel={jest.fn()} onSubmit={jest.fn()} />
    );

    expect(screen.getByRole('button', { name: /créer/i })).toBeDisabled();
  });

  test('submit button is enabled when name is filled', async () => {
    render(
      <CreateMagicListForm open onCancel={jest.fn()} onSubmit={jest.fn()} />
    );

    fireEvent.change(screen.getByPlaceholderText(/liste de courses/i), {
      target: { value: 'Nouvelle liste' },
    });

    await waitFor(() => expect(screen.getByRole('button', { name: /créer/i })).toBeEnabled());
  });

  test('submits with SIMPLE type and PERSONAL visibility by default', async () => {
    const onSubmit = jest.fn();

    render(
      <CreateMagicListForm open onCancel={jest.fn()} onSubmit={onSubmit} />
    );

    fireEvent.change(screen.getByPlaceholderText(/liste de courses/i), {
      target: { value: 'Mes courses' },
    });

    await waitFor(() => expect(screen.getByRole('button', { name: /créer/i })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: /créer/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Mes courses',
        type: 'SIMPLE',
        visibility: 'PERSONAL',
        familyId: undefined,
      })
    );
  });

  test('submits with TASK type when selected', async () => {
    const onSubmit = jest.fn();

    render(
      <CreateMagicListForm open onCancel={jest.fn()} onSubmit={onSubmit} />
    );

    fireEvent.change(screen.getByPlaceholderText(/liste de courses/i), {
      target: { value: 'Courses du weekend' },
    });
    fireEvent.click(screen.getByRole('button', { name: /tâches/i }));

    await waitFor(() => expect(screen.getByRole('button', { name: /créer/i })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: /créer/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Courses du weekend',
        type: 'TASK',
        visibility: 'PERSONAL',
        familyId: undefined,
      })
    );
  });

  test('submits with TEMPLATE type when selected', async () => {
    const onSubmit = jest.fn();

    render(
      <CreateMagicListForm open onCancel={jest.fn()} onSubmit={onSubmit} />
    );

    fireEvent.change(screen.getByPlaceholderText(/liste de courses/i), {
      target: { value: 'Avant les vacances' },
    });
    fireEvent.click(screen.getByRole('button', { name: /template/i }));

    await waitFor(() => expect(screen.getByRole('button', { name: /créer/i })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: /créer/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Avant les vacances',
        type: 'TEMPLATE',
        visibility: 'PERSONAL',
        familyId: undefined,
      })
    );
  });

  test('cancel button calls onCancel', () => {
    const onCancel = jest.fn();

    render(
      <CreateMagicListForm open onCancel={onCancel} onSubmit={jest.fn()} />
    );

    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('toggles to SHARED visibility when switch is clicked', async () => {
    render(
      <CreateMagicListForm open onCancel={jest.fn()} onSubmit={jest.fn()} familyId={1} />
    );

    expect(screen.getByText('Uniquement visible par vous')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('switch', { name: /partager avec la famille/i }));

    await waitFor(() => expect(screen.getByText('Visible par les membres de la famille')).toBeInTheDocument());
  });

  test('submits with SHARED visibility and familyId when switch is on', async () => {
    const onSubmit = jest.fn();

    render(
      <CreateMagicListForm open onCancel={jest.fn()} onSubmit={onSubmit} familyId={42} />
    );

    fireEvent.change(screen.getByPlaceholderText(/liste de courses/i), {
      target: { value: 'Liste partagée' },
    });
    fireEvent.click(screen.getByRole('switch', { name: /partager avec la famille/i }));

    await waitFor(() => expect(screen.getByRole('button', { name: /créer/i })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: /créer/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Liste partagée',
        type: 'SIMPLE',
        visibility: 'SHARED',
        familyId: 42,
      })
    );
  });
});
