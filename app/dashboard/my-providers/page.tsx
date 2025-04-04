"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MyProvider } from "@/lib/api/types/provider.types";
import { getAllMyProviders } from "@/lib/api/requests/provider.requests";
import { cron2Weekday } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MyProvidersPage() {
  const [providers, setProviders] = useState<MyProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await getAllMyProviders();
        setProviders(response.data);
      } catch (error) {
        console.error("Failed to fetch providers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const handleProviderClick = (providerId: string) => {
    router.push(`/dashboard/my-providers/${providerId}`);
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex justify-center items-center h-[400px]">
          <p>Loading providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Providers</h2>
          <p className="text-muted-foreground">
            Manage your newsletter providers here.
          </p>
        </div>
        <Link href="/dashboard/my-providers/create">
          <Button className="self-start sm:self-auto">Create Provider</Button>
        </Link>
      </div>

      {providers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-[400px] space-y-4">
            <p className="text-muted-foreground text-center">
              You haven't created any providers yet.
            </p>
            <Link href="/dashboard/my-providers/create">
              <Button className="self-start sm:self-auto">
                Create your first provider
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {providers.map((provider) => (
            <Card 
              key={provider.providerId} 
              className="p-4 sm:p-6 hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleProviderClick(provider.providerId)}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {provider.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {provider.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                      <span className="text-sm text-muted-foreground">
                        • {cron2Weekday(provider.schedule)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {provider.summary}
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="font-medium">
                        {provider.subscribers}
                      </span>
                      <span className="text-muted-foreground ml-1">
                        Subscribers
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/dashboard/my-providers/${provider.providerId}`);
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Analytics
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Send Test Newsletter
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {providers.length > 0 && (
        <Card className="p-4 sm:p-6 bg-muted/50">
          <div className="space-y-2">
            <h3 className="font-semibold">Free Plan Limit Reached</h3>
            <p className="text-sm text-muted-foreground">
              You've reached the limit of 1 provider on the free plan. Upgrade
              to Pro to create unlimited providers.
            </p>
            <Button variant="default">Upgrade to Pro</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
