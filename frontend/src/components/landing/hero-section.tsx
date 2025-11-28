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
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden py-20 md:py-32"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-primary/5" />

      <ParticleBackground />

      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-accent/20 blur-[100px]"
      />

      <motion.div style={{ y, opacity, scale }} className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 inline-flex scale-110 items-center rounded-full border border-white/20 bg-primary/10 px-8 py-3 text-base shadow-lg shadow-primary/10 backdrop-blur-md"
          >
            <Sparkles className="mr-2 h-5 w-5 animate-pulse text-white" />
            <span className="font-semibold uppercase tracking-wide text-white/90">
              AI-Powered Interview Mastery
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl"
          >
            <span className="mb-6 block text-white">Transform Interviews from</span>
            <span className="block whitespace-nowrap bg-gradient-to-r from-purple-300 via-blue-300 to-white bg-clip-text text-transparent drop-shadow-sm filter">
              Stress to Success
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-muted-foreground sm:text-2xl"
          >
            Practice with hyper-realistic AI interviews, receive expert-level feedback instantly,
            and walk into every interview with unshakeable confidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/login">
              <Button
                size="lg"
                className="group h-14 w-full rounded-full bg-primary px-8 text-lg shadow-xl shadow-primary/25 transition-all duration-300 hover:bg-primary/90 hover:shadow-primary/40 sm:w-auto"
              >
                Start Practicing Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/features">
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-full rounded-full border-primary/20 px-8 text-lg backdrop-blur-sm hover:bg-primary/5 sm:w-auto"
              >
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
