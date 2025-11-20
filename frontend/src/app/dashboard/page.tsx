'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { PageHeader } from '@/components/layout/page-header';
import { NavItem } from '@/components/layout/nav-item';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, FileText, Video, Settings, Plus, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Resumes', href: '/resumes', icon: FileText },
  { name: 'Sessions', href: '/sessions', icon: Video },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function DashboardPage() {
  return (
    <DashboardLayout
      sidebar={
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavItem key={item.name} href={item.href} icon={item.icon} label={item.name} />
          ))}
        </nav>
      }
    >
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your interview preparation progress."
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Session
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+2</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+5%</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Practice Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5h</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Your latest interview practice sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: 'Behavioral Interview',
                  date: '2 hours ago',
                  score: 88,
                  status: 'completed',
                },
                {
                  title: 'Technical Screening',
                  date: '1 day ago',
                  score: 92,
                  status: 'completed',
                },
                {
                  title: 'System Design',
                  date: '2 days ago',
                  score: 79,
                  status: 'completed',
                },
              ].map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{session.title}</p>
                    <p className="text-xs text-muted-foreground">{session.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold">{session.score}%</p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Start practicing or manage your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" size="lg">
                <Video className="mr-2 h-4 w-4" />
                Start New Session
              </Button>
              <Button className="w-full justify-start" size="lg" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Upload Resume
              </Button>
              <Button className="w-full justify-start" size="lg" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Progress
              </Button>
              <Button className="w-full justify-start" size="lg" variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testing Note */}
      <Card className="mt-8 border-dashed">
        <CardHeader>
          <CardTitle>Dashboard Layout Test</CardTitle>
          <CardDescription>Testing DashboardLayout component from Task 1.3.2</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            <li>✅ Sidebar visible on left (with navigation items)</li>
            <li>✅ Sidebar collapses on mobile (try resizing browser)</li>
            <li>✅ Header at top with user menu</li>
            <li>✅ Active route highlighted in sidebar (Dashboard)</li>
            <li>✅ Mobile menu toggle button appears on small screens</li>
            <li>✅ Content area properly offset for sidebar</li>
            <li>✅ Responsive grid layout for cards</li>
          </ul>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}