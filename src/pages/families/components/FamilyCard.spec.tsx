import { render, screen } from '../../../../test-utils';
import { FamilyCard } from './FamilyCard';
import { fireEvent } from '@testing-library/react';
import type { Family } from '../../../stores/families/families.types';

const aFamily = (overrides: Partial<Family> = {}): Family => ({
  id: overrides.id ?? 1,
  name: overrides.name ?? 'Famille Martin',
  owner: overrides.owner ?? {
    id: 1,
    email: 'sarah@martin.fr',
    role: 'Owner',
    relation: 'PARENT',
    isAdmin: true,
  },
  members: overrides.members ?? [
    { id: 2, email: 'leo@martin.fr', role: 'Member', relation: 'CHILD', isAdmin: false },
  ],
  status: overrides.status ?? 'ACTIVE',
});

describe('FamilyCard', () => {
  test('renders family name, owner and members', () => {
    render(
      <FamilyCard
        family={aFamily()}
        isPendingDeactivation={false}
        onEdit={jest.fn()}
        onDeactivate={jest.fn()}
      />
    );

    expect(screen.getByText('Famille Martin')).toBeInTheDocument();
    expect(screen.getByText('sarah@martin.fr')).toBeInTheDocument();
    expect(screen.getByText('leo@martin.fr')).toBeInTheDocument();
    expect(screen.getByText('2 membres')).toBeInTheDocument();
  });

  test('displays owner relation label', () => {
    render(
      <FamilyCard
        family={aFamily()}
        isPendingDeactivation={false}
        onEdit={jest.fn()}
        onDeactivate={jest.fn()}
      />
    );
    expect(screen.getByText(/Parent/)).toBeInTheDocument();
  });

  test('displays member relation badge', () => {
    render(
      <FamilyCard
        family={aFamily()}
        isPendingDeactivation={false}
        onEdit={jest.fn()}
        onDeactivate={jest.fn()}
      />
    );
    expect(screen.getByText('Enfant')).toBeInTheDocument();
  });

  test('shows shield icon for admin member', () => {
    const family = aFamily({
      members: [{ id: 2, email: 'admin@martin.fr', role: 'Member', relation: 'PARENT', isAdmin: true }],
    });
    const { container } = render(
      <FamilyCard family={family} isPendingDeactivation={false} onEdit={jest.fn()} onDeactivate={jest.fn()} />
    );
    expect(container.querySelector('[title="Admin"]')).toBeInTheDocument();
  });

  test('shows ACTIF badge for active family', () => {
    render(
      <FamilyCard family={aFamily()} isPendingDeactivation={false} onEdit={jest.fn()} onDeactivate={jest.fn()} />
    );
    expect(screen.getByText('Actif')).toBeInTheDocument();
  });

  test('shows Désactivé badge for inactive family', () => {
    render(
      <FamilyCard
        family={aFamily({ status: 'INACTIVE' })}
        isPendingDeactivation={false}
        onEdit={jest.fn()}
        onDeactivate={jest.fn()}
      />
    );
    expect(screen.getByText('Désactivé')).toBeInTheDocument();
  });

  test('Modifier button calls onEdit with the family', () => {
    const onEdit = jest.fn();
    const family = aFamily();
    render(
      <FamilyCard family={family} isPendingDeactivation={false} onEdit={onEdit} onDeactivate={jest.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: /modifier/i }));
    expect(onEdit).toHaveBeenCalledWith(family);
  });

  test('Désactiver button calls onDeactivate with the family', () => {
    const onDeactivate = jest.fn();
    const family = aFamily();
    render(
      <FamilyCard family={family} isPendingDeactivation={false} onEdit={jest.fn()} onDeactivate={onDeactivate} />
    );
    fireEvent.click(screen.getByRole('button', { name: /désactiver/i }));
    expect(onDeactivate).toHaveBeenCalledWith(family);
  });

  test('action buttons are disabled for inactive family', () => {
    render(
      <FamilyCard
        family={aFamily({ status: 'INACTIVE' })}
        isPendingDeactivation={false}
        onEdit={jest.fn()}
        onDeactivate={jest.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /modifier/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /désactiver/i })).toBeDisabled();
  });

  test('Désactiver is disabled when deactivation is pending', () => {
    render(
      <FamilyCard
        family={aFamily()}
        isPendingDeactivation={true}
        onEdit={jest.fn()}
        onDeactivate={jest.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /désactiver/i })).toBeDisabled();
  });

  test('shows "Aucun autre membre" when family has no members', () => {
    render(
      <FamilyCard
        family={aFamily({ members: [] })}
        isPendingDeactivation={false}
        onEdit={jest.fn()}
        onDeactivate={jest.fn()}
      />
    );
    expect(screen.getByText('Aucun autre membre')).toBeInTheDocument();
  });
});
