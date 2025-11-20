'use client';

import { useState } from 'react';
import { UserMenu } from '@/components/layout/user-menu';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/layout/breadcrumbs';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Menu } from 'lucide-react';

export default function TestLayoutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Test Layout' },
  ];

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="border-b mb-8">
        <div className="container py-6">
          <h1 className="text-3xl font-bold mb-2">Layout Components Test</h1>
          <p className="text-muted-foreground">Testing Task 1.3.2 components</p>
        </div>
      </div>

      <div className="container space-y-8 pb-16">
        {/* Header Test */}
        <Card>
          <CardHeader>
            <CardTitle>Header Component</CardTitle>
            <CardDescription>Fixed navigation bar at the top</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The header is visible at the top of this page. Scroll down to see the background change on scroll.
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>✅ Logo links to home</li>
              <li>✅ Responsive mobile menu toggle (on small screens)</li>
              <li>✅ User menu on right side (avatar)</li>
              <li>✅ Scroll behavior (background becomes solid on scroll)</li>
              <li>✅ Navigation links (on public pages)</li>
            </ul>
          </CardContent>
        </Card>

        {/* UserMenu Test */}
        <Card>
          <CardHeader>
            <CardTitle>UserMenu Component</CardTitle>
            <CardDescription>Dropdown menu for user actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the avatar in the header to open the user menu, or test it standalone below:
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Standalone test:</span>
              <UserMenu />
            </div>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground mt-4">
              <li>✅ Shows user name and email</li>
              <li>✅ Profile link</li>
              <li>✅ Settings link</li>
              <li>✅ Help & Support link</li>
              <li>✅ Sign out (destructive style)</li>
              <li>✅ Keyboard navigation support</li>
            </ul>
          </CardContent>
        </Card>

        {/* MobileMenu Test */}
        <Card>
          <CardHeader>
            <CardTitle>MobileMenu Component</CardTitle>
            <CardDescription>Full-screen mobile navigation overlay</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the button below to test the mobile menu overlay (alternative navigation pattern):
            </p>
            <Button onClick={() => setMobileMenuOpen(true)} className="w-full sm:w-auto">
              <Menu className="mr-2 h-4 w-4" />
              Open Mobile Menu
            </Button>
            <MobileMenu
              isOpen={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
            />
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground mt-4">
              <li>✅ Full-screen overlay</li>
              <li>✅ Slide-in animation from right</li>
              <li>✅ Navigation links with icons</li>
              <li>✅ Active route highlighting</li>
              <li>✅ User actions at bottom</li>
              <li>✅ Close button in header</li>
            </ul>
          </CardContent>
        </Card>

        {/* Breadcrumbs Test */}
        <Card>
          <CardHeader>
            <CardTitle>Breadcrumbs Component</CardTitle>
            <CardDescription>Navigation trail showing page hierarchy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <Breadcrumbs items={breadcrumbItems} />
            </div>
            <p className="text-sm text-muted-foreground">
              The breadcrumb above shows: Home → Dashboard → Test Layout
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>✅ Clickable parent links</li>
              <li>✅ Current page highlighted</li>
              <li>✅ Chevron separators</li>
              <li>✅ Proper ARIA labels</li>
              <li>✅ Responsive design</li>
            </ul>
          </CardContent>
        </Card>

        {/* Footer Test */}
        <Card>
          <CardHeader>
            <CardTitle>Footer Component</CardTitle>
            <CardDescription>Bottom footer with links and information</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Scroll to the bottom of the page to see the footer component with:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>✅ Brand section with tagline</li>
              <li>✅ Product links column</li>
              <li>✅ Company links column</li>
              <li>✅ Legal links column</li>
              <li>✅ Social media icons (GitHub, Twitter, LinkedIn)</li>
              <li>✅ Copyright notice with current year</li>
              <li>✅ Responsive grid layout</li>
            </ul>
          </CardContent>
        </Card>

        {/* MainLayout Test */}
        <Card>
          <CardHeader>
            <CardTitle>MainLayout Component</CardTitle>
            <CardDescription>Full page layout wrapper for public pages</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This page demonstrates the complete layout system. The MainLayout component includes:
            </p>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
              <li>✅ Header at top (sticky positioning)</li>
              <li>✅ Main content area (this section)</li>
              <li>✅ Footer at bottom</li>
              <li>✅ Responsive container with proper padding</li>
              <li>✅ Flex layout for proper spacing</li>
              <li>✅ No sidebar (for public pages)</li>
            </ul>
          </CardContent>
        </Card>

        {/* DashboardLayout Test */}
        <Card>
          <CardHeader>
            <CardTitle>DashboardLayout Component</CardTitle>
            <CardDescription>Dashboard-specific layout with sidebar</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              To test the DashboardLayout (with sidebar), visit the dashboard page:
            </p>
            <Button asChild>
              <a href="/dashboard">Go to Dashboard</a>
            </Button>
            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground mt-4">
              <li>✅ Includes collapsible sidebar</li>
              <li>✅ Mobile-responsive sidebar toggle</li>
              <li>✅ Active route highlighting</li>
              <li>✅ Content area with proper offset</li>
            </ul>
          </CardContent>
        </Card>

        {/* Testing Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Checklist</CardTitle>
            <CardDescription>Verify all components work correctly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <input type="checkbox" id="test-1" className="mt-1" />
                <label htmlFor="test-1" className="text-sm">
                  Header scrolls and changes background
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="test-2" className="mt-1" />
                <label htmlFor="test-2" className="text-sm">
                  UserMenu dropdown opens and shows all options
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="test-3" className="mt-1" />
                <label htmlFor="test-3" className="text-sm">
                  MobileMenu overlay opens with animation
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="test-4" className="mt-1" />
                <label htmlFor="test-4" className="text-sm">
                  Breadcrumbs display correctly with links
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="test-5" className="mt-1" />
                <label htmlFor="test-5" className="text-sm">
                  Footer displays at bottom with all sections
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="test-6" className="mt-1" />
                <label htmlFor="test-6" className="text-sm">
                  Responsive design works on mobile (resize browser)
                </label>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" id="test-7" className="mt-1" />
                <label htmlFor="test-7" className="text-sm">
                  Dark mode is active (default theme)
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spacer for scroll testing */}
        <div className="h-96 flex items-center justify-center border rounded-lg">
          <p className="text-muted-foreground">Scroll up to see header background change</p>
        </div>
      </div>
    </div>
  );
}