'use client';

import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MagicCard } from '@/components/ui/magic-card';
import { Button } from '@/components/ui/button';
import { Plus, Video, FileText, TrendingUp, Clock, Target, Sparkles, Zap, Brain } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    if (!session && typeof document !== 'undefined' && document.cookie.includes('ascend_dev_token=true')) {
      setIsDev(true);
    }
  }, [session]);

  const user = session?.user || (isDev ? { name: 'Developer' } : null);
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName}!`}
        description="Your interview preparation command center."
        actions={
          <Link href="/dashboard/sessions/new">
            <Button className="bg-primary hover:bg-primary/90 glow">
              <Plus className="mr-2 h-4 w-4" />
              New Session
            </Button>
          </Link>
        }
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <MagicCard className="group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 shimmer glow-blue">
              <Video className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">0</div>
            <p className="text-xs text-muted-foreground mt-1">
              Start your first session
            </p>
          </CardContent>
        </MagicCard>

        <MagicCard className="group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interview Readiness</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shimmer glow">
              <Target className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">--</div>
            <p className="text-xs text-muted-foreground mt-1">
              Complete sessions to see score
            </p>
          </CardContent>
        </MagicCard>

        <MagicCard className="group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Practice Time</CardTitle>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 shimmer glow">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">0h</div>
            <p className="text-xs text-muted-foreground mt-1">This week</p>
          </CardContent>
        </MagicCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Get Started Card */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shimmer glow">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Your Journey Starts Here</CardTitle>
                <CardDescription className="text-base">
                  Three simple steps to interview mastery
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/50 p-6 hover:border-primary/50 transition-all duration-300">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-2xl" />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shimmer">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">1. Upload Resume</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Let our AI analyze your experience and skills.
                  </p>
                  <Link href="/dashboard/resumes">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                      Upload Now →
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/50 p-6 hover:border-primary/50 transition-all duration-300">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-2xl" />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shimmer">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">2. Add Job Details</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Paste the job description for tailored questions.
                  </p>
                  <Link href="/dashboard/sessions/new">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                      Create Session →
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/50 p-6 hover:border-primary/50 transition-all duration-300">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 blur-2xl" />
                <div className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 shimmer">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">3. Practice & Improve</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get AI-powered feedback on every response.
                  </p>
                  <Button variant="ghost" size="sm" className="text-muted-foreground cursor-default">
                    Coming Soon
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shimmer">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Jump right in</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/dashboard/sessions/new">
                <Button className="w-full justify-start bg-gradient-to-r from-primary to-accent hover:opacity-90 glow" size="lg">
                  <Video className="mr-2 h-5 w-5" />
                  Start New Interview
                </Button>
              </Link>
              <Link href="/dashboard/resumes">
                <Button className="w-full justify-start" size="lg" variant="outline">
                  <FileText className="mr-2 h-5 w-5" />
                  Manage Resumes
                </Button>
              </Link>
              <Link href="/dashboard/progress">
                <Button className="w-full justify-start" size="lg" variant="outline">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  View Progress
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-primary shimmer">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Pro Tips</CardTitle>
                <CardDescription>Maximize your success</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-sm font-medium">Practice regularly</p>
                  <p className="text-xs text-muted-foreground">Consistency beats cramming—aim for 2-3 sessions per week.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-sm font-medium">Review your feedback</p>
                  <p className="text-xs text-muted-foreground">Spend time analyzing AI feedback to identify patterns.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium">Simulate real conditions</p>
                  <p className="text-xs text-muted-foreground">Practice in a quiet space, dressed professionally.</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
