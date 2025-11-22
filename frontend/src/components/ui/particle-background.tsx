'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    state: 'drifting' | 'sucking';
    opacity: number;
    pulseSpeed: number;
}

export function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 }); // Start off-screen

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;
        let particleIdCounter = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticle = (forceDrifting = false, x?: number, y?: number): Particle => {
            particleIdCounter++;
            const isDrifting = true; // Always start as drifting

            // Spawn logic: if x/y provided, use them. Else random.
            // If we need to spawn "outside" mouse radius, we'll handle that in the loop or here.
            let spawnX = x ?? Math.random() * canvas.width;
            let spawnY = y ?? Math.random() * canvas.height;

            // If we need to ensure it's outside the mouse radius (approx 300)
            if (!x && !y) {
                const dx = spawnX - mouseRef.current.x;
                const dy = spawnY - mouseRef.current.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 300) {
                    // Simple retry - just move it far away
                    spawnX = (spawnX + 500) % canvas.width;
                }
            }

            return {
                id: particleIdCounter,
                x: spawnX,
                y: spawnY,
                vx: (Math.random() - 0.5) * 0.5, // Slow drift
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                color: `rgba(${150 + Math.random() * 100}, ${150 + Math.random() * 100}, 255,`, // Base color, opacity handled in draw
                state: 'drifting',
                opacity: Math.random() * 0.5 + 0.2,
                pulseSpeed: (Math.random() - 0.5) * 0.02,
            };
        };

        const initParticles = () => {
            const particleCount = Math.min(window.innerWidth / 15, 80); // Slightly fewer for cleaner look
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(createParticle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // We need to iterate backwards or use a new array to handle removals/additions safely
            // But for simplicity, let's use a new array for the next frame
            const nextParticles: Particle[] = [];
            const newSpawns: Particle[] = [];

            particles.forEach((p) => {
                // 1. Update State & Physics
                const dx = mouseRef.current.x - p.x;
                const dy = mouseRef.current.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const interactionRadius = 300;

                if (p.state === 'drifting') {
                    // Drift movement
                    p.x += p.vx;
                    p.y += p.vy;

                    // Pulse opacity
                    p.opacity += p.pulseSpeed;
                    if (p.opacity > 0.7 || p.opacity < 0.2) p.pulseSpeed *= -1;

                    // Edge wrapping (only for drifting particles)
                    if (p.x < -50) p.x = canvas.width + 50;
                    if (p.x > canvas.width + 50) p.x = -50;
                    if (p.y < -50) p.y = canvas.height + 50;
                    if (p.y > canvas.height + 50) p.y = -50;

                    // Check for capture
                    if (dist < interactionRadius) {
                        p.state = 'sucking';
                        // SPAWN REPLACEMENT immediately outside radius
                        newSpawns.push(createParticle());
                    }
                } else if (p.state === 'sucking') {
                    // Black hole physics
                    const force = (interactionRadius - dist) / interactionRadius;
                    const angle = Math.atan2(dy, dx);

                    // Spiral velocity
                    // Tangential
                    const swirlAngle = angle + Math.PI / 1.5; // Tighter spiral
                    p.vx += Math.cos(swirlAngle) * force * 0.8;
                    p.vy += Math.sin(swirlAngle) * force * 0.8;

                    // Radial (Suction)
                    p.vx += Math.cos(angle) * force * 1.5;
                    p.vy += Math.sin(angle) * force * 1.5;

                    // Move
                    p.x += p.vx;
                    p.y += p.vy;

                    // Dampen slightly to prevent slinging out too far
                    p.vx *= 0.92;
                    p.vy *= 0.92;

                    // Fade out as it gets closer
                    p.opacity = Math.max(0, (dist / interactionRadius) * 0.8);
                }

                // 2. Render
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `${p.color} ${p.opacity})`;
                ctx.fill();

                // 3. Keep or Kill
                // Kill if sucked into center (dist < 10)
                if (p.state === 'sucking' && dist < 15) {
                    // Die. Do not add to nextParticles.
                    // Replacement was already spawned when it entered the radius.
                } else {
                    nextParticles.push(p);
                }
            });

            // Add any new spawns
            particles = [...nextParticles, ...newSpawns];

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);

        resizeCanvas();
        initParticles();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 z-0 h-full w-full"
            style={{ opacity: 0.8 }}
        />
    );
}
