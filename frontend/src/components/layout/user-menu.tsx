'use client';

import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { User, Settings, LogOut, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
 */
export function UserMenu({ className }: UserMenuProps) {
  // TODO: Replace with actual user data from auth context
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

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
            <AvatarImage src={user.avatar || undefined} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={cn(
            'min-w-[240px] rounded-lg border bg-popover p-1 shadow-lg',
            'animate-in fade-in-0 zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'
          )}
          sideOffset={5}
          align="end"
        >
          {/* User Info */}
          <div className="px-3 py-2 border-b">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          {/* Menu Items */}
          <DropdownMenu.Item
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm',
              'cursor-pointer outline-none',
              'focus:bg-accent focus:text-accent-foreground'
            )}
            onSelect={() => console.log('Navigate to profile')}
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm',
              'cursor-pointer outline-none',
              'focus:bg-accent focus:text-accent-foreground'
            )}
            onSelect={() => console.log('Navigate to settings')}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm',
              'cursor-pointer outline-none',
              'focus:bg-accent focus:text-accent-foreground'
            )}
            onSelect={() => console.log('Navigate to help')}
          >
            <HelpCircle className="h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-border my-1" />

          <DropdownMenu.Item
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-sm',
              'cursor-pointer outline-none',
              'text-destructive focus:bg-destructive focus:text-destructive-foreground'
            )}
            onSelect={() => console.log('Sign out')}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}