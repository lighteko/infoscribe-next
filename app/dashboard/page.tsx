"use client";

import { useState, useEffect } from "react";
import { getUserInbox } from "@/lib/api/requests/letter.requests";
import { LetterInbox } from "@/lib/api/types/letter.types";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDistance, format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  InboxIcon,
  EnvelopeIcon,
  ArrowRightIcon,
  UserGroupIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRouter } from "next/navigation";

function InboxSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-60" />
                  <Skeleton className="h-4 w-full max-w-md" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-20 rounded" />
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [inbox, setInbox] = useState<LetterInbox[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  // Group newsletters by provider
  const groupedNewsletters = inbox.reduce((groups, letter) => {
    const provider = letter.providerTitle || "Unknown Provider";
    if (!groups[provider]) {
      groups[provider] = [];
    }
    groups[provider].push(letter);
    return groups;
  }, {} as Record<string, LetterInbox[]>);

  // Count providers and total newsletters
  const totalProviders = Object.keys(groupedNewsletters).length;
  const totalNewsletters = inbox.length;

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const fetchInbox = async () => {
      try {
        setIsLoading(true);
        const response = await getUserInbox();

        // Handle different possible response formats
        if (response.data && Array.isArray(response.data.letters)) {
          setInbox(response.data.letters);
        } else if (response.letters && Array.isArray(response.letters)) {
          setInbox(response.letters);
        } else if (Array.isArray(response)) {
          setInbox(response);
        } else {
          console.error("Unexpected response format:", response);
          setError("Unexpected response format from server");
        }
      } catch (err: any) {
        console.error("Failed to load inbox:", err);
        const errorMessage =
          typeof err === "object" && err.message
            ? err.message
            : "Failed to load inbox";

        setError(errorMessage);
        toast({
          title: "Error",
          description: "Failed to load inbox. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInbox();
  }, [user, isAuthenticated, router]);

  if (isLoading) {
    return <InboxSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Inbox</h2>
          <p className="text-muted-foreground">
            Your latest newsletters all in one place
          </p>
        </div>

        {inbox.length > 0 && (
          <div className="flex flex-wrap gap-4">
            <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
              <EnvelopeIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{totalNewsletters}</p>
                <p className="text-xs text-muted-foreground">Newsletters</p>
              </div>
            </div>
            <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
              <UserGroupIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{totalProviders}</p>
                <p className="text-xs text-muted-foreground">Providers</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {error ? (
        <div className="bg-destructive/10 p-6 rounded-lg flex justify-center items-center mt-6">
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
      ) : inbox.length === 0 ? (
        <div className="bg-muted/50 p-12 rounded-lg flex justify-center items-center mt-6 min-h-[200px]">
          <div className="text-center max-w-md">
            <InboxIcon className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Your inbox is empty</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to providers to receive newsletters in your inbox
            </p>
            <Link href="/dashboard/subscriptions">
              <Button>View Subscriptions</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8 mt-6">
          {Object.entries(groupedNewsletters).map(([providerName, letters]) => (
            <div key={providerName} className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{providerName}</h3>
                <Badge variant="outline" className="font-normal">
                  {letters.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {letters.map((letter) => (
                  <Link
                    href={`/dashboard/subscriptions/${letter.providerId}/letters/${letter.letterId}`}
                    key={letter.letterId}
                  >
                    <Card className="group h-full relative overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer border border-border/40 hover:border-primary/30">
                      {/* Background gradient overlay with lower z-index */}
                      <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Top gradient bar with higher z-index than background but lower than content */}
                      <div className="absolute top-0 left-0 z-10 w-full h-1 bg-gradient-to-r from-primary/80 to-primary/30"></div>

                      {/* All content sections with higher z-index */}
                      <div className="relative z-20 flex flex-col h-full">
                        <CardHeader className="pb-2">
                          <div className="flex items-start gap-3">
                            <div className="bg-primary/10 text-primary rounded-full p-2 mt-0.5">
                              <DocumentTextIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors duration-300">
                                {letter.title}
                              </h4>
                              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                <span className="text-primary font-medium">
                                  {providerName}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="py-2 flex-grow">
                          <div className="border-t border-border/30 pt-3 flex items-center justify-between">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <div className="flex items-center mr-3">
                                <CalendarIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-muted-foreground/70" />
                                <span className="text-xs">
                                  {format(
                                    new Date(letter.createdDate),
                                    "MMM d, yyyy"
                                  )}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground/60">
                                {formatDistance(
                                  new Date(letter.createdDate),
                                  new Date(),
                                  { addSuffix: true }
                                )}
                              </span>
                            </div>
                            <Badge
                              variant="secondary"
                              className="text-xs font-normal bg-primary/10 text-primary hover:bg-primary/20"
                            >
                              Newsletter
                            </Badge>
                          </div>
                        </CardContent>

                        <CardFooter className="pt-0 flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300"
                          >
                            Read newsletter
                            <ArrowRightIcon className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                          </Button>
                        </CardFooter>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
