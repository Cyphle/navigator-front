import { render, screen } from '../../../test-utils';
import { FamilyTodos } from './FamilyTodos';
import {
  useFetchAllTodoLists,
  useFetchTodoListById,
  useCreateTodoList,
  useDeleteTodoList,
  useAddItemToTodoList,
  useUpdateItemInTodoList,
  useDeleteItemFromTodoList,
  useClearCompletedTodos,
} from '../../stores/family-todos/family-todos.queries';
import { useFetchFamilies } from '../../stores/families/families.queries';
import { fireEvent } from '@testing-library/react';
import { aTodoList, aTodoItem } from '../../../test-utils/factories';

jest.mock('../../stores/family-todos/family-todos.queries', () => ({
  useFetchAllTodoLists: jest.fn(),
  useFetchTodoListById: jest.fn(),
  useCreateTodoList: jest.fn(),
  useDeleteTodoList: jest.fn(),
  useAddItemToTodoList: jest.fn(),
  useUpdateItemInTodoList: jest.fn(),
  useDeleteItemFromTodoList: jest.fn(),
  useClearCompletedTodos: jest.fn(),
}));

jest.mock('../../stores/families/families.queries', () => ({
  useFetchFamilies: jest.fn(),
}));

const noopMutation = { mutate: jest.fn(), isPending: false };

const setupMutations = () => {
  (useCreateTodoList as jest.Mock).mockReturnValue(noopMutation);
  (useDeleteTodoList as jest.Mock).mockReturnValue(noopMutation);
  (useAddItemToTodoList as jest.Mock).mockReturnValue(noopMutation);
  (useUpdateItemInTodoList as jest.Mock).mockReturnValue(noopMutation);
  (useDeleteItemFromTodoList as jest.Mock).mockReturnValue(noopMutation);
  (useClearCompletedTodos as jest.Mock).mockReturnValue(noopMutation);
  (useFetchFamilies as jest.Mock).mockReturnValue({ data: [] });
  (useFetchTodoListById as jest.Mock).mockReturnValue({ data: undefined });
};

describe('FamilyTodos', () => {
  beforeEach(setupMutations);
  afterEach(() => jest.clearAllMocks());

  test('shows loading state', () => {
    (useFetchAllTodoLists as jest.Mock).mockReturnValue({ isPending: true, isError: false });

    render(<FamilyTodos />);

    expect(screen.getByText('Chargement des listes...')).toBeInTheDocument();
  });

  test('shows error state', () => {
    (useFetchAllTodoLists as jest.Mock).mockReturnValue({ isPending: false, isError: true });

    render(<FamilyTodos />);

    expect(screen.getByText('Une erreur est survenue lors du chargement.')).toBeInTheDocument();
  });

  test('shows empty state when no lists', () => {
    (useFetchAllTodoLists as jest.Mock).mockReturnValue({ data: [], isPending: false, isError: false });

    render(<FamilyTodos />);

    expect(screen.getByText('Aucune liste de todos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer ma première liste/i })).toBeInTheDocument();
  });

  test('renders list of todos', () => {
    const lists = [
      aTodoList({ id: 1, name: 'Tâches ménagères', type: 'PERSONAL', items: [aTodoItem()] }),
      aTodoList({ id: 2, name: 'Courses familiales', type: 'SHARED' }),
    ];
    (useFetchAllTodoLists as jest.Mock).mockReturnValue({ data: lists, isPending: false, isError: false });

    render(<FamilyTodos />);

    expect(screen.getByText('Tâches ménagères')).toBeInTheDocument();
    expect(screen.getByText('Courses familiales')).toBeInTheDocument();
  });

  test('opens create form when "Nouvelle liste" is clicked', () => {
    (useFetchAllTodoLists as jest.Mock).mockReturnValue({ data: [aTodoList()], isPending: false, isError: false });

    render(<FamilyTodos />);

    fireEvent.click(screen.getByRole('button', { name: /nouvelle liste/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('opens create form from empty state CTA', () => {
    (useFetchAllTodoLists as jest.Mock).mockReturnValue({ data: [], isPending: false, isError: false });

    render(<FamilyTodos />);

    fireEvent.click(screen.getByRole('button', { name: /créer ma première liste/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
