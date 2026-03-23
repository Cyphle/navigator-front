import { render, screen } from '../../../../test-utils';
import { CreateTodoListForm } from './CreateTodoListForm';
import { fireEvent, waitFor } from '@testing-library/react';

describe('CreateTodoListForm', () => {
  test('does not render when closed', () => {
    render(
      <CreateTodoListForm open={false} onCancel={jest.fn()} onSubmit={jest.fn()} families={[]} />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('submit button is disabled when name is empty', () => {
    render(
      <CreateTodoListForm open onCancel={jest.fn()} onSubmit={jest.fn()} families={[]} />
    );

    expect(screen.getByRole('button', { name: /créer/i })).toBeDisabled();
  });

  test('submit button is enabled when name is filled', async () => {
    render(
      <CreateTodoListForm open onCancel={jest.fn()} onSubmit={jest.fn()} families={[]} />
    );

    fireEvent.change(screen.getByPlaceholderText(/tâches ménagères/i), {
      target: { value: 'Nouvelle liste' },
    });

    await waitFor(() => expect(screen.getByRole('button', { name: /créer/i })).toBeEnabled());
  });

  test('submits with correct values for personal list', async () => {
    const onSubmit = jest.fn();

    render(
      <CreateTodoListForm open onCancel={jest.fn()} onSubmit={onSubmit} families={[]} />
    );

    fireEvent.change(screen.getByPlaceholderText(/tâches ménagères/i), {
      target: { value: 'Tâches du foyer' },
    });

    await waitFor(() => expect(screen.getByRole('button', { name: /créer/i })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: /créer/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Tâches du foyer',
        type: 'PERSONAL',
        familyId: undefined,
      })
    );
  });

  test('cancel button calls onCancel', () => {
    const onCancel = jest.fn();

    render(
      <CreateTodoListForm open onCancel={onCancel} onSubmit={jest.fn()} families={[]} />
    );

    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('shows family selector when SHARED type is selected and families exist', async () => {
    const families = [{ id: 1, name: 'Famille Martin', owner: { id: 1, email: 'a@b.fr', relation: 'Owner' }, members: [], status: 'ACTIVE' as const }];

    render(
      <CreateTodoListForm open onCancel={jest.fn()} onSubmit={jest.fn()} families={families} />
    );

    fireEvent.click(screen.getByRole('button', { name: /partagée/i }));

    await waitFor(() => expect(screen.getByText('Sélectionner une famille')).toBeInTheDocument());
  });

  test('shows warning when SHARED is selected and no families exist', async () => {
    render(
      <CreateTodoListForm open onCancel={jest.fn()} onSubmit={jest.fn()} families={[]} />
    );

    fireEvent.click(screen.getByRole('button', { name: /partagée/i }));

    await waitFor(() => expect(screen.getByText(/vous n'avez aucune famille/i)).toBeInTheDocument());
  });
});
