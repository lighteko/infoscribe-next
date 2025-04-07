"use client";

import { useState, useEffect } from "react";
import { getLetter } from "@/lib/api/requests/letter.requests";
import { GetLetterResponse } from "@/lib/api/types/letter.types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { toast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { formatDistance, format, isValid, parseISO } from "date-fns";

// API response interface
interface LetterApiResponse {
  data: GetLetterResponse;
}

// Helper function to safely format dates
const formatDate = (dateValue: string | Date | null | undefined) => {
  if (!dateValue) return "Unknown date";
  
  // Try to parse the date
  let date: Date;
  if (typeof dateValue === "string") {
    // Try parsing as ISO first
    date = parseISO(dateValue);
    
    // If that's not valid, try a regular Date constructor
    if (!isValid(date)) {
      date = new Date(dateValue);
    }
  } else {
    date = dateValue;
  }
  
  // Check if the resulting date is valid
  if (!isValid(date)) {
    return "Unknown date";
  }
  
  return format(date, "MMM d, yyyy");
};

// Helper function to safely format relative time
const formatRelativeTime = (dateValue: string | Date | null | undefined) => {
  if (!dateValue) return "";
  
  // Try to parse the date
  let date: Date;
  if (typeof dateValue === "string") {
    date = parseISO(dateValue);
    if (!isValid(date)) {
      date = new Date(dateValue);
    }
  } else {
    date = dateValue;
  }
  
  // Check if the resulting date is valid
  if (!isValid(date)) {
    return "";
  }
  
  return formatDistance(date, new Date(), { addSuffix: true });
};

export function LetterSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <Skeleton className="h-10 w-3/4 mb-2" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-28" />
      </div>
      
      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-5/6 mb-3" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-4/6 mb-8" />
          
          <Skeleton className="h-40 w-full mb-6" />
          
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-4 w-4/5 mb-3" />
        </div>
      </div>
    </div>
  );
}

export default function LetterViewPage() {
  const router = useRouter();
  const params = useParams();
  
  // Extract params from URL
  // The URL structure is /dashboard/subscriptions/[providerId]/letters/[letterId]
  const providerId = params.providerId as string;
  const letterId = params.letterId as string;

  const [letter, setLetter] = useState<GetLetterResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        setIsLoading(true);
        
        const response = await getLetter(letterId);
        // Extract letter data from the nested 'data' property in the response
        setLetter(response.data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load newsletter:", err);
        const errorMessage = 
          typeof err === 'object' && err.message 
            ? err.message 
            : "Failed to load newsletter";
        
        setError(errorMessage);
        toast({
          title: "Error",
          description: "Failed to load newsletter. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (letterId) {
      fetchLetter();
    }
  }, [letterId]);

  if (isLoading) {
    return <LetterSkeleton />;
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          {letter && (
            <>
              <h2 className="text-3xl font-bold tracking-tight">{letter.title}</h2>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {formatDate(letter.createdDate)}
                {formatRelativeTime(letter.createdDate) && (
                  <span className="ml-1">({formatRelativeTime(letter.createdDate)})</span>
                )}
              </div>
            </>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.push(`/dashboard/subscriptions/${providerId}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Newsletters
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
      ) : letter ? (
        <div className="rounded-lg border bg-card">
          <div 
            className="p-6 prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: letter.html }}
          />
        </div>
      ) : null}
    </div>
  );
}
