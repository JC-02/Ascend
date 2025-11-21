import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Sparkles } from 'lucide-react';

interface GuestPromptProps {
    title: string;
    description: string;
    icon?: React.ComponentType<{ className?: string }>;
}

export function GuestPrompt({ title, description, icon: Icon = Sparkles }: GuestPromptProps) {
    return (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shimmer glow">
                    <Icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardDescription className="text-base">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <p className="text-sm text-muted-foreground text-center">
                    Sign in to save your progress, track your improvement, and access your personalized dashboard.
                </p>
                <Link href="/login">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 glow">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In to Continue
                    </Button>
                </Link>
                <p className="text-xs text-muted-foreground">
                    Free forever • No credit card required
                </p>
            </CardContent>
        </Card>
    );
}
