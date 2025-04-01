"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Provider {
  id: string;
  name: string;
  description: string;
  categories: string[];
  frequency: string;
  subscribers: number;
  status: "Active" | "Inactive";
}

const providers: Provider[] = [
  {
    id: "1",
    name: "Tech Insights Weekly",
    description:
      "A weekly digest of the latest technology news, focusing on AI advancements, software development, and tech industry trends.",
    categories: ["Technology", "AI"],
    frequency: "Every Monday",
    subscribers: 42,
    status: "Active",
  },
];

export default function ProvidersPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Providers</h2>
          <p className="text-muted-foreground">
            Manage your newsletter providers here.
          </p>
        </div>
        <Link href="/dashboard/providers/create">
          <Button className="self-start sm:self-auto">Create Provider</Button>
        </Link>
      </div>

      {providers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-[400px] space-y-4">
            <p className="text-muted-foreground text-center">
              You haven't created any providers yet.
            </p>
            <Button>Create your first provider</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {providers.map((provider) => (
            <Card key={provider.id} className="p-4 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{provider.name}</h3>
                      <Badge
                        variant={
                          provider.status === "Active" ? "default" : "secondary"
                        }
                      >
                        {provider.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {provider.categories.map((category) => (
                        <Badge key={category} variant="outline">
                          {category}
                        </Badge>
                      ))}
                      <span className="text-sm text-muted-foreground">
                        • {provider.frequency}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {provider.description}
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
                    variant="outline"
                    size="sm"
                    className="justify-center"
                  >
                    View Analytics
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-center"
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
