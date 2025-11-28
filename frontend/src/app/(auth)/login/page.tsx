// ============================================
// Ascend AI - Login Page
// ============================================
// Task 1.4.5 - SUB-1.4.5.1
// OAuth authentication login page with Google and GitHub
// Follows Frontend-UI-UX-Specification Section 3.1
// ============================================

'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      const result = await signIn('google', { callbackUrl: '/dashboard', redirect: false });
      if (result?.error) {
        setError('Google sign-in failed. Please check your OAuth configuration.');
        setIsGoogleLoading(false);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsGithubLoading(true);
    setError(null);
    try {
      const result = await signIn('github', { callbackUrl: '/dashboard', redirect: false });
      if (result?.error) {
        setError('GitHub sign-in failed. Please check your OAuth configuration.');
        setIsGithubLoading(false);
      }
    } catch (error) {
      console.error('GitHub sign-in error:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Subtle background mesh gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo/Brand Section */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-white">Ascend AI</h1>
          <p className="text-lg text-slate-400">
            Master your <span className="text-primary">Interview Skills</span>
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold text-slate-200">Welcome Back</CardTitle>
            <CardDescription className="text-slate-400">
              Sign in to continue your interview preparation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="border-red-900 bg-red-950/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Google Sign-In Button */}
            <Button
              variant="outline"
              size="lg"
              className="w-full border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isGithubLoading}
            >
              {isGoogleLoading ? (
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
              ) : (
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Continue with Google
            </Button>

            {/* GitHub Sign-In Button */}
            <Button
              variant="outline"
              size="lg"
              className="w-full border-slate-700 bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white"
              onClick={handleGithubSignIn}
              disabled={isGoogleLoading || isGithubLoading}
            >
              {isGithubLoading ? (
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
              ) : (
                <Github className="mr-2 h-5 w-5" />
              )}
              Continue with GitHub
            </Button>

            {/* New User Info */}
            <p className="px-4 text-center text-xs text-slate-500">
              New to Ascend AI? Creating an account is quick and easy.
            </p>
          </CardContent>
        </Card>

        {/* Terms and Privacy */}
        <p className="mt-6 text-center text-sm text-slate-500">
          By continuing, you agree to our{' '}
          <a href="/terms" className="underline hover:text-slate-400">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="underline hover:text-slate-400">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
