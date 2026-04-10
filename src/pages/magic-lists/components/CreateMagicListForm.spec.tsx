import { render, screen } from '../../../../test-utils';
import { CreateMagicListForm } from './CreateMagicListForm';
import { fireEvent, waitFor } from '@testing-library/react';
import type { Family } from '../../../stores/families/families.types';

const aFamily = (overrides: Partial<Family> = {}): Family => ({
  id: 1,
  name: 'Famille Martin',
  creator: { id: 10, usernameOrEmail: 'alice', relation: 'PARENT', isAdmin: true },
  members: [
    { id: 11, usernameOrEmail: 'bob', relation: 'PARENT', isAdmin: false },
    { id: 12, usernameOrEmail: 'charlie', relation: 'CHILD', isAdmin: false },
  ],
  status: 'ACTIVE',
  ...overrides,
});

describe('CreateMagicListForm', () => {
  test('does not render when closed', () => {
    render(
      <CreateMagicListForm open={false} onCancel={jest.fn()} onSubmit={jest.fn()} families={[]} />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('submit button is disabled when name is empty', () => {
    render(
      <CreateMagicListForm open onCancel={jest.fn()} onSubmit={jest.fn()} families={[]} />
    );

    expect(screen.getByRole('button', { name: /créer/i })).toBeDisabled();
  });

  test('submit button is enabled when name is filled', async () => {
    render(
      <CreateMagicListForm open onCancel={jest.fn()} onSubmit={jest.fn()} families={[]} />
    );

    fireEvent.change(screen.getByPlaceholderText(/liste de courses/i), {
      target: { value: 'Nouvelle liste' },
    });

    await waitFor(() => expect(screen.getByRole('button', { name: /créer/i })).toBeEnabled());
  });

  test('submits with SIMPLE kind and PERSONAL type by default', async () => {
    const onSubmit = jest.fn();

    render(
      <CreateMagicListForm open onCancel={jest.fn()} onSubmit={onSubmit} families={[]} />
    );

    fireEvent.change(screen.getByPlaceholderText(/liste de courses/i), {
      target: { value: 'Mes courses' },
    });

    await waitFor(() => expect(screen.getByRole('button', { name: /créer/i })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: /créer/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Mes courses',
        kind: 'SIMPLE',
        type: 'PERSONAL',
        familyId: undefined,
        excludedMemberIds: undefined,
      })
    );
  });

  test('submits with TASK kind when selected', async () => {
    const onSubmit = jest.fn();

    render(
      <CreateMagicListForm open onCancel={jest.fn()} onSubmit={onSubmit} families={[]} />
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
        kind: 'TASK',
        type: 'PERSONAL',
        familyId: undefined,
        excludedMemberIds: undefined,
      })
    );
  });

  test('submits with TEMPLATE kind when selected', async () => {
    const onSubmit = jest.fn();

    render(
      <CreateMagicListForm open onCancel={jest.fn()} onSubmit={onSubmit} families={[]} />
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
        kind: 'TEMPLATE',
        type: 'PERSONAL',
        familyId: undefined,
        excludedMemberIds: undefined,
      })
    );
  });

  test('cancel button calls onCancel', () => {
    const onCancel = jest.fn();

    render(
      <CreateMagicListForm open onCancel={onCancel} onSubmit={jest.fn()} families={[]} />
    );

    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('shows family selector when SHARED type is selected and families exist', async () => {
    render(
      <CreateMagicListForm open onCancel={jest.fn()} onSubmit={jest.fn()} families={[aFamily()]} />
    );

    fireEvent.click(screen.getByRole('button', { name: /partagée/i }));

    await waitFor(() => expect(screen.getByText('Sélectionner une famille')).toBeInTheDocument());
  });

  test('shows warning when SHARED is selected and no families exist', async () => {
    render(
      <CreateMagicListForm open onCancel={jest.fn()} onSubmit={jest.fn()} families={[]} />
    );

    fireEvent.click(screen.getByRole('button', { name: /partagée/i }));

    await waitFor(() => expect(screen.getByText(/vous n'avez aucune famille/i)).toBeInTheDocument());
  });

  test('shows family members after selecting a family', async () => {
    render(
      <CreateMagicListForm open onCancel={jest.fn()} onSubmit={jest.fn()} families={[aFamily()]} />
    );

    fireEvent.click(screen.getByRole('button', { name: /partagée/i }));
    await waitFor(() => expect(screen.getByText('Sélectionner une famille')).toBeInTheDocument());

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });

    await waitFor(() => {
      expect(screen.getByText('alice')).toBeInTheDocument();
      expect(screen.getByText('bob')).toBeInTheDocument();
      expect(screen.getByText('charlie')).toBeInTheDocument();
    });
  });

  test('excludes selected members from the payload', async () => {
    const onSubmit = jest.fn();
    const family = aFamily();

    render(
      <CreateMagicListForm open onCancel={jest.fn()} onSubmit={onSubmit} families={[family]} />
    );

    fireEvent.change(screen.getByPlaceholderText(/liste de courses/i), {
      target: { value: 'Liste partagée' },
    });
    fireEvent.click(screen.getByRole('button', { name: /partagée/i }));
    await waitFor(() => expect(screen.getByText('Sélectionner une famille')).toBeInTheDocument());

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    await waitFor(() => expect(screen.getByText('bob')).toBeInTheDocument());

    fireEvent.click(screen.getAllByRole('checkbox')[1]); // bob (index 1 : alice=0, bob=1, charlie=2)

    await waitFor(() => expect(screen.getByRole('button', { name: /créer/i })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: /créer/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Liste partagée',
        kind: 'SIMPLE',
        type: 'SHARED',
        familyId: 1,
        excludedMemberIds: [11],
      })
    );
  });

  test('sends no excludedMemberIds when no member is excluded', async () => {
    const onSubmit = jest.fn();
    const family = aFamily();

    render(
      <CreateMagicListForm open onCancel={jest.fn()} onSubmit={onSubmit} families={[family]} />
    );

    fireEvent.change(screen.getByPlaceholderText(/liste de courses/i), {
      target: { value: 'Liste partagée' },
    });
    fireEvent.click(screen.getByRole('button', { name: /partagée/i }));
    await waitFor(() => expect(screen.getByText('Sélectionner une famille')).toBeInTheDocument());

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    await waitFor(() => expect(screen.getByText('alice')).toBeInTheDocument());

    await waitFor(() => expect(screen.getByRole('button', { name: /créer/i })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: /créer/i }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Liste partagée',
        kind: 'SIMPLE',
        type: 'SHARED',
        familyId: 1,
        excludedMemberIds: undefined,
      })
    );
  });
});
