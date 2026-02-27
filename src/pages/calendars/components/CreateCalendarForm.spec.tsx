import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../../../test-utils';
import { CreateCalendarForm } from './CreateCalendarForm';

describe('CreateCalendarForm', () => {
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
      <CreateCalendarForm open={true} onCancel={onCancel} onSubmit={onSubmit} families={[]} />
    );

    expect(screen.getByText('Nouveau calendrier')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /créer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(
      <CreateCalendarForm open={false} onCancel={onCancel} onSubmit={onSubmit} families={[]} />
    );

    expect(screen.queryByText('Nouveau calendrier')).not.toBeInTheDocument();
  });

  test('shows personal type by default', () => {
    render(
      <CreateCalendarForm open={true} onCancel={onCancel} onSubmit={onSubmit} families={[]} />
    );

    const personalRadio = screen.getByRole('radio', { name: /personnel/i });
    expect(personalRadio).toBeChecked();
  });

  test('shows shared option', () => {
    render(
      <CreateCalendarForm
        open={true}
        onCancel={onCancel}
        onSubmit={onSubmit}
        families={mockFamilies}
      />
    );

    expect(screen.getByText(/partagé avec une famille/i)).toBeInTheDocument();
  });

  test('shows family selector when shared type selected', () => {
    render(
      <CreateCalendarForm open={true} onCancel={onCancel} onSubmit={onSubmit} families={mockFamilies} />
    );

    const sharedRadio = screen.getByRole('radio', { name: /partagé avec une famille/i });
    fireEvent.click(sharedRadio);

    expect(screen.getByText('Famille')).toBeInTheDocument();
  });

  test('calls onCancel when cancel button clicked', () => {
    render(
      <CreateCalendarForm open={true} onCancel={onCancel} onSubmit={onSubmit} families={[]} />
    );

    fireEvent.click(screen.getByRole('button', { name: /annuler/i }));

    expect(onCancel).toHaveBeenCalled();
  });

  test('shows loading state on submit button', () => {
    render(
      <CreateCalendarForm
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

  test('shows color selector', () => {
    render(
      <CreateCalendarForm open={true} onCancel={onCancel} onSubmit={onSubmit} families={[]} />
    );

    expect(screen.getByText('Couleur')).toBeInTheDocument();
  });
});
