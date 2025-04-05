"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon } from "@heroicons/react/24/outline";
import {
  getAllMySubscriptions,
  subscribe as subscribeToNewsletter,
  unsubscribe as unsubscribeFromNewsletter,
} from "@api/requests/subscription.request";
import { getSubscribableProviders } from "@api/requests/provider.requests";
import { Subscribable } from "@api/types/provider.types";
import { Subscription } from "@api/types/subscription.types";
import { toast } from "@/hooks/use-toast";
import { cron2Weekday } from "@/lib/utils";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subscribables, setSubscribables] = useState<Subscribable[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setIsLoading(true);
        const response = await getAllMySubscriptions();
        setSubscriptions(response.data);
        const providersResponse = await getSubscribableProviders();
        if (providersResponse.data) {
          setSubscribables(
            providersResponse.data.map((provider: Subscribable) => ({
              ...provider,
              schedule: cron2Weekday(provider.schedule),
            }))
          );
        }
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

  // Subscribe to a newsletter
  const handleSubscribe = async (providerId: string) => {
    try {
      await subscribeToNewsletter(providerId);
      // Fetch updated subscriptions instead of manually updating state
      const updatedSubscriptions = await getAllMySubscriptions();
      setSubscriptions(updatedSubscriptions);

      // Remove from available subscriptions
      setSubscribables((prevState) =>
        prevState.filter((sub) => sub.providerId !== providerId)
      );

      toast({
        title: "Subscribed",
        description: "You have successfully subscribed to the newsletter.",
      });
    } catch (error) {
      console.error("Failed to subscribe:", error);
      toast({
        title: "Error",
        description: "Failed to subscribe to the newsletter. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Unsubscribe from a newsletter
  const handleUnsubscribe = async (providerId: string) => {
    try {
      await unsubscribeFromNewsletter(providerId);
      const unsubscribedNewsletter = subscriptions.find(
        (sub) => sub.providerId === providerId
      );
      setSubscriptions((prevState) =>
        prevState.filter((sub) => sub.providerId !== providerId)
      );
      if (unsubscribedNewsletter) {
        setSubscribables((prevState) => [
          ...prevState,
          {
            providerId: unsubscribedNewsletter.providerId,
            title: unsubscribedNewsletter.title,
            summary: unsubscribedNewsletter.summary,
            tags: unsubscribedNewsletter.tags,
            schedule: unsubscribedNewsletter.schedule,
          },
        ]);
      }

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

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subscriptions</h2>
          <p className="text-muted-foreground">
            Manage your newsletter subscriptions here.
          </p>
        </div>
      </div>

      <Tabs defaultValue="my-subscriptions" className="space-y-4">
        <TabsList className="bg-background">
          <TabsTrigger value="my-subscriptions">My Subscriptions</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>

        <TabsContent value="my-subscriptions" className="space-y-4">
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
                      <Button variant="outline" size="sm" className="h-8">
                        View Archive
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() =>
                          handleUnsubscribe(subscription.providerId)
                        }
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
                  Check out the Discover tab to find newsletters.
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="text-center">
                <p>Loading available subscriptions...</p>
              </div>
            </div>
          ) : subscribables.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {subscribables.map((subscription) => (
                <Card key={subscription.providerId} className="p-6">
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
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="h-8"
                        onClick={() => handleSubscribe(subscription.providerId)}
                      >
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex justify-center p-8">
              <div className="text-center">
                <p>No additional newsletters available at this time.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Check back later for more options.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
