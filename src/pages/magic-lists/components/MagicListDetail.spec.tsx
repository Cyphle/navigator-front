import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { MagicListDetail } from './MagicListDetail';
import { aMagicList, aMagicItem } from '../../../../test-utils/factories';

describe('MagicListDetail', () => {
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
    const list = aMagicList({ name: 'Courses de la semaine', type: 'PERSONAL' });

    render(<MagicListDetail {...defaultProps} list={list} />);

    expect(screen.getByText('Courses de la semaine')).toBeInTheDocument();
    expect(screen.getByText('Personnelle')).toBeInTheDocument();
  });

  test('calls onBack when back button is clicked', () => {
    const list = aMagicList();

    render(<MagicListDetail {...defaultProps} list={list} />);

    fireEvent.click(screen.getByText('Retour'));

    expect(onBack).toHaveBeenCalled();
  });

  test('shows empty state when list has no items', () => {
    const list = aMagicList({ items: [] });

    render(<MagicListDetail {...defaultProps} list={list} />);

    expect(screen.getByText('Aucun élément pour le moment')).toBeInTheDocument();
  });

  test('renders items grouped by status when status is set', () => {
    const list = aMagicList({
      items: [
        aMagicItem({ id: 1, title: 'Faire les courses', status: 'TODO' }),
        aMagicItem({ id: 2, title: 'Laver la voiture', status: 'IN_PROGRESS' }),
        aMagicItem({ id: 3, title: 'Payer les factures', status: 'DONE' }),
      ],
    });

    render(<MagicListDetail {...defaultProps} list={list} />);

    expect(screen.getByText('Faire les courses')).toBeInTheDocument();
    expect(screen.getByText('Laver la voiture')).toBeInTheDocument();
    expect(screen.getByText('Payer les factures')).toBeInTheDocument();
    expect(screen.getAllByText('À faire').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('En cours').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Terminé').length).toBeGreaterThanOrEqual(1);
  });

  test('renders items without grouping when no status is set', () => {
    const list = aMagicList({
      items: [
        aMagicItem({ id: 1, title: 'Item sans statut' }),
      ],
    });

    render(<MagicListDetail {...defaultProps} list={list} />);

    expect(screen.getByText('Item sans statut')).toBeInTheDocument();
    expect(screen.queryByText('À faire')).not.toBeInTheDocument();
  });

  test('calls onDeleteItem when delete button is clicked', () => {
    const list = aMagicList({
      items: [aMagicItem({ id: 42, title: 'Tâche à supprimer', status: 'TODO' })],
    });

    render(<MagicListDetail {...defaultProps} list={list} />);

    fireEvent.click(screen.getByLabelText('Supprimer la tâche'));

    expect(onDeleteItem).toHaveBeenCalledWith(42);
  });

  test('shows clear completed button when done items exist and calls onClearCompleted', () => {
    const list = aMagicList({
      items: [aMagicItem({ id: 1, title: 'Tâche terminée', status: 'DONE' })],
    });

    render(<MagicListDetail {...defaultProps} list={list} />);

    const clearButton = screen.getByText('Nettoyer');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);

    expect(onClearCompleted).toHaveBeenCalled();
  });

  test('opens add item dialog when add button is clicked', () => {
    const list = aMagicList({ items: [] });

    render(<MagicListDetail {...defaultProps} list={list} />);

    fireEvent.click(screen.getByText('Ajouter un élément'));

    expect(screen.getByText('Ajouter un élément', { selector: '[class*="font-display"]' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex : Acheter du lait')).toBeInTheDocument();
  });

  test('shows checkboxes for TASK list items', () => {
    const list = aMagicList({
      kind: 'TASK',
      items: [aMagicItem({ id: 1, title: 'Acheter du lait', checked: false })],
    });

    render(<MagicListDetail {...defaultProps} list={list} />);

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  test('does not show checkboxes for SIMPLE list items', () => {
    const list = aMagicList({
      kind: 'SIMPLE',
      items: [aMagicItem({ id: 1, title: 'Simple item' })],
    });

    render(<MagicListDetail {...defaultProps} list={list} />);

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});
