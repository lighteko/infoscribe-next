"use client"; // Required for useEffect

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { sendGAEvent } from "@/lib/analytics";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    sendGAEvent('page_not_found', { path: pathname });
  }, [pathname]);

  return <div>Not Found</div>;
}
