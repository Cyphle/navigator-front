import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { CreateUpdateFamily } from './CreateUpdateFamily';

describe('CreateUpdateFamily', () => {
  test('disables submit when name is empty', async () => {
    render(
      <CreateUpdateFamily
        isOpen
        isEditing={false}
        initialValues={{ name: '', creatorRelation: 'PARENT', members: [] }}
        isSubmitting={false}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    const dialog = await screen.findByRole('dialog');
    const submitButton = within(dialog).getByRole('button', { name: /creer/i });

    expect(submitButton).toBeDisabled();
  });

  test('enables submit when only a name is provided', async () => {
    render(
      <CreateUpdateFamily
        isOpen
        isEditing={false}
        initialValues={{ name: '', creatorRelation: 'PARENT', members: [] }}
        isSubmitting={false}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    const dialog = await screen.findByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText('Nom de la famille'), {
      target: { value: 'Famille Doe' },
    });

    await waitFor(() => {
      expect(within(dialog).getByRole('button', { name: /creer/i })).toBeEnabled();
    });
  });

  test('submits with name only and empty member list when no members provided', async () => {
    const onSubmit = jest.fn();

    render(
      <CreateUpdateFamily
        isOpen
        isEditing={false}
        initialValues={{ name: '', creatorRelation: 'PARENT', members: [] }}
        isSubmitting={false}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
      />
    );

    const dialog = await screen.findByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText('Nom de la famille'), {
      target: { value: 'Famille Doe' },
    });

    const submitButton = within(dialog).getByRole('button', { name: /creer/i });
    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Famille Doe',
        creatorRelation: 'PARENT',
        members: []
      });
    });
  });

  test('submits with members when provided', async () => {
    const onSubmit = jest.fn();

    render(
      <CreateUpdateFamily
        isOpen
        isEditing={false}
        initialValues={{ name: '', creatorRelation: 'PARENT', members: [] }}
        isSubmitting={false}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
      />
    );

    const dialog = await screen.findByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText('Nom de la famille'), {
      target: { value: 'Famille Doe' },
    });

    fireEvent.click(screen.getByRole('button', { name: /ajouter un membre/i }));

    const memberInput = screen.getByPlaceholderText("email ou nom d'utilisateur");
    fireEvent.change(memberInput, { target: { value: 'alice@doe.fr' } });

    const submitButton = within(dialog).getByRole('button', { name: /creer/i });
    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Famille Doe',
        creatorRelation: 'PARENT',
        members: [{ usernameOrEmail: 'alice@doe.fr', relation: 'PARENT', isAdmin: false }],
      });
    });
  });
});
