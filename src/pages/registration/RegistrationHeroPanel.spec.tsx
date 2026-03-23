import { screen } from '@testing-library/react';
import { render } from '../../../test-utils';
import { RegistrationHeroPanel } from './RegistrationHeroPanel';

describe('RegistrationHeroPanel', () => {
  test('renders the Navigator brand badge', () => {
    render(<RegistrationHeroPanel />);

    expect(screen.getByText('Navigator')).toBeInTheDocument();
  });

  test('renders the headline', () => {
    render(<RegistrationHeroPanel />);

    expect(screen.getByText(/Organise ta/)).toBeInTheDocument();
    expect(screen.getByText('famille')).toBeInTheDocument();
  });

  test('renders all feature items', () => {
    render(<RegistrationHeroPanel />);

    expect(screen.getByText('Pilotage clair')).toBeInTheDocument();
    expect(screen.getByText('Vue hebdomadaire')).toBeInTheDocument();
    expect(screen.getByText('Alertes utiles')).toBeInTheDocument();
  });
});
