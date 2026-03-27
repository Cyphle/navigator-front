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
    creator: {
      id: 1,
      usernameOrEmail: 'sarah.martin',
      relation: 'PARENT',
      isAdmin: true
    },
    members: [
      { id: 2, usernameOrEmail: 'leo.martin', relation: 'CHILD', isAdmin: false },
      { id: 3, usernameOrEmail: 'emma.martin', relation: 'CHILD', isAdmin: false },
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

  test('renders family details', () => {
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

    expect(screen.getByText('Famille Martin')).toBeInTheDocument();
    expect(screen.getByText('3 membres')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer une famille/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /modifier/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /désactiver/i })).toBeInTheDocument();
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

    fireEvent.click(screen.getByRole('button', { name: /créer une famille/i }));

    const dialog = await screen.findByRole('dialog');
    const submitButton = within(dialog).getByRole('button', { name: /créer/i });

    expect(submitButton).toBeDisabled();
  });

  test('submits when family form is valid and closes the dialog', async () => {
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

    fireEvent.click(screen.getByRole('button', { name: /créer une famille/i }));

    const dialog = await screen.findByRole('dialog');

    fireEvent.change(within(dialog).getByPlaceholderText('Nom de la famille'), { target: { value: 'Famille Doe' } });

    const submitButton = within(dialog).getByRole('button', { name: /créer/i });
    await waitFor(() => expect(submitButton).toBeEnabled());

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createFamilyMock).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Famille Doe',
        creatorRelation: 'PARENT',
        members: [],
      }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
