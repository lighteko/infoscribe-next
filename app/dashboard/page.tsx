"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  EnvelopeIcon,
  UserGroupIcon,
  InboxIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

interface Newsletter {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  categories: string[];
  isRead: boolean;
}

const newsletters: Newsletter[] = [
  {
    id: "1",
    title: "Tech Insights Weekly",
    content:
      "This week in tech: Major advancements in quantum computing, Apple's new product announcements, and how AI is transforming healthcare. Plus, a deep dive into the latest cybersecurity threats.",
    timestamp: "2h ago",
    categories: ["Technology", "AI"],
    isRead: false,
  },
  {
    id: "2",
    title: "Finance Digest",
    content:
      "Market analysis: Global markets show signs of recovery as inflation rates stabilize. Our experts analyze the impact of recent policy changes and provide insights on emerging investment opportunities.",
    timestamp: "1d ago",
    categories: ["Finance", "Markets"],
    isRead: false,
  },
  {
    id: "3",
    title: "Health & Wellness Update",
    content:
      "Latest health research: New studies reveal the benefits of intermittent fasting, mindfulness practices for stress reduction, and breakthrough treatments for chronic conditions. Plus, seasonal wellness tips.",
    timestamp: "3d ago",
    categories: ["Health", "Wellness"],
    isRead: false,
  },
];

export default function DashboardPage() {
  // Require authentication for this page
  const { user } = useAuth({ requireAuth: true });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your newsletters.
          </p>
        </div>
        <Link href="/dashboard/providers/create">
          <Button>Create Provider</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total Subscriptions</h3>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <UserGroupIcon className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm font-medium">My Providers</h3>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">1</p>
            <p className="text-xs text-muted-foreground">Free plan limit: 1</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <InboxIcon className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-sm font-medium">Unread Newsletters</h3>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold">7</p>
            <p className="text-xs text-muted-foreground">
              3 new since yesterday
            </p>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="inbox">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="inbox">Inbox</TabsTrigger>
              <TabsTrigger value="archive">Archive</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <FunnelIcon className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Search newsletters..."
                className="max-w-[300px]"
              />
            </div>
          </div>

          <TabsContent value="inbox" className="space-y-4">
            {newsletters.map((newsletter) => (
              <Card key={newsletter.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{newsletter.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {newsletter.content}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm text-muted-foreground">
                      {newsletter.timestamp}
                    </span>
                    <Button variant="ghost" size="sm">
                      Mark as read
                    </Button>
                    <Button variant="link" size="sm">
                      Read full newsletter
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="archive" className="space-y-4">
            <Card className="p-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Archive</h3>
                <p className="text-muted-foreground">
                  View your previously read newsletters here.
                </p>
                <p className="text-sm text-muted-foreground">
                  You have 24 archived newsletters.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
