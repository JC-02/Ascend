'use client';

import { cn } from '@/lib/utils';
import { Sidebar, SidebarToggle } from './sidebar';
import { useUIStore } from '@/stores/ui-store';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, sidebar, className }: DashboardLayoutProps) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebar && <Sidebar>{sidebar}</Sidebar>}

      <main className={cn('flex-1 overflow-y-auto', className)}>
        <div className="container mx-auto p-6">
          <div className="mb-6 md:hidden">
            <SidebarToggle />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
