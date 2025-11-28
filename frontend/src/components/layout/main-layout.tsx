import * as React from 'react';
import { cn } from '@/lib/utils';
import { Header } from './header';
import { Footer } from './footer';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * MainLayout Component - Layout for Public Pages
 *
 * Different from DashboardLayout (which includes sidebar)
 * This is for landing pages, marketing pages, auth pages
 *
 * Features:
 * - Header + Content + Footer
 * - No sidebar
 * - Full-width content
 * - Responsive container
 */
export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className={cn('flex-1', className)}>{children}</main>
      <Footer />
    </div>
  );
}
