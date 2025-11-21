'use client';

import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Plus, Sparkles, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { GuestPrompt } from '@/components/ui/guest-prompt';
import { useEffect, useState } from 'react';

export default function SessionsPage() {
    const { data: session } = useSession();
    const [isDev, setIsDev] = useState(false);

    useEffect(() => {
        if (!session && typeof document !== 'undefined' && document.cookie.includes('ascend_dev_token=true')) {
            setIsDev(true);
        }
    }, [session]);

    const isAuthenticated = session?.user || isDev;

    return (
        <div className="space-y-6">
            <PageHeader
                heading="Interview Sessions"
                description="Review your past mock interviews and track your progress."
            />

            {!isAuthenticated ? (
                <GuestPrompt
                    title="Track Your Interview Progress"
                    description="Sign in to save your interview sessions, review past performances, and track your improvement over time."
                    icon={Video}
                />
            ) : (
                <>
                    {/* Empty State */}
                    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shimmer glow">
                                <Video className="h-10 w-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">No Sessions Yet</h3>
                            <p className="text-muted-foreground mb-8 max-w-md">
                                Start your first AI-powered mock interview to begin tracking your progress and improving your skills.
                            </p>
                            <Link href="/dashboard/sessions/new">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 glow">
                                    <Plus className="mr-2 h-5 w-5" />
                                    Start Your First Session
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Info Cards */}
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300 group">
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 shimmer glow-blue">
                                    <Video className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="group-hover:text-primary transition-colors">Practice Sessions</CardTitle>
                                <CardDescription>
                                    Each session is saved with full transcripts and AI feedback for review.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300 group">
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shimmer glow">
                                    <Clock className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="group-hover:text-primary transition-colors">Session History</CardTitle>
                                <CardDescription>
                                    Track your practice time and see how much you've improved over time.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300 group">
                            <CardHeader>
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 shimmer glow">
                                    <TrendingUp className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="group-hover:text-primary transition-colors">Performance Metrics</CardTitle>
                                <CardDescription>
                                    Get detailed analytics on your communication style and technical accuracy.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>

                    {/* What to Expect */}
                    <Card className="border-border/50 bg-card/50 backdrop-blur">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shimmer">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle>What to Expect in Your Sessions</CardTitle>
                                    <CardDescription>Here's what you'll get from each interview practice</CardDescription>
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
                                        <p className="text-sm font-medium">Realistic AI Interviewer</p>
                                        <p className="text-xs text-muted-foreground">Voice-based conversations that adapt to your responses, just like a real interview.</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                                        2
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Instant Detailed Feedback</p>
                                        <p className="text-xs text-muted-foreground">Get comprehensive analysis on communication, technical accuracy, and areas for improvement.</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                                        3
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Full Transcripts & Replays</p>
                                        <p className="text-xs text-muted-foreground">Review your answers anytime to identify patterns and track your progress.</p>
                                    </div>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
