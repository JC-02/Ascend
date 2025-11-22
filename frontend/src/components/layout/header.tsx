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

  const hasSidebar = pathname.startsWith('/dashboard') ||
    pathname.startsWith('/resumes') ||
    pathname.startsWith('/sessions') ||
    pathname.startsWith('/settings');

  return (
    <header
      className={cn(
        'sticky top-4 z-50 w-[95%] max-w-7xl mx-auto rounded-full transition-all duration-300',
        'border border-white/10 shadow-lg',
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl shadow-primary/5 supports-[backdrop-filter]:bg-background/60 top-4'
          : 'bg-transparent backdrop-blur-sm border-transparent shadow-none top-0 w-full rounded-none max-w-full',
        className
      )}
    >
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo + Mobile Toggle */}
          <div className="flex items-center gap-4 flex-shrink-0 w-[200px]">
            {hasSidebar && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="md:hidden hover:bg-accent"
                aria-label="Toggle sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}

            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative h-10 w-10 rounded-lg overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-all shimmer">
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
            <nav className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
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
          <div className="flex items-center gap-2 flex-shrink-0 w-[200px] justify-end">
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
                  <Button size="sm" className="bg-primary hover:bg-primary/90 glow">
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