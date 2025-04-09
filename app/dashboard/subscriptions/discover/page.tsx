"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { subscribe } from "@api/requests/subscription.request";
import { getSubscribableProviders } from "@api/requests/provider.requests";
import { Subscribable } from "@api/types/provider.types";
import { toast } from "@/hooks/use-toast";
import { cron2Weekday } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function DiscoverPage() {
  const [subscribables, setSubscribables] = useState<Subscribable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSubscribables = async () => {
      try {
        setIsLoading(true);
        const providersResponse = await getSubscribableProviders();
        if (providersResponse.data) {
          setSubscribables(
            providersResponse.data.map((provider: Subscribable) => ({
              ...provider,
              schedule: provider.schedule,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch subscribables:", error);
        toast({
          title: "Error",
          description: "Failed to load available newsletters. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscribables();
  }, []);

  const handleSubscribe = async (providerId: string) => {
    try {
      await subscribe(providerId);
      setSubscribables((prevState) =>
        prevState.filter((sub) => sub.providerId !== providerId)
      );

      toast({
        title: "Subscribed",
        description: "You have successfully subscribed to the newsletter.",
      });

      // Redirect to subscriptions page after successful subscription
      router.push("/dashboard/subscriptions");
    } catch (error) {
      console.error("Failed to subscribe:", error);
      toast({
        title: "Error",
        description: "Failed to subscribe to the newsletter. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Discover</h2>
          <p className="text-muted-foreground">
            Find and subscribe to new newsletters.
          </p>
        </div>
      </div>

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
    </div>
  );
} 