'use client';

import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { User, Settings, LogOut, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UserMenuProps {
  className?: string;
}

/**
 * UserMenu Component - User Dropdown Menu
 *
 * Features:
 * - Avatar with dropdown
 * - Profile, Settings, Help, Sign Out
 * - Accessible (Radix UI)
 * - Keyboard navigation
 * - Handles both Auth Session and Dev Mode
 */
export function UserMenu({ className }: UserMenuProps) {
  const { data: session } = useSession();
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    // Check for dev token if no session
    if (
      !session &&
      typeof document !== 'undefined' &&
      document.cookie.includes('ascend_dev_token=true')
    ) {
      setIsDev(true);
    }
  }, [session]);

  const user =
    session?.user ||
    (isDev
      ? {
          name: 'Developer',
          email: 'dev@local',
          image: null,
        }
      : {
          name: 'Guest',
          email: '',
          image: null,
        });

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  const handleSignOut = () => {
    if (isDev) {
      document.cookie = 'ascend_dev_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      window.location.href = '/login';
    } else {
      signOut();
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            'flex items-center gap-2 rounded-full',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
            className
          )}
          aria-label="User menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || undefined} alt={user.name || ''} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            'min-w-[240px] rounded-lg border bg-popover p-1 shadow-lg',
            'animate-in fade-in-0 zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'z-50'
          )}
          sideOffset={5}
          align="end"
        >
          {/* User Info */}
          <div className="border-b px-3 py-2">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          {/* Menu Items */}
          <DropdownMenu.Item asChild>
            <Link
              href="/dashboard/profile"
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm',
                'cursor-pointer outline-none',
                'focus:bg-accent focus:text-accent-foreground'
              )}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link
              href="/dashboard/settings"
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm',
                'cursor-pointer outline-none',
                'focus:bg-accent focus:text-accent-foreground'
              )}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link
              href="/dashboard/support"
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm',
                'cursor-pointer outline-none',
                'focus:bg-accent focus:text-accent-foreground'
              )}
            >
              <HelpCircle className="h-4 w-4" />
              <span>Help & Support</span>
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-border" />

          <DropdownMenu.Item
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm',
              'cursor-pointer outline-none',
              'text-destructive focus:bg-destructive focus:text-destructive-foreground'
            )}
            onSelect={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
