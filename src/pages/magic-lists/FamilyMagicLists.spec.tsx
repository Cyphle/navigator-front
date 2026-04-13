import { render, screen } from '../../../test-utils';
import { FamilyMagicLists } from './FamilyMagicLists';
import {
  useFetchMagicListsSummary,
  useFetchMagicListById,
  useCreateMagicList,
  useDeleteMagicList,
  useAddItemToMagicList,
  useUpdateItemInMagicList,
  useDeleteItemFromMagicList,
  useClearCompletedMagicListItems,
} from '../../stores/magic-lists/magic-lists.queries';
import { useFetchFamilies } from '../../stores/families/families.queries';
import { fireEvent } from '@testing-library/react';
import { aMagicListSummary } from '../../../test-utils/factories';

jest.mock('../../stores/magic-lists/magic-lists.queries', () => ({
  useFetchMagicListsSummary: jest.fn(),
  useFetchMagicListById: jest.fn(),
  useCreateMagicList: jest.fn(),
  useDeleteMagicList: jest.fn(),
  useAddItemToMagicList: jest.fn(),
  useUpdateItemInMagicList: jest.fn(),
  useDeleteItemFromMagicList: jest.fn(),
  useClearCompletedMagicListItems: jest.fn(),
}));

jest.mock('../../stores/families/families.queries', () => ({
  useFetchFamilies: jest.fn(),
}));

const noopMutation = { mutate: jest.fn(), isPending: false };

const setupMutations = () => {
  (useCreateMagicList as jest.Mock).mockReturnValue(noopMutation);
  (useDeleteMagicList as jest.Mock).mockReturnValue(noopMutation);
  (useAddItemToMagicList as jest.Mock).mockReturnValue(noopMutation);
  (useUpdateItemInMagicList as jest.Mock).mockReturnValue(noopMutation);
  (useDeleteItemFromMagicList as jest.Mock).mockReturnValue(noopMutation);
  (useClearCompletedMagicListItems as jest.Mock).mockReturnValue(noopMutation);
  (useFetchFamilies as jest.Mock).mockReturnValue({ data: [] });
  (useFetchMagicListById as jest.Mock).mockReturnValue({ data: undefined });
};

describe('FamilyMagicLists', () => {
  beforeEach(setupMutations);
  afterEach(() => jest.clearAllMocks());

  test('shows loading state', () => {
    (useFetchMagicListsSummary as jest.Mock).mockReturnValue({ isPending: true, isError: false });

    render(<FamilyMagicLists />);

    expect(screen.getByText('Chargement des listes...')).toBeInTheDocument();
  });

  test('shows error state', () => {
    (useFetchMagicListsSummary as jest.Mock).mockReturnValue({ isPending: false, isError: true });

    render(<FamilyMagicLists />);

    expect(screen.getByText('Une erreur est survenue lors du chargement.')).toBeInTheDocument();
  });

  test('shows empty state when no lists', () => {
    (useFetchMagicListsSummary as jest.Mock).mockReturnValue({ data: [], isPending: false, isError: false });

    render(<FamilyMagicLists />);

    expect(screen.getByText('Aucune liste de todos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer ma première liste/i })).toBeInTheDocument();
  });

  test('renders list of magic lists', () => {
    const overviews = [
      aMagicListSummary({ id: 1, name: 'Tâches ménagères', visibility: 'PERSONAL', itemCount: 1 }),
      aMagicListSummary({ id: 2, name: 'Courses familiales', visibility: 'SHARED', itemCount: 0 }),
    ];
    (useFetchMagicListsSummary as jest.Mock).mockReturnValue({ data: overviews, isPending: false, isError: false });

    render(<FamilyMagicLists />);

    expect(screen.getByText('Tâches ménagères')).toBeInTheDocument();
    expect(screen.getByText('Courses familiales')).toBeInTheDocument();
  });

  test('opens create form when "Nouvelle liste" is clicked', () => {
    (useFetchMagicListsSummary as jest.Mock).mockReturnValue({ data: [aMagicListSummary()], isPending: false, isError: false });

    render(<FamilyMagicLists />);

    fireEvent.click(screen.getByRole('button', { name: /nouvelle liste/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('opens create form from empty state CTA', () => {
    (useFetchMagicListsSummary as jest.Mock).mockReturnValue({ data: [], isPending: false, isError: false });

    render(<FamilyMagicLists />);

    fireEvent.click(screen.getByRole('button', { name: /créer ma première liste/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
