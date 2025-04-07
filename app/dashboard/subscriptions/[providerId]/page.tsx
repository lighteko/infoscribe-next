"use client";

import { useState, useEffect } from "react";
import { getLetters } from "@/lib/api/requests/letter.requests";
import { Letter } from "@/lib/api/types/letter.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  CalendarIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import { getProviderById } from "@/lib/api/requests/provider.requests";

export default function NewsletterListView() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.providerId as string;

  const [data, setData] = useState<Letter[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [providerName, setProviderName] = useState<string | null>(null);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        setIsLoading(true);
        const provider = await getProviderById(providerId);
        const response = await getLetters(providerId);

        setData(response.data.letters);
        setProviderName(provider.data.title);

        setError(null);
      } catch (err: any) {
        console.error("Failed to load newsletters:", err);
        // Extract error message if available
        const errorMessage =
          typeof err === "object" && err.message
            ? err.message
            : "Failed to load newsletters";
        setError(errorMessage);
        toast({
          title: "Error",
          description: "Failed to load newsletters. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (providerId) {
      fetchLetters();
    }
  }, [providerId]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{providerName}</h2>
          <p className="text-muted-foreground">
            View all newsletters from this provider
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard/subscriptions")}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Subscriptions
        </Button>
      </div>

      {error ? (
        <div className="bg-destructive/10 p-6 rounded-lg flex justify-center items-center">
          <div className="text-center max-w-md">
            <p className="text-destructive font-medium">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </div>
      ) : !data || data.length === 0 ? (
        <div className="bg-muted/50 p-12 rounded-lg flex justify-center items-center min-h-[200px]">
          <div className="text-center max-w-md">
            <DocumentIcon className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No newsletters found</h3>
            <p className="text-muted-foreground">
              This provider hasn't sent any newsletters yet or you've just
              subscribed.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((letter) => (
            <Link
              href={`/dashboard/subscriptions/${providerId}/letters/${letter.letterId}`}
              key={letter.letterId}
            >
              <Card className="h-full cursor-pointer hover:bg-muted/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">
                    {letter.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {formatDistance(new Date(letter.createdDate), new Date(), {
                      addSuffix: true,
                    })}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
