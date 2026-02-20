import { render, screen } from '../../../test-utils';
import { UserContextProvider } from '../../contexts/user/user.context';
import { Families } from './Families';
import { useFetchFamilies } from '../../stores/families/families.queries';
import { useCreateFamily, useUpdateFamily } from '../../stores/families/families.commands';
import { fireEvent, waitFor, within } from '@testing-library/react';

jest.mock('../../stores/families/families.queries.ts', () => ({
  useFetchFamilies: jest.fn(),
}));

jest.mock('../../stores/families/families.commands.ts', () => ({
  useCreateFamily: jest.fn(),
  useUpdateFamily: jest.fn(),
}));

const mockFamilies = [
  {
    id: 1,
    name: 'Famille Martin',
    owner: {
      id: 1,
      email: 'sarah.martin@banana.fr',
      role: 'Owner',
      relation: 'Owner'
    },
    members: [
      { id: 2, email: 'leo.martin@banana.fr', role: 'Member', relation: 'Son' },
      { id: 3, email: 'emma.martin@banana.fr', role: 'Member', relation: 'Daughter' },
    ],
    status: 'ACTIVE'
  }
];

describe('Families', () => {
  beforeEach(() => {
    (useCreateFamily as jest.Mock).mockImplementation(() => ({
      mutate: jest.fn(),
      isPending: false,
    }));
    (useUpdateFamily as jest.Mock).mockImplementation(() => ({
      mutate: jest.fn(),
      isPending: false,
    }));
  });

  test('renders title and family details', () => {
    (useFetchFamilies as jest.Mock).mockImplementation(() => ({
      data: mockFamilies,
      isPending: false,
      isError: false
    }));

    render(
      <UserContextProvider initialUser={{ username: 'john', email: 'john@doe.fr', firstName: 'John', lastName: 'Doe' }}>
        <Families />
      </UserContextProvider>
    );

    expect(screen.getByText('Familles')).toBeInTheDocument();
    expect(screen.getByText('Famille Martin')).toBeInTheDocument();
    expect(screen.getByText('3 membres')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /creer une famille/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /modifier/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /desactiver/i })).toBeInTheDocument();
  });

  test('disables submit when family form is invalid', async () => {
    (useFetchFamilies as jest.Mock).mockImplementation(() => ({
      data: mockFamilies,
      isPending: false,
      isError: false
    }));

    render(
      <UserContextProvider initialUser={{ username: 'john', email: 'john@doe.fr', firstName: 'John', lastName: 'Doe' }}>
        <Families />
      </UserContextProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /creer une famille/i }));

    const dialog = await screen.findByRole('dialog');
    const submitButton = within(dialog).getByRole('button', { name: /creer/i });

    expect(submitButton).toBeDisabled();
  });

  test('submits when family form is valid', async () => {
    const createFamilyMock = jest.fn();
    (useCreateFamily as jest.Mock).mockImplementation(() => ({
      mutate: createFamilyMock,
      isPending: false,
    }));
    (useFetchFamilies as jest.Mock).mockImplementation(() => ({
      data: mockFamilies,
      isPending: false,
      isError: false
    }));

    render(
      <UserContextProvider initialUser={{ username: 'john', email: 'john@doe.fr', firstName: 'John', lastName: 'Doe' }}>
        <Families />
      </UserContextProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /creer une famille/i }));

    const dialog = await screen.findByRole('dialog');

    fireEvent.change(within(dialog).getByLabelText('Nom de la famille'), { target: { value: 'Famille Doe' } });
    fireEvent.change(within(dialog).getByLabelText('Emails des membres'), { target: { value: 'alice@doe.fr' } });

    const submitButton = within(dialog).getByRole('button', { name: /creer/i });
    await waitFor(() => expect(submitButton).toBeEnabled());

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createFamilyMock).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Famille Doe',
        ownerEmail: 'john@doe.fr',
        ownerName: 'John Doe',
        memberEmails: ['alice@doe.fr'],
      }));
    });
  });
});
