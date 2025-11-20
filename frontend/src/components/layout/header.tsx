'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserMenu } from './user-menu';
import { useUIStore } from '@/stores/ui-store';

interface HeaderProps {
  className?: string;
}

/**
 * Header Component - Top Navigation Bar
 * 
 * Different from PageHeader (which is for page titles/descriptions)
 * This is the fixed top navigation bar with logo and user menu
 * 
 * Features:
 * - Fixed positioning with scroll behavior
 * - Logo and branding
 * - User menu dropdown
 * - Mobile sidebar toggle
 * - Responsive navigation
 */
export function Header({ className }: HeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { toggleSidebar } = useUIStore();
  const pathname = usePathname();

  // Track scroll for header background
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if we're on a dashboard page (has sidebar)
  const hasSidebar = pathname.startsWith('/dashboard') || 
                     pathname.startsWith('/resumes') || 
                     pathname.startsWith('/sessions') ||
                     pathname.startsWith('/settings');

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-200',
        'border-b',
        isScrolled
          ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
          : 'bg-background',
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Left: Mobile sidebar toggle + Logo */}
        <div className="flex items-center gap-4">
          {hasSidebar && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="md:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
              Ascend
            </span>
          </Link>
        </div>

        {/* Center: Navigation (only on public pages) */}
        {!hasSidebar && (
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/features">
              <Button variant="ghost" size="sm">Features</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" size="sm">Pricing</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="sm">About</Button>
            </Link>
          </nav>
        )}

        {/* Right: Auth buttons or User menu */}
        <div className="flex items-center gap-2">
          {hasSidebar ? (
            <UserMenu />
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}