import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { CreateShoppingListForm } from './CreateShoppingListForm';

describe('CreateShoppingListForm', () => {
  const onSubmit = jest.fn();
  const onCancel = jest.fn();
  const mockFamilies = [
    { id: 1, name: 'Famille Martin', owner: { id: 1, email: 'test@test.com', role: 'Owner' as const }, members: [], status: 'ACTIVE' as const },
    { id: 2, name: 'Famille Dupont', owner: { id: 2, email: 'test2@test.com', role: 'Owner' as const }, members: [], status: 'ACTIVE' as const },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal when open', () => {
    render(
      <CreateShoppingListForm open={true} onCancel={onCancel} onSubmit={onSubmit} families={[]} />
    );

    expect(screen.getByText('Nouvelle liste de courses')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(
      <CreateShoppingListForm open={false} onCancel={onCancel} onSubmit={onSubmit} families={[]} />
    );

    expect(screen.queryByText('Nouvelle liste de courses')).not.toBeInTheDocument();
  });

  test('shows personal type by default', () => {
    render(
      <CreateShoppingListForm open={true} onCancel={onCancel} onSubmit={onSubmit} families={[]} />
    );

    const personalRadio = screen.getByRole('radio', { name: /personnelle/i });
    expect(personalRadio).toBeChecked();
  });

  test('shows shared option', () => {
    render(
      <CreateShoppingListForm
        open={true}
        onCancel={onCancel}
        onSubmit={onSubmit}
        families={mockFamilies}
      />
    );

    expect(screen.getByText(/partagée avec une famille/i)).toBeInTheDocument();
  });

  test('shows family selector when shared type selected', () => {
    render(
      <CreateShoppingListForm open={true} onCancel={onCancel} onSubmit={onSubmit} families={mockFamilies} />
    );

    const sharedRadio = screen.getByRole('radio', { name: /partagée avec une famille/i });
    fireEvent.click(sharedRadio);

    expect(screen.getByText('Famille')).toBeInTheDocument();
  });

  test('calls onCancel when cancel button clicked', () => {
    render(
      <CreateShoppingListForm open={true} onCancel={onCancel} onSubmit={onSubmit} families={[]} />
    );

    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));

    expect(onCancel).toHaveBeenCalled();
  });

  test('shows loading state on submit button', () => {
    render(
      <CreateShoppingListForm
        open={true}
        onCancel={onCancel}
        onSubmit={onSubmit}
        isLoading={true}
        families={[]}
      />
    );

    const submitButton = screen.getByRole('button', { name: /créer/i });
    expect(submitButton).toHaveClass('ant-btn-loading');
  });
});
