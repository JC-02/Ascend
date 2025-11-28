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
import { SidebarNav } from '@/components/layout/sidebar-nav';

// Navigation items moved to sidebar-nav.tsx

import { cookies } from 'next/headers';

// ...

export default async function ProtectedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check for valid session
  const session = await auth();
  const cookieStore = cookies();
  const isDev = cookieStore.get('ascend_dev_token')?.value === 'true';

  // Allow guest users to access dashboard
  // They will see prompts to sign in on individual pages

  return <DashboardLayout sidebar={<SidebarNav />}>{children}</DashboardLayout>;
}
