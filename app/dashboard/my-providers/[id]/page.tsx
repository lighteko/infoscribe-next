"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  deleteProviderById,
  getProviderById,
} from "@/lib/api/requests/provider.requests";
import { Provider } from "@/lib/api/types/provider.types";
import { cron2Weekday } from "@/lib/utils";
import {
  ArrowLeftIcon,
  ChartBarIcon,
  EnvelopeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function MyProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const providerId = params.id as string;

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        setIsLoading(true);
        const response = await getProviderById(providerId);
        setProvider(response.data);
      } catch (error) {
        console.error("Failed to fetch provider details:", error);
        toast({
          title: "Error",
          description: "Failed to load provider details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (providerId) {
      fetchProvider();
    }
  }, [providerId]);

  const handleDelete = async () => {
    await deleteProviderById(providerId);
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex justify-center items-center h-[400px]">
          <p>Loading provider details...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex justify-center items-center h-[400px]">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-medium">Provider not found</h2>
            <p className="text-muted-foreground">
              The provider you are looking for does not exist or has been
              removed.
            </p>
            <Button onClick={() => router.push("/dashboard/my-providers")}>
              Back to Providers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-1"
          onClick={() => router.push("/dashboard/my-providers")}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back to Providers</span>
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() =>
              router.push(`/dashboard/my-providers/${providerId}/edit`)
            }
          >
            <PencilIcon className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <TrashIcon className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <CardHeader className="p-0 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">
                {provider.title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 mt-2">
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
          </div>
        </CardHeader>

        <CardContent className="p-0 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">
              {provider.summary || "No description provided."}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <dt className="text-sm text-muted-foreground">Schedule</dt>
                <dd>Weekly on {cron2Weekday(provider.schedule)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Language</dt>
                <dd>{provider.locale}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Subscribers</dt>
                <dd className="flex items-center">
                  <span className="font-medium">{provider.subscribers}</span>
                  {provider.subscribers > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {provider.subscribers >= 1000 ? "Popular" : "Active"}
                    </Badge>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="pt-4 border-t flex flex-col sm:flex-row gap-3">
            <Button className="flex items-center gap-1">
              <ChartBarIcon className="h-4 w-4" />
              View Analytics
            </Button>
            <Button variant="outline" className="flex items-center gap-1">
              <EnvelopeIcon className="h-4 w-4" />
              Send Test Newsletter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
