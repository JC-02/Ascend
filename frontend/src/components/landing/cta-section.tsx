'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Video } from 'lucide-react';
import { motion } from 'framer-motion';

export function CTASection() {
    return (
        <section className="border-t border-border/40 py-24 bg-gradient-to-br from-primary/5 to-accent/5 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <div className="container relative z-10">
                <div className="mx-auto max-w-3xl text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-8 inline-flex items-center justify-center rounded-3xl bg-primary/10 p-6 shadow-2xl shadow-primary/20 backdrop-blur-sm"
                    >
                        <Video className="h-16 w-16 text-primary" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl font-bold tracking-tight sm:text-5xl mb-6"
                    >
                        Your Dream Job is One Interview Away
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-10 text-xl text-muted-foreground"
                    >
                        Don&apos;t let interview anxiety hold you back. Start practicing today and join thousands
                        who&apos;ve transformed their careers with Ascend AI.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Link href="/login">
                            <Button size="lg" className="h-14 px-10 text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 group rounded-full">
                                Begin Your Journey
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-6 text-sm text-muted-foreground"
                    >
                        Free to start • No credit card required • Begin in 30 seconds
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
