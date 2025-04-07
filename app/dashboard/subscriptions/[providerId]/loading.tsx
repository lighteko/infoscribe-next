"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

function NewsletterSkeleton() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="h-[160px]">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5 mt-1" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mt-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return <NewsletterSkeleton />;
}
