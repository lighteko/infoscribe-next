"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { sendGAEvent } from "@/lib/analytics";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    sendGAEvent('page_not_found', { path: pathname, context: 'dashboard' });
  }, [pathname]);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-64px)] p-4">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-xl mb-6">Page not found</p>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/dashboard">
        <Button>Return to Dashboard</Button>
      </Link>
    </div>
  );
} 