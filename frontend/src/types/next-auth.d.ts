// ============================================
// Ascend AI - NextAuth Type Definitions
// ============================================
// Extend NextAuth types to include our custom user ID
// DIRECTIVE: DIR-009 (TypeScript Best Practices)
// ============================================

import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Extends the built-in session.user type
   * Adds the database user ID to the session
   */
  interface Session {
    user: {
      id: string; // Database user ID (UUID)
    } & DefaultSession['user'];
  }

  /**
   * Extends the built-in user type
   */
  interface User {
    id: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the built-in JWT type
   */
  interface JWT {
    sub: string; // Database user ID stored in JWT
  }
}
