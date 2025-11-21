import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Video, Sparkles } from 'lucide-react';

export default function NewSessionPage() {
    return (
        <>
            <PageHeader
                title="Start New Session"
                description="Configure your mock interview session."
            />

            <div className="max-w-2xl mx-auto">
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-slate-200">Session Configuration</CardTitle>
                        <CardDescription className="text-slate-400">
                            Paste a job description to generate tailored questions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="job-title" className="text-slate-200">Job Title</Label>
                            <Input
                                id="job-title"
                                placeholder="e.g. Senior Frontend Engineer"
                                className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="company" className="text-slate-200">Company (Optional)</Label>
                            <Input
                                id="company"
                                placeholder="e.g. Google, Amazon, Startup Inc."
                                className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="jd" className="text-slate-200">Job Description</Label>
                            <Textarea
                                id="jd"
                                placeholder="Paste the full job description here..."
                                className="min-h-[200px] bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-500"
                            />
                        </div>

                        <Button className="w-full" size="lg">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Interview Questions
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
