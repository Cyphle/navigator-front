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
    owner: {
      id: 1,
      email: 'john.doe@banana.fr',
      role: 'Owner',
      relation: 'Owner'
    },
    members: [
      { id: 2, email: 'emma@banana.fr', role: 'Member', relation: 'Sister' }
    ],
    status: 'ACTIVE'
  },
  {
    id: 2,
    name: 'Famille Dupont',
    owner: {
      id: 3,
      email: 'claire@banana.fr',
      role: 'Owner',
      relation: 'Owner'
    },
    members: [
      { id: 4, email: 'john.doe@banana.fr', role: 'Member', relation: 'Father' }
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
    expect(screen.getAllByText('Owner').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Father').length).toBeGreaterThanOrEqual(1);
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
