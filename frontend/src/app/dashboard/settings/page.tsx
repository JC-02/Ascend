import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Settings, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account preferences and application settings."
      />

      <div className="max-w-2xl">
        <Card className="border-slate-800 bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-slate-200">General Preferences</CardTitle>
            <CardDescription className="text-slate-400">
              Customize your Ascend AI experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label className="text-base text-slate-200">Ephemeral Mode</Label>
                <p className="text-sm text-slate-400">
                  Automatically delete session data after 24 hours.
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label className="text-base text-slate-200">Email Notifications</Label>
                <p className="text-sm text-slate-400">Receive weekly progress summaries.</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="pt-4">
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
