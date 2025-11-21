// ============================================
// Ascend AI - Protected Dashboard Layout
// ============================================
// Task 1.4.5 - SUB-1.4.5.2
// Protected layout that checks for valid session
// Redirects to /login if unauthenticated
// Follows CCS Section 8.6.3 (Authentication Integration)
// ============================================

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { NavItem } from '@/components/layout/nav-item';
import { Home, FileText, Video, Settings, TrendingUp } from 'lucide-react';

// Navigation items for the dashboard sidebar
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Resumes', href: '/dashboard/resumes', icon: FileText },
  { name: 'Sessions', href: '/dashboard/sessions', icon: Video },
  { name: 'Progress', href: '/dashboard/progress', icon: TrendingUp },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default async function ProtectedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check for valid session
  // This runs on the server and will redirect before the page renders
  const session = await auth();

  // If no session exists, redirect to login
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <DashboardLayout
      sidebar={
        <nav className="space-y-1" aria-label="Dashboard navigation">
          {navigation.map((item) => (
            <NavItem
              key={item.name}
              href={item.href}
              icon={item.icon}
              label={item.name}
            />
          ))}
        </nav>
      }
    >
      {children}
    </DashboardLayout>
  );
}
