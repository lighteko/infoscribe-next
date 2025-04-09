"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "@heroicons/react/24/outline";
import {
  getAllMySubscriptions,
  unsubscribe,
} from "@api/requests/subscription.request";
import { Subscription } from "@api/types/subscription.types";
import { toast } from "@/hooks/use-toast";
import { cron2Weekday } from "@/lib/utils";
import Link from "next/link";
import { sendGAEvent } from "@/lib/analytics";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setIsLoading(true);
        const response = await getAllMySubscriptions();
        setSubscriptions(response.data);
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
        toast({
          title: "Error",
          description: "Failed to load subscriptions. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleUnsubscribe = async (providerId: string, providerTitle: string) => {
    try {
      await unsubscribe(providerId);

      sendGAEvent('unsubscribe', { provider_id: providerId, provider_title: providerTitle });

      setSubscriptions((prevState) =>
        prevState.filter((sub) => sub.providerId !== providerId)
      );

      toast({
        title: "Unsubscribed",
        description: "You have successfully unsubscribed from the newsletter.",
      });
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
      toast({
        title: "Error",
        description:
          "Failed to unsubscribe from the newsletter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDiscoverClick = () => {
    sendGAEvent('discover_newsletters_click');
  };

  const handleViewArchiveClick = (providerId: string, providerTitle: string) => {
    sendGAEvent('view_subscription_archive', { provider_id: providerId, provider_title: providerTitle });
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Subscriptions</h2>
          <p className="text-muted-foreground">
            Manage your newsletter subscriptions here.
          </p>
        </div>
        <Link href="/dashboard/subscriptions/discover" onClick={handleDiscoverClick}>
          <Button variant="outline">Discover Newsletters</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="text-center">
            <p>Loading your subscriptions...</p>
          </div>
        </div>
      ) : subscriptions.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {subscriptions.map((subscription) => (
            <Card key={subscription.subscriptionId} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <h3 className="text-xl font-semibold break-words">
                    {subscription.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {subscription.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-[#F2F3D9] text-[#030027] hover:bg-[#F2F3D9]/90"
                      >
                        {tag}
                      </Badge>
                    ))}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                      {cron2Weekday(subscription.schedule)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {subscription.summary}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/dashboard/subscriptions/${subscription.providerId}`}
                    onClick={() => handleViewArchiveClick(subscription.providerId, subscription.title)}
                  >
                    <Button variant="outline" size="sm" className="h-8">
                      View Archive
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleUnsubscribe(subscription.providerId, subscription.title)}
                  >
                    Unsubscribe
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex justify-center p-8">
          <div className="text-center">
            <p>You don't have any subscriptions yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              <Link
                href="/dashboard/subscriptions/discover"
                className="text-primary hover:underline"
              >
                Discover newsletters
              </Link>{" "}
              to get started.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
