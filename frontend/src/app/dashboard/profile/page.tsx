'use client';

import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Upload, Shield, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { GuestPrompt } from '@/components/ui/guest-prompt';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
    const { data: session } = useSession();
    const [isDev, setIsDev] = useState(false);

    useEffect(() => {
        if (!session && typeof document !== 'undefined' && document.cookie.includes('ascend_dev_token=true')) {
            setIsDev(true);
        }
    }, [session]);

    const isAuthenticated = session?.user || isDev;
    const user = session?.user || (isDev ? { name: 'Developer', email: 'dev@local', image: null } : null);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Profile Settings"
                description="Manage your personal information and account preferences."
            />

            {!isAuthenticated ? (
                <GuestPrompt
                    title="Personalize Your Experience"
                    description="Sign in to create your profile, customize your preferences, and get personalized interview recommendations."
                    icon={User}
                />
            ) : (
                <div className="grid gap-6 max-w-4xl">
                    {/* Profile Card */}
                    <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shimmer glow">
                                    <User className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle>Personal Information</CardTitle>
                                    <CardDescription>Update your profile details and avatar</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Avatar Section */}
                            <div className="flex items-center gap-6">
                                <div className="relative group">
                                    <Avatar className="h-24 w-24 border-2 border-primary/20 group-hover:border-primary/40 transition-all">
                                        <AvatarImage src={user?.image || undefined} alt={user?.name || 'User'} />
                                        <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-white">
                                            {user?.name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity shimmer" />
                                </div>
                                <div className="space-y-2">
                                    <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:border-primary/50">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Photo
                                    </Button>
                                    <p className="text-xs text-muted-foreground">
                                        JPG, PNG or GIF. Max size 2MB.
                                    </p>
                                </div>
                            </div>

                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter your name"
                                    defaultValue={user?.name || ''}
                                    className="bg-background/50"
                                />
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    defaultValue={user?.email || ''}
                                    disabled
                                    className="bg-muted/50"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Email cannot be changed after account creation
                                </p>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end pt-4">
                                <Button className="bg-primary hover:bg-primary/90 glow">
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Card */}
                    <Card className="border-border/50 bg-card/50 backdrop-blur">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 shimmer glow">
                                    <Shield className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle>Account Security</CardTitle>
                                    <CardDescription>Manage your authentication methods</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-4 rounded-lg border border-border/50 bg-background/50 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                                    <Shield className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium mb-1">
                                        {session?.user ? 'OAuth Authentication' : 'Developer Mode'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {session?.user
                                            ? 'Your account is secured through your authentication provider (Google/GitHub).'
                                            : 'You are currently using developer bypass mode for testing purposes.'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preferences Card */}
                    <Card className="border-border/50 bg-card/50 backdrop-blur">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shimmer glow">
                                    <Sparkles className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle>Interview Preferences</CardTitle>
                                    <CardDescription>Customize your practice experience</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4">
                                    <div>
                                        <p className="text-sm font-medium">Target Role</p>
                                        <p className="text-xs text-muted-foreground">Set your primary job target</p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Configure
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4">
                                    <div>
                                        <p className="text-sm font-medium">Industry Focus</p>
                                        <p className="text-xs text-muted-foreground">Tailor questions to your industry</p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Configure
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4">
                                    <div>
                                        <p className="text-sm font-medium">Difficulty Level</p>
                                        <p className="text-xs text-muted-foreground">Adjust question complexity</p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Configure
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
