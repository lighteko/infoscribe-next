"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubscriptionRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pricing-plans");
  }, [router]);

  return null;
}
