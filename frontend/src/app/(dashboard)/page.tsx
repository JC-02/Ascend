// ============================================
// Ascend AI - Dashboard Page
// ============================================
// Task 1.4.5 - SUB-1.4.5.3 (Enhanced)
// Main dashboard page showing user overview
// Follows Frontend-UI-UX-Specification Section 3.2
// ============================================

'use client';

import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Video, FileText, TrendingUp, Clock, CheckCircle, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <>
      <PageHeader
        title={`Welcome back${session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}!`}
        description="Here&apos;s an overview of your interview preparation progress."
        actions={
          <Link href="/dashboard/sessions/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Session
            </Button>
          </Link>
        }
      />

      {/* Stats Grid - "The Cockpit" */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Sessions</CardTitle>
            <Video className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">0</div>
            <p className="text-xs text-slate-400 mt-1">
              Start your first session
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Interview Readiness</CardTitle>
            <Target className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">--</div>
            <p className="text-xs text-slate-400 mt-1">
              Complete sessions to see score
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Practice Time</CardTitle>
            <Clock className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-100">0h</div>
            <p className="text-xs text-slate-400 mt-1">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State - Beautiful "Get Started" Card */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-800 bg-slate-900/50 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-slate-200">Get Started with Ascend AI</CardTitle>
            <CardDescription className="text-slate-400">
              Follow these steps to begin your interview preparation journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-lg border border-slate-800 bg-slate-800/30 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-semibold text-slate-200">1. Upload Your Resume</h4>
                  <p className="text-sm text-slate-400">
                    Start by uploading your resume. Our AI will analyze your experience and skills.
                  </p>
                  <Link href="/dashboard/resumes">
                    <Button variant="ghost" size="sm" className="mt-2 text-primary hover:text-primary/80">
                      Upload Resume →
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-lg border border-slate-800 bg-slate-800/30 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-semibold text-slate-200">2. Add a Job Description</h4>
                  <p className="text-sm text-slate-400">
                    Paste the job description you&apos;re targeting to get tailored interview questions.
                  </p>
                  <Link href="/dashboard/sessions/new">
                    <Button variant="ghost" size="sm" className="mt-2 text-primary hover:text-primary/80">
                      Create Session →
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-lg border border-slate-800 bg-slate-800/30 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-semibold text-slate-200">3. Practice & Get Feedback</h4>
                  <p className="text-sm text-slate-400">
                    Record your answers and receive AI-powered feedback on content and delivery.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Highlight */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-200">Why Use Ascend AI?</CardTitle>
            <CardDescription className="text-slate-400">
              Powerful features to help you succeed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>AI-powered interview question generation based on your resume and target role</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Detailed feedback on communication, technical accuracy, and structure</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Voice recording and transcription for realistic practice</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-3 mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Track your progress and improvement over time</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-200">Quick Actions</CardTitle>
            <CardDescription className="text-slate-400">
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/dashboard/sessions/new">
                <Button className="w-full justify-start" size="lg" variant="outline">
                  <Video className="mr-2 h-4 w-4" />
                  Start New Session
                </Button>
              </Link>
              <Link href="/dashboard/resumes">
                <Button className="w-full justify-start" size="lg" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Manage Resumes
                </Button>
              </Link>
              <Link href="/dashboard/progress">
                <Button className="w-full justify-start" size="lg" variant="outline">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Progress
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button className="w-full justify-start" size="lg" variant="outline">
                  <Zap className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
