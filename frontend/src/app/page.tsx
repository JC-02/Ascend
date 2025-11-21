import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Sparkles, Target, Zap, TrendingUp, Video } from 'lucide-react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  // Redirect to dashboard if already authenticated
  const session = await auth();
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-background opacity-50" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm shimmer glow">
              <Sparkles className="mr-2 h-4 w-4 text-primary animate-pulse" />
              <span className="font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI-Powered Interview Mastery
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Transform Interviews from{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-shimmer">
                Anxiety to Opportunity
              </span>
            </h1>

            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Practice with hyper-realistic AI interviews, receive expert-level feedback instantly,
              and walk into every interview with unshakeable confidence.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 glow group">
                  Start Practicing Free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary/30 hover:bg-primary/10">
                  Explore Features
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              Free to start • 5 practice interviews included • Join 10,000+ successful candidates
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t py-20 bg-gradient-to-b from-background to-primary/5">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Why Ascend AI Changes Everything
            </h2>
            <p className="text-lg text-muted-foreground">
              The only interview prep platform that feels like having a personal coach in your pocket
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shimmer glow-blue">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">AI Mock Interviews</CardTitle>
                <CardDescription>
                  Practice with an AI that adapts to your responses, just like a real interviewer.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Voice-based conversations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Industry-specific scenarios
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Unlimited practice sessions
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shimmer glow">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">Instant Expert Feedback</CardTitle>
                <CardDescription>
                  Get detailed analysis that pinpoints exactly what to improve and how.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Communication breakdown
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Technical accuracy scoring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Actionable improvement tips
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300 group">
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 shimmer glow">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">Track Your Progress</CardTitle>
                <CardDescription>
                  Watch yourself improve with analytics that show your growth over time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Performance dashboards
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Skill progression charts
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    Session history & replays
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t py-20 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 p-4 shimmer glow">
              <Video className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Your Dream Job is One Interview Away
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Don&apos;t let interview anxiety hold you back. Start practicing today and join thousands
              who&apos;ve transformed their careers with Ascend AI.
            </p>
            <Link href="/login">
              <Button size="lg" className="bg-primary hover:bg-primary/90 glow group">
                Begin Your Journey
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Free to start • No credit card required • Begin in 30 seconds
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
