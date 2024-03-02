// import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import RootLayout from '@/app/layout';

// mock next/navigation lib - any component that tries to import
// from next/navigation in the testing environment will get these
// functions instead of the real ones
jest.mock('next/navigation', () => ({
  useRouter() {
    return { prefetch: () => null };
  },
  usePathname() {
    return '/';
  },
}));

describe('Layout', () => {
  it('renders a hamburger menu', () => {
    render(<RootLayout>{}</RootLayout>);
    const menuButton = screen.getByRole('navigation');
    expect(menuButton).toBeInTheDocument();
  });
});
