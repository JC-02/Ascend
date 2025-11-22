'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ParticleBackground } from '@/components/ui/particle-background';
import Image from 'next/image';
import { useRef } from 'react';

export function HeroSection() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

    return (
        <section ref={ref} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 md:py-32">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-primary/5" />

            <ParticleBackground />

            {/* Animated Background Elements */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-primary/20 blur-[100px]"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
                className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-accent/20 blur-[100px]"
            />

            <motion.div
                style={{ y, opacity, scale }}
                className="container relative z-10"
            >
                <div className="mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-10 inline-flex items-center rounded-full border border-white/20 bg-primary/10 px-8 py-3 text-base backdrop-blur-md shadow-lg shadow-primary/10 scale-110"
                    >
                        <Sparkles className="mr-2 h-5 w-5 text-white animate-pulse" />
                        <span className="font-semibold text-white/90 tracking-wide uppercase">
                            AI-Powered Interview Mastery
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mb-8 text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl"
                    >
                        <span className="block mb-6 text-white">Transform Interviews from</span>
                        <span className="block bg-gradient-to-r from-purple-300 via-blue-300 to-white bg-clip-text text-transparent filter drop-shadow-sm whitespace-nowrap">
                            Stress to Success
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-12 text-xl text-muted-foreground sm:text-2xl max-w-2xl mx-auto leading-relaxed"
                    >
                        Practice with hyper-realistic AI interviews, receive expert-level feedback instantly,
                        and walk into every interview with unshakeable confidence.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col gap-4 sm:flex-row sm:justify-center items-center"
                    >
                        <Link href="/login">
                            <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 group rounded-full">
                                Start Practicing Free
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/features">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto border-primary/20 hover:bg-primary/5 backdrop-blur-sm rounded-full">
                                Explore Features
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground/60"
                    >
                        <div className="flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-primary" />
                            Free to start
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-primary" />
                            No credit card required
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-primary" />
                            Join 10,000+ candidates
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
