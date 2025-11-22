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
        async jwt({ token, user, account, profile }) {
            // On initial sign-in, create or retrieve user from backend database
            if (user && account && profile) {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

                    // Call backend to create/get user in database
                    const response = await fetch(`${apiUrl}/users`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            avatar_url: user.image,
                            oauth_provider: account.provider,
                            oauth_id: account.providerAccountId,
                        }),
                    });

                    if (!response.ok) {
                        console.error('Failed to create/retrieve user from backend:', response.status);
                        throw new Error('Failed to create user in database');
                    }

                    const dbUser = await response.json();

                    // Store the database UUID in the token
                    token.sub = dbUser.id;
                    token.email = dbUser.email;
                    token.name = dbUser.name;
                    token.picture = dbUser.avatar_url;
                } catch (error) {
                    console.error('Error in JWT callback:', error);
                    // Return token anyway to prevent auth failure, but log the error
                    // In production, you might want to throw here to prevent incomplete auth
                }
            }
            return token;
        },

        async session({ session, token }) {
            // Add user ID and other data to the session
            if (session.user && token.sub) {
                session.user.id = token.sub as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.image = token.picture as string;
            }
            return session;
        },
    },

    session: {
        strategy: 'jwt',
    },

    secret: process.env.NEXTAUTH_SECRET,
});
