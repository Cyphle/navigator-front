import { render, screen } from '../../../test-utils';
import { UserContextProvider } from '../../contexts/user/user.context';
import { Families } from './Families';
import { useFetchFamilies } from '../../stores/families/families.queries';

jest.mock('../../stores/families/families.queries.ts', () => ({
  useFetchFamilies: jest.fn(),
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
});
