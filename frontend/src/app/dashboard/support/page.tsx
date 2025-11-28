'use client';

import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, Send, MessageSquare, Book, Sparkles } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Help & Support"
        description="Get assistance and find answers to common questions."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact Form */}
        <Card className="border-border/50 bg-gradient-to-br from-card to-card/50 backdrop-blur lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="shimmer glow flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Contact Support</CardTitle>
                <CardDescription className="text-base">
                  Send us a message and we&apos;ll get back to you within 24 hours
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="bg-background/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help?" className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue or question..."
                  rows={6}
                  className="resize-none bg-background/50"
                />
              </div>
              <Button className="glow bg-primary hover:bg-primary/90">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="border-border/50 bg-card/50 backdrop-blur lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="shimmer glow flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <Book className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Quick answers to common questions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="group rounded-lg border border-border/50 bg-background/50 p-4 transition-all duration-300 hover:border-primary/50">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <HelpCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold transition-colors group-hover:text-primary">
                      How do AI mock interviews work?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Our AI interviewer asks you questions based on your resume and target job
                      description. You respond via voice, and the AI analyzes your answers in
                      real-time, providing detailed feedback on communication, technical accuracy,
                      and areas for improvement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group rounded-lg border border-border/50 bg-background/50 p-4 transition-all duration-300 hover:border-primary/50">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <HelpCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold transition-colors group-hover:text-primary">
                      How many practice interviews do I get?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Free users get 5 practice interviews per month. Professional plan includes 50
                      interviews per month, and Executive plan offers unlimited interviews. All
                      plans include full transcripts and detailed AI feedback.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group rounded-lg border border-border/50 bg-background/50 p-4 transition-all duration-300 hover:border-primary/50">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <HelpCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold transition-colors group-hover:text-primary">
                      Can I practice for specific companies or roles?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Yes! Simply paste the job description when creating a new session, and our AI
                      will generate questions tailored to that specific role, company culture, and
                      required skills. You can also specify industry focus in your profile settings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group rounded-lg border border-border/50 bg-background/50 p-4 transition-all duration-300 hover:border-primary/50">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <HelpCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold transition-colors group-hover:text-primary">
                      Is my data secure and private?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Absolutely. We use industry-standard encryption for all data. Your interview
                      sessions, resumes, and personal information are stored securely and never
                      shared with third parties. You can delete your data at any time from your
                      account settings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group rounded-lg border border-border/50 bg-background/50 p-4 transition-all duration-300 hover:border-primary/50">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <HelpCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold transition-colors group-hover:text-primary">
                      Can I cancel my subscription anytime?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can upgrade, downgrade, or cancel your subscription at any time. If
                      you cancel, you&apos;ll retain access to your current plan until the end of
                      your billing period. No hidden fees or complicated cancellation process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Help */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="shimmer glow flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle>Need More Help?</CardTitle>
                <CardDescription>Additional resources and support options</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 text-center">
                <div className="shimmer mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Book className="h-6 w-6 text-white" />
                </div>
                <h4 className="mb-1 font-semibold">Documentation</h4>
                <p className="mb-3 text-xs text-muted-foreground">
                  Comprehensive guides and tutorials
                </p>
                <Button variant="outline" size="sm">
                  View Docs
                </Button>
              </div>
              <div className="p-4 text-center">
                <div className="shimmer mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h4 className="mb-1 font-semibold">Community</h4>
                <p className="mb-3 text-xs text-muted-foreground">Connect with other users</p>
                <Button variant="outline" size="sm">
                  Join Discord
                </Button>
              </div>
              <div className="p-4 text-center">
                <div className="shimmer mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                  <HelpCircle className="h-6 w-6 text-white" />
                </div>
                <h4 className="mb-1 font-semibold">Live Chat</h4>
                <p className="mb-3 text-xs text-muted-foreground">Chat with our support team</p>
                <Button variant="outline" size="sm">
                  Start Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
