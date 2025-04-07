"use client";

import { Skeleton } from "@/components/ui/skeleton";

function LetterSkeleton() {
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

export default function Loading() {
  return <LetterSkeleton />;
}
