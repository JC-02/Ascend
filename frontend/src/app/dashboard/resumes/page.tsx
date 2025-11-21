import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ResumesPage() {
    return (
        <>
            <PageHeader
                title="Resume Management"
                description="Upload and manage your resumes for tailored interview preparation."
                actions={
                    <Button>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Resume
                    </Button>
                }
            />

            <div className="grid gap-6">
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-slate-200">Your Resumes</CardTitle>
                        <CardDescription className="text-slate-400">
                            You haven&apos;t uploaded any resumes yet.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="mb-4 rounded-full bg-slate-800/50 p-4">
                            <FileText className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="mb-2 text-lg font-medium text-slate-200">No resumes found</h3>
                        <p className="mb-6 max-w-sm text-sm text-slate-400">
                            Upload your resume to get personalized interview questions and feedback based on your experience.
                        </p>
                        <Button variant="outline">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Your First Resume
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
