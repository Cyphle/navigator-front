import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { CreateUpdateFamily } from './CreateUpdateFamily';

describe('CreateUpdateFamily', () => {
  test('disables submit when name is empty', async () => {
    render(
      <CreateUpdateFamily
        isOpen
        isEditing={false}
        initialValues={{ name: '', emails: '' }}
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
        initialValues={{ name: '', emails: '' }}
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

  test('submits with name only and empty member list when no emails provided', async () => {
    const onSubmit = jest.fn();

    render(
      <CreateUpdateFamily
        isOpen
        isEditing={false}
        initialValues={{ name: '', emails: '' }}
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
      expect(onSubmit).toHaveBeenCalledWith({ name: 'Famille Doe', memberEmails: [] });
    });
  });

  test('submits with parsed member emails when provided', async () => {
    const onSubmit = jest.fn();

    render(
      <CreateUpdateFamily
        isOpen
        isEditing={false}
        initialValues={{ name: '', emails: '' }}
        isSubmitting={false}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
      />
    );

    const dialog = await screen.findByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText('Nom de la famille'), {
      target: { value: 'Famille Doe' },
    });
    fireEvent.change(within(dialog).getByLabelText('Emails des membres'), {
      target: { value: 'alice@doe.fr, bob@doe.fr\nalice@doe.fr' },
    });

    const submitButton = within(dialog).getByRole('button', { name: /creer/i });
    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Famille Doe',
        memberEmails: ['alice@doe.fr', 'bob@doe.fr'],
      });
    });
  });
});
