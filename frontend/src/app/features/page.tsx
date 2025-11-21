import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Sparkles,
    MessageSquare,
    BarChart3,
    FileText,
    Zap,
    Target,
    Brain,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';

export default function FeaturesPage() {
    const features = [
        {
            icon: MessageSquare,
            title: 'AI-Powered Mock Interviews',
            description: 'Experience realistic interview scenarios with our advanced AI interviewer. Practice behavioral, technical, and case interviews tailored to your target role.',
            benefits: [
                'Real-time voice interaction',
                'Industry-specific questions',
                'Adaptive difficulty levels',
                'Unlimited practice sessions'
            ],
            gradient: 'from-purple-500 to-blue-500'
        },
        {
            icon: Brain,
            title: 'Intelligent Feedback Engine',
            description: 'Receive comprehensive, actionable feedback on every response. Our AI analyzes your communication style, technical accuracy, and problem-solving approach.',
            benefits: [
                'Detailed performance metrics',
                'Personalized improvement tips',
                'Strength and weakness analysis',
                'Progress tracking over time'
            ],
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            icon: FileText,
            title: 'Resume Optimization',
            description: 'Transform your resume into an interview-winning document. Get AI-powered suggestions to highlight your achievements and align with job requirements.',
            benefits: [
                'ATS-friendly formatting',
                'Keyword optimization',
                'Achievement quantification',
                'Industry best practices'
            ],
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            icon: Target,
            title: 'Job-Specific Preparation',
            description: 'Paste any job description and get a customized interview prep plan. Practice questions designed specifically for the role you want.',
            benefits: [
                'Role-specific scenarios',
                'Company culture insights',
                'Technical skill assessment',
                'Behavioral question bank'
            ],
            gradient: 'from-blue-500 to-indigo-500'
        },
        {
            icon: BarChart3,
            title: 'Performance Analytics',
            description: 'Track your improvement with detailed analytics dashboards. Visualize your progress and identify areas that need more practice.',
            benefits: [
                'Session history tracking',
                'Skill progression charts',
                'Comparative benchmarking',
                'Goal setting and monitoring'
            ],
            gradient: 'from-cyan-500 to-blue-500'
        },
        {
            icon: Zap,
            title: 'Instant Question Generation',
            description: 'Never run out of practice material. Generate unlimited interview questions based on your resume, job description, or specific topics.',
            benefits: [
                'Context-aware questions',
                'Multiple difficulty levels',
                'Follow-up question chains',
                'Custom topic selection'
            ],
            gradient: 'from-indigo-500 to-purple-500'
        }
    ];

    return (
        <main className="flex min-h-screen flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-background opacity-50" />
                <div className="container relative">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm shimmer">
                            <Sparkles className="mr-2 h-4 w-4 text-primary" />
                            <span className="font-medium">Powered by Advanced AI Technology</span>
                        </div>

                        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Everything You Need to{' '}
                            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                Ace Your Interview
                            </span>
                        </h1>

                        <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
                            Ascend AI combines cutting-edge artificial intelligence with proven interview strategies
                            to give you the competitive edge you deserve.
                        </p>

                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <Link href="/login">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 glow">
                                    Start Practicing Free
                                    <Sparkles className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/pricing">
                                <Button size="lg" variant="outline">
                                    View Pricing
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="border-t py-20">
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                            Comprehensive Interview Preparation
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Every feature designed to transform you from candidate to top choice
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300 group"
                            >
                                <CardHeader>
                                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shimmer`}>
                                        <feature.icon className="h-7 w-7 text-white" />
                                    </div>
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                        {feature.title}
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {feature.benefits.map((benefit, i) => (
                                            <li key={i} className="flex items-start text-sm text-muted-foreground">
                                                <CheckCircle2 className="mr-2 h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t py-20 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="container">
                    <div className="mx-auto max-w-3xl text-center">
                        <TrendingUp className="mx-auto h-12 w-12 text-primary mb-6" />
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                            Ready to Transform Your Interview Game?
                        </h2>
                        <p className="mb-8 text-lg text-muted-foreground">
                            Join thousands of professionals who have landed their dream jobs with Ascend AI
                        </p>
                        <Link href="/login">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 glow">
                                Get Started for Free
                                <Sparkles className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
