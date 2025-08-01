import { render } from '../../../test-utils/render.tsx';
import { Profile } from './Profile.tsx';

describe('Profile', () => {
  it('should render', () => {
    const { container } = render(<Profile />);

    expect(container).toMatchInlineSnapshot(`
      <div>
        My Profile
      </div>
    `);
  });
});