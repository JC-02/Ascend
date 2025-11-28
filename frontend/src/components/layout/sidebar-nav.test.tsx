import { render, screen } from '@testing-library/react';
import { SidebarNav } from './sidebar-nav';

// Mock usePathname
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

describe('SidebarNav', () => {
  it('renders all navigation items', () => {
    render(<SidebarNav />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Resumes')).toBeInTheDocument();
    expect(screen.getByText('Sessions')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('marks the active link correctly', () => {
    render(<SidebarNav />);

    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveClass('bg-accent');
  });
});
