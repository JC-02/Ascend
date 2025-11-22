// ============================================
// Ascend AI - NextAuth Configuration
// ============================================
// Authentication configuration using NextAuth v5
// Follows CCS Section 8.6.3 (Authentication Integration)
// DIRECTIVE: DIR-008 (Zero Trust Security Protocol)
// ============================================

import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';

// ============================================
// NextAuth Configuration
// ============================================
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        // Google OAuth Provider
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        // GitHub OAuth Provider
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),

        // Credentials Provider (for email/password login)
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // TODO: Implement actual authentication against backend API
                // This is a placeholder implementation
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    // Call backend API to authenticate user
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    if (!response.ok) {
                        return null;
                    }

                    const user = await response.json();
                    return user;
                } catch (error) {
                    console.error('Authentication error:', error);
                    return null;
                }
            },
        }),
    ],

    pages: {
        signIn: '/login',
        signOut: '/logout',
        error: '/auth/error',
    },

    callbacks: {
        async jwt({ token, user }) {
            // Add user ID to the token on sign in
            if (user) {
                token.id = user.id;
            }
            return token;
        },

        async session({ session, token }) {
            // Add user ID to the session
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },

    session: {
        strategy: 'jwt',
    },

    secret: process.env.NEXTAUTH_SECRET,
});
