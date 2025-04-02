"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  EnvelopeIcon,
  UserGroupIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import { StatsCard } from "@/components/dashboard/stats-card";
import { NewsletterList } from "@/components/dashboard/newsletter-list";
import { Newsletter } from "@/components/dashboard/newsletter-item";


// Sample newsletter data
const newsletters: Newsletter[] = [
  {
    id: "1",
    title: "Tech Weekly Roundup",
    content:
      "Latest in tech: New AI developments, upcoming product releases, and industry trends. Deep-dive into quantum computing advancements and their potential impact on cybersecurity.",
    timestamp: "2h ago",
    categories: ["Technology", "AI"],
    isRead: false,
  },
  // ... other newsletters
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
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
        <StatsCard
          icon={<EnvelopeIcon className="h-5 w-5 text-muted-foreground" />}
          title="Total Subscriptions"
          value="12"
          subtext="+2 from last week"
        />

        <StatsCard
          icon={<UserGroupIcon className="h-5 w-5 text-muted-foreground" />}
          title="My Providers"
          value="1"
          subtext="Free plan limit: 1"
        />

        <StatsCard
          icon={<InboxIcon className="h-5 w-5 text-muted-foreground" />}
          title="Unread Newsletters"
          value="7"
          subtext="3 new since yesterday"
        />
      </div>

      <NewsletterList initialNewsletters={newsletters} />
    </div>
  );
}
