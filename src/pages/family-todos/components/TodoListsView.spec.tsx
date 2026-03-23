import { render, screen } from '../../../../test-utils';
import { TodoListsView } from './TodoListsView';
import { fireEvent } from '@testing-library/react';
import { aTodoList, aTodoItem } from '../../../../test-utils/factories';

describe('TodoListsView', () => {
  test('shows empty state when no lists', () => {
    const onCreateNew = jest.fn();

    render(
      <TodoListsView lists={[]} onCreateNew={onCreateNew} onSelectList={jest.fn()} onDelete={jest.fn()} />
    );

    expect(screen.getByText('Aucune liste de todos')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer ma première liste/i })).toBeInTheDocument();
  });

  test('empty state CTA calls onCreateNew', () => {
    const onCreateNew = jest.fn();

    render(
      <TodoListsView lists={[]} onCreateNew={onCreateNew} onSelectList={jest.fn()} onDelete={jest.fn()} />
    );

    fireEvent.click(screen.getByRole('button', { name: /créer ma première liste/i }));

    expect(onCreateNew).toHaveBeenCalledTimes(1);
  });

  test('header "Nouvelle liste" button calls onCreateNew', () => {
    const onCreateNew = jest.fn();
    const lists = [aTodoList()];

    render(
      <TodoListsView lists={lists} onCreateNew={onCreateNew} onSelectList={jest.fn()} onDelete={jest.fn()} />
    );

    fireEvent.click(screen.getByRole('button', { name: /nouvelle liste/i }));

    expect(onCreateNew).toHaveBeenCalledTimes(1);
  });

  test('renders list names and item counts', () => {
    const lists = [
      aTodoList({ id: 1, name: 'Tâches ménagères', type: 'PERSONAL', items: [aTodoItem(), aTodoItem({ id: 2 })] }),
      aTodoList({ id: 2, name: 'Courses', type: 'SHARED', items: [] }),
    ];

    render(
      <TodoListsView lists={lists} onCreateNew={jest.fn()} onSelectList={jest.fn()} onDelete={jest.fn()} />
    );

    expect(screen.getByText('Tâches ménagères')).toBeInTheDocument();
    expect(screen.getByText('Courses')).toBeInTheDocument();
    expect(screen.getByText(/2 tâches/)).toBeInTheDocument();
    expect(screen.getByText(/0 tâche/)).toBeInTheDocument();
  });

  test('clicking a list calls onSelectList with its id', () => {
    const onSelectList = jest.fn();
    const lists = [aTodoList({ id: 42, name: 'Ma liste' })];

    render(
      <TodoListsView lists={lists} onCreateNew={jest.fn()} onSelectList={onSelectList} onDelete={jest.fn()} />
    );

    fireEvent.click(screen.getByText('Ma liste'));

    expect(onSelectList).toHaveBeenCalledWith(42);
  });
});
