// ============================================
// Ascend AI - NextAuth API Route Handler
// ============================================
// This file exports the NextAuth handlers for all auth routes
// Follows CCS Section 8.6.3 (Authentication Integration)
// DIRECTIVE: DIR-008 (Zero Trust Security Protocol)
// ============================================

import { handlers } from '@/lib/auth';

// Export the NextAuth handlers for GET and POST requests
// This handles all NextAuth routes under /api/auth/*
export const { GET, POST } = handlers;
