import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles, Zap, Crown, Building2, ArrowRight } from 'lucide-react';

export default function PricingPage() {
    const plans = [
        {
            name: 'Free',
            icon: Sparkles,
            price: '$0',
            period: 'forever',
            description: 'Perfect for getting started with interview prep',
            features: [
                '5 AI mock interviews per month',
                'Basic feedback and insights',
                '1 resume upload',
                'Standard question bank',
                'Progress tracking',
                'Community support'
            ],
            cta: 'Start Free',
            popular: false,
            gradient: 'from-slate-500 to-slate-600'
        },
        {
            name: 'Professional',
            icon: Zap,
            price: '$29',
            period: 'per month',
            description: 'For serious job seekers who want to excel',
            features: [
                '50 AI mock interviews per month',
                'Advanced AI feedback with detailed analytics',
                'Unlimited resume uploads and optimization',
                'Job-specific question generation',
                'Performance benchmarking',
                'Priority email support',
                'Custom interview scenarios',
                'Export session transcripts'
            ],
            cta: 'Start Professional',
            popular: true,
            gradient: 'from-primary to-accent'
        },
        {
            name: 'Executive',
            icon: Crown,
            price: '$79',
            period: 'per month',
            description: 'Maximum preparation for high-stakes interviews',
            features: [
                'Unlimited AI mock interviews',
                'Expert-level AI feedback with video analysis',
                'Unlimited resume uploads with ATS scoring',
                'Industry-specific interview prep',
                'Executive coaching insights',
                'Dedicated support line',
                'Custom company research',
                'Interview strategy sessions',
                'Salary negotiation guidance',
                'Career path recommendations'
            ],
            cta: 'Start Executive',
            popular: false,
            gradient: 'from-amber-500 to-orange-600'
        }
    ];

    return (
        <main className="flex min-h-screen flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-background opacity-50" />
                <div className="container relative">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                            Simple, Transparent{' '}
                            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                Pricing
                            </span>
                        </h1>

                        <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
                            Choose the plan that fits your career goals. Upgrade, downgrade, or cancel anytime.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-12">
                <div className="container">
                    <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                        {plans.map((plan, index) => (
                            <Card
                                key={index}
                                className={`relative border-border/50 bg-card/50 backdrop-blur transition-all duration-300 ${plan.popular
                                        ? 'border-primary shadow-lg shadow-primary/20 scale-105 md:scale-110'
                                        : 'hover:border-primary/50'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-accent rounded-full text-xs font-semibold text-white shimmer">
                                        MOST POPULAR
                                    </div>
                                )}

                                <CardHeader className="text-center pb-8">
                                    <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${plan.gradient} shimmer`}>
                                        <plan.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <CardDescription className="text-base mt-2">
                                        {plan.description}
                                    </CardDescription>
                                    <div className="mt-6">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-muted-foreground ml-2">/{plan.period}</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start text-sm">
                                                <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link href="/login" className="block">
                                        <Button
                                            className={`w-full ${plan.popular
                                                    ? 'bg-primary hover:bg-primary/90 glow'
                                                    : 'bg-secondary hover:bg-secondary/80'
                                                }`}
                                            size="lg"
                                        >
                                            {plan.cta}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enterprise Section */}
            <section className="border-t py-20 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="container">
                    <div className="mx-auto max-w-4xl">
                        <Card className="border-border/50 bg-card/50 backdrop-blur">
                            <CardHeader className="text-center pb-6">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shimmer">
                                    <Building2 className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-3xl">Enterprise Solutions</CardTitle>
                                <CardDescription className="text-lg mt-2">
                                    Empower your entire organization with Ascend AI
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <p className="text-center text-muted-foreground">
                                    Transform your hiring process, onboard new employees faster, and develop your team&apos;s
                                    communication skills with our enterprise-grade interview intelligence platform.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <h4 className="font-semibold flex items-center">
                                            <Check className="mr-2 h-5 w-5 text-primary" />
                                            Recruiting Teams
                                        </h4>
                                        <p className="text-sm text-muted-foreground ml-7">
                                            Standardize your interview process, train interviewers, and identify top talent faster
                                            with AI-powered candidate assessments.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-semibold flex items-center">
                                            <Check className="mr-2 h-5 w-5 text-primary" />
                                            L&D Departments
                                        </h4>
                                        <p className="text-sm text-muted-foreground ml-7">
                                            Develop communication skills, leadership presence, and presentation abilities
                                            through realistic AI-powered practice scenarios.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-semibold flex items-center">
                                            <Check className="mr-2 h-5 w-5 text-primary" />
                                            Universities & Bootcamps
                                        </h4>
                                        <p className="text-sm text-muted-foreground ml-7">
                                            Prepare students for the job market with unlimited practice interviews,
                                            career coaching insights, and placement support tools.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-semibold flex items-center">
                                            <Check className="mr-2 h-5 w-5 text-primary" />
                                            Consulting Firms
                                        </h4>
                                        <p className="text-sm text-muted-foreground ml-7">
                                            Train consultants on client communication, case interviews, and executive presence
                                            with industry-specific scenarios and feedback.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-6 text-center">
                                    <Link href="/contact">
                                        <Button size="lg" className="bg-primary hover:bg-primary/90 glow">
                                            Schedule a Consultation
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <p className="text-sm text-muted-foreground mt-4">
                                        Custom pricing, dedicated support, and tailored solutions for your organization
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </main>
    );
}
