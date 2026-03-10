import { Footer } from './Footer.tsx';
import { render, screen } from '../../../test-utils';

describe('Footer', () => {
  it('should render the footer', () => {
    render(<Footer />);

    expect(screen.getByText('© 2026 Navigator')).toBeInTheDocument();
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
