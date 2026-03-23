import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { TodoListDetail } from './TodoListDetail';
import { aTodoList, aTodoItem } from '../../../../test-utils/factories';

describe('TodoListDetail', () => {
  const onBack = jest.fn();
  const onAddItem = jest.fn();
  const onUpdateItem = jest.fn();
  const onDeleteItem = jest.fn();
  const onClearCompleted = jest.fn();

  const defaultProps = {
    onBack,
    onAddItem,
    onUpdateItem,
    onDeleteItem,
    onClearCompleted,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders list name and type', () => {
    const list = aTodoList({ name: 'Courses de la semaine', type: 'PERSONAL' });

    render(<TodoListDetail {...defaultProps} list={list} />);

    expect(screen.getByText('Courses de la semaine')).toBeInTheDocument();
    expect(screen.getByText('Personnelle')).toBeInTheDocument();
  });

  test('calls onBack when back button is clicked', () => {
    const list = aTodoList();

    render(<TodoListDetail {...defaultProps} list={list} />);

    fireEvent.click(screen.getByText('Retour'));

    expect(onBack).toHaveBeenCalled();
  });

  test('shows empty state when list has no items', () => {
    const list = aTodoList({ items: [] });

    render(<TodoListDetail {...defaultProps} list={list} />);

    expect(screen.getByText('Aucune tâche pour le moment')).toBeInTheDocument();
  });

  test('renders items grouped by status sections', () => {
    const list = aTodoList({
      items: [
        aTodoItem({ id: 1, title: 'Faire les courses', status: 'TODO' }),
        aTodoItem({ id: 2, title: 'Laver la voiture', status: 'IN_PROGRESS' }),
        aTodoItem({ id: 3, title: 'Payer les factures', status: 'DONE' }),
      ],
    });

    render(<TodoListDetail {...defaultProps} list={list} />);

    expect(screen.getByText('Faire les courses')).toBeInTheDocument();
    expect(screen.getByText('Laver la voiture')).toBeInTheDocument();
    expect(screen.getByText('Payer les factures')).toBeInTheDocument();
    // Status labels appear in both the section headers and item status selects
    expect(screen.getAllByText('À faire').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('En cours').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Terminé').length).toBeGreaterThanOrEqual(1);
  });

  test('calls onDeleteItem when delete button is clicked', () => {
    const list = aTodoList({
      items: [aTodoItem({ id: 42, title: 'Tâche à supprimer', status: 'TODO' })],
    });

    render(<TodoListDetail {...defaultProps} list={list} />);

    fireEvent.click(screen.getByLabelText('Supprimer la tâche'));

    expect(onDeleteItem).toHaveBeenCalledWith(42);
  });

  test('shows clear completed button when done items exist and calls onClearCompleted', () => {
    const list = aTodoList({
      items: [aTodoItem({ id: 1, title: 'Tâche terminée', status: 'DONE' })],
    });

    render(<TodoListDetail {...defaultProps} list={list} />);

    const clearButton = screen.getByText('Nettoyer');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    expect(onClearCompleted).toHaveBeenCalled();
  });

  test('opens add task dialog when "Ajouter une tâche" button is clicked', () => {
    const list = aTodoList({ items: [] });

    render(<TodoListDetail {...defaultProps} list={list} />);

    fireEvent.click(screen.getByText('Ajouter une tâche'));

    expect(screen.getByText('Ajouter une tâche', { selector: '[class*="font-display"]' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex : Faire les courses')).toBeInTheDocument();
  });
});
