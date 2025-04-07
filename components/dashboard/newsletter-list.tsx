"use client";

import { useState } from "react";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NewsletterItem, Newsletter } from "./newsletter-item";

interface NewsletterListProps {
  initialNewsletters: Newsletter[];
}

export function NewsletterList({ initialNewsletters }: NewsletterListProps) {
  const [newsletters, setNewsletters] =
    useState<Newsletter[]>(initialNewsletters);

  const handleMarkAsRead = (id: string) => {
    setNewsletters(
      newsletters.map((newsletter) =>
        newsletter.id === id ? { ...newsletter, isRead: true } : newsletter
      )
    );
  };

  return (
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
            <NewsletterItem key={newsletter.id} newsletter={newsletter} />
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
  );
}
