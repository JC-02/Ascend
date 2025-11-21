import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart } from 'lucide-react';

export default function ProgressPage() {
    return (
        <>
            <PageHeader
                title="Your Progress"
                description="Track your improvement over time."
            />

            <div className="grid gap-6">
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-slate-200">Performance Analytics</CardTitle>
                        <CardDescription className="text-slate-400">
                            Detailed analytics will appear here once you complete your first session.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-4 rounded-full bg-slate-800/50 p-4">
                            <TrendingUp className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="mb-2 text-lg font-medium text-slate-200">No data available</h3>
                        <p className="max-w-sm text-sm text-slate-400">
                            Complete mock interviews to visualize your progress, identify weak spots, and track your improvement.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
