// ============================================
// Ascend AI - Session Provider
// ============================================
// Client-side session provider for NextAuth
// Wraps the app to provide session context
// ============================================

'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return <NextAuthSessionProvider session={session}>{children}</NextAuthSessionProvider>;
}
