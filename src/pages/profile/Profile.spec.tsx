import { render, screen } from '../../../test-utils';
import { UserContextProvider } from '../../contexts/user/user.context';
import { useFetchFamilies } from '../../stores/families/families.queries';
import { Profile } from './Profile';

jest.mock('../../stores/families/families.queries.ts', () => ({
  useFetchFamilies: jest.fn(),
}));

const mockFamilies = [
  {
    id: 1,
    name: 'Famille Martin',
    creator: {
      id: 1,
      username: 'john.doe',
      relation: 'PARENT',
      isAdmin: true
    },
    members: [
      { id: 2, username: 'emma', relation: 'SISTER', isAdmin: false }
    ],
    status: 'ACTIVE'
  },
  {
    id: 2,
    name: 'Famille Dupont',
    creator: {
      id: 3,
      username: 'claire',
      relation: 'PARENT',
      isAdmin: true
    },
    members: [
      { id: 4, username: 'john.doe', relation: 'PARENT', isAdmin: false }
    ],
    status: 'ACTIVE'
  }
];

describe('Profile', () => {
  test('renders base user information and roles', () => {
    (useFetchFamilies as jest.Mock).mockImplementation(() => ({
      data: mockFamilies,
      isPending: false,
      isError: false
    }));

    render(
      <UserContextProvider initialUser={{ username: 'john.doe', email: 'john.doe@banana.fr', firstName: 'John', lastName: 'Doe' }}>
        <Profile />
      </UserContextProvider>
    );

    expect(screen.getByText('Informations')).toBeInTheDocument();
    expect(screen.getByText('john.doe')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@banana.fr')).toBeInTheDocument();

    expect(screen.getByText('Mon rôle')).toBeInTheDocument();
    expect(screen.getAllByText('Parent').length).toBeGreaterThanOrEqual(1);
  });

  test('renders families list with roles', () => {
    (useFetchFamilies as jest.Mock).mockImplementation(() => ({
      data: mockFamilies,
      isPending: false,
      isError: false
    }));

    render(
      <UserContextProvider initialUser={{ username: 'john.doe', email: 'john.doe@banana.fr', firstName: 'John', lastName: 'Doe' }}>
        <Profile />
      </UserContextProvider>
    );

    expect(screen.getByText('Familles')).toBeInTheDocument();
    expect(screen.getByText('Famille Martin')).toBeInTheDocument();
    expect(screen.getByText('Famille Dupont')).toBeInTheDocument();
    expect(screen.getAllByText('2 membres')).toHaveLength(2);
    expect(screen.getAllByText('Father').length).toBeGreaterThanOrEqual(1);
  });
});
