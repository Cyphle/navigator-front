import { render, screen } from '../../../../test-utils';
import { RecipePageHeader } from './RecipePageHeader';
import { fireEvent } from '@testing-library/react';

const CATEGORY_LABELS = {
  ENTREE: 'Entrée',
  PLAT: 'Plat',
  DESSERT: 'Dessert',
  SAUCE: 'Sauce',
  APERO: 'Apéro',
} as const;

const defaultProps = {
  searchInput: '',
  categoryFilter: 'ALL' as const,
  categoryLabels: CATEGORY_LABELS,
  onSearchChange: jest.fn(),
  onSearchCommit: jest.fn(),
  onCategoryChange: jest.fn(),
  onCreate: jest.fn(),
};

describe('RecipePageHeader', () => {
  beforeEach(() => jest.clearAllMocks());

  test('renders search input, category filter and create button', () => {
    render(<RecipePageHeader {...defaultProps} />);

    expect(screen.getByPlaceholderText('Rechercher une recette')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ajouter une recette/i })).toBeInTheDocument();
  });

  test('create button calls onCreate', () => {
    const onCreate = jest.fn();

    render(<RecipePageHeader {...defaultProps} onCreate={onCreate} />);

    fireEvent.click(screen.getByRole('button', { name: /ajouter une recette/i }));

    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  test('typing in search calls onSearchChange', () => {
    const onSearchChange = jest.fn();

    render(<RecipePageHeader {...defaultProps} onSearchChange={onSearchChange} />);

    fireEvent.change(screen.getByPlaceholderText('Rechercher une recette'), {
      target: { value: 'tarte' },
    });

    expect(onSearchChange).toHaveBeenCalledWith('tarte');
  });
});
