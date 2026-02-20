import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { CreateUpdateFamily } from './CreateUpdateFamily';

describe('CreateUpdateFamily', () => {
  test('disables submit when form is invalid', async () => {
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

  test('submits parsed values when form is valid', async () => {
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
      target: { value: '  Famille Doe  ' },
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
