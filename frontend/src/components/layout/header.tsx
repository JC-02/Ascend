'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserMenu } from './user-menu';
import { useUIStore } from '@/stores/ui-store';
import Image from 'next/image';

interface HeaderProps {
  className?: string;
}

/**
 * Header Component - Top Navigation Bar
 *
 * Features:
 * - Centered navigation with equal-width buttons
 * - Custom logo with border
 * - User menu dropdown
 * - Mobile sidebar toggle
 * - Responsive design
 */
export function Header({ className }: HeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { toggleSidebar } = useUIStore();
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hasSidebar =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/resumes') ||
    pathname.startsWith('/sessions') ||
    pathname.startsWith('/settings');

  return (
    <header
      className={cn(
        'sticky top-4 z-50 mx-auto w-[95%] max-w-7xl rounded-full transition-all duration-300',
        'border border-white/10 shadow-lg',
        isScrolled
          ? 'top-4 bg-background/80 shadow-primary/5 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60'
          : 'top-0 w-full max-w-full rounded-none border-transparent bg-transparent shadow-none backdrop-blur-sm',
        className
      )}
    >
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo + Mobile Toggle */}
          <div className="flex w-[200px] flex-shrink-0 items-center gap-4">
            {hasSidebar && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="hover:bg-accent md:hidden"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}

            <Link href="/" className="group flex items-center space-x-3">
              <div className="shimmer relative h-10 w-10 overflow-hidden rounded-lg border-2 border-primary/20 transition-all group-hover:border-primary/40">
                <Image
                  src="/ascend-logo.png"
                  alt="Ascend AI"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <span className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary">
                Ascend
              </span>
            </Link>
          </div>

          {/* Center: Navigation (only on public pages) - Centered on middle button */}
          {!hasSidebar && (
            <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center md:flex">
              <div className="flex items-center gap-2">
                <Link href="/features">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-[90px] hover:bg-accent hover:text-accent-foreground"
                  >
                    Features
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-[90px] hover:bg-accent hover:text-accent-foreground"
                  >
                    Pricing
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-[90px] hover:bg-accent hover:text-accent-foreground"
                  >
                    About
                  </Button>
                </Link>
              </div>
            </nav>
          )}

          {/* Right: Auth buttons or User menu */}
          <div className="flex w-[200px] flex-shrink-0 items-center justify-end gap-2">
            {hasSidebar ? (
              <UserMenu />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="hover:bg-accent">
                    Sign In
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="sm" className="glow bg-primary hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
