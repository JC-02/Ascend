'use client';

import { MagicCard } from '@/components/ui/magic-card';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Target, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        title: "AI Mock Interviews",
        description: "Practice with an AI that adapts to your responses, just like a real interviewer.",
        icon: Target,
        gradient: "from-purple-500 to-blue-500",
        items: [
            "Voice-based conversations",
            "Industry-specific scenarios",
            "Unlimited practice sessions"
        ]
    },
    {
        title: "Instant Expert Feedback",
        description: "Get detailed analysis that pinpoints exactly what to improve and how.",
        icon: Zap,
        gradient: "from-blue-500 to-cyan-500",
        items: [
            "Communication breakdown",
            "Technical accuracy scoring",
            "Actionable improvement tips"
        ]
    },
    {
        title: "Track Your Progress",
        description: "Watch yourself improve with analytics that show your growth over time.",
        icon: TrendingUp,
        gradient: "from-cyan-500 to-purple-500",
        items: [
            "Performance dashboards",
            "Skill progression charts",
            "Session history & replays"
        ]
    }
];

export function FeaturesSection() {
    return (
        <section className="border-t border-border/40 py-24 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
            <div className="container relative z-10">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
                    >
                        Why Ascend AI Changes Everything
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-lg text-muted-foreground"
                    >
                        The only interview prep platform that feels like having a personal coach in your pocket
                    </motion.p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <MagicCard className="h-full">
                                <CardHeader>
                                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                                        <feature.icon className="h-7 w-7 text-white" />
                                    </div>
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{feature.title}</CardTitle>
                                    <CardDescription className="text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-sm text-muted-foreground">
                                        {feature.items.map((item, i) => (
                                            <li key={i} className="flex items-center">
                                                <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </MagicCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
