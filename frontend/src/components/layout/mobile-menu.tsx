'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Home, FileText, Video, Settings, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Resumes', href: '/resumes', icon: FileText },
  { name: 'Sessions', href: '/sessions', icon: Video },
  { name: 'Settings', href: '/settings', icon: Settings },
];

/**
 * MobileMenu Component - Full-Screen Mobile Navigation
 * 
 * Different from sidebar's mobile behavior
 * This is an alternative overlay pattern for future use
 * 
 * Features:
 * - Full-screen overlay
 * - Slide-in animation
 * - Navigation links
 * - User actions at bottom
 */
export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay 
          className={cn(
            'fixed inset-0 bg-background/80 backdrop-blur-sm z-50',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )} 
        />
        
        <Dialog.Content
          className={cn(
            'fixed inset-y-0 right-0 z-50 w-full max-w-sm',
            'border-l bg-background shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
            'data-[state=closed]:duration-300 data-[state=open]:duration-300',
            'flex flex-col'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Dialog.Title className="text-lg font-semibold">Menu</Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="rounded-md p-2 hover:bg-accent transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link key={item.name} href={item.href} onClick={onClose}>
                  <div
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg',
                      'transition-colors',
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent/50'
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={onClose}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={onClose}
            >
              Sign out
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}