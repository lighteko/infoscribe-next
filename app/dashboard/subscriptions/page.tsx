"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  NewspaperIcon,
  CurrencyDollarIcon,
  HeartIcon,
  BeakerIcon,
  GlobeAltIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

interface Newsletter {
  id: string;
  title: string;
  description: string;
  categories: string[];
  frequency: string;
  isSubscribed?: boolean;
  icon: any;
}

const newsletters: Newsletter[] = [
  {
    id: "1",
    title: "Tech Insights Weekly",
    description: "A weekly digest of the latest technology news, focusing on AI advancements, software development, and tech industry trends.",
    categories: ["Technology", "AI"],
    frequency: "Every Monday",
    isSubscribed: true,
    icon: NewspaperIcon
  },
  {
    id: "2",
    title: "Finance Digest",
    description: "Market analysis, investment strategies, and financial news curated by industry experts to help you make informed financial decisions.",
    categories: ["Finance", "Markets"],
    frequency: "Every Wednesday",
    isSubscribed: true,
    icon: CurrencyDollarIcon
  },
  {
    id: "3",
    title: "Health & Wellness Update",
    description: "The latest health research, wellness tips, nutrition advice, and fitness trends to help you live a healthier and more balanced life.",
    categories: ["Health", "Wellness"],
    frequency: "Every Friday",
    isSubscribed: true,
    icon: HeartIcon
  },
  {
    id: "4",
    title: "Science Today",
    description: "The latest scientific discoveries, research breakthroughs, and technological innovations from around the world.",
    categories: ["Science", "Research"],
    frequency: "Bi-weekly",
    isSubscribed: false,
    icon: BeakerIcon
  },
  {
    id: "5",
    title: "Global Politics",
    description: "Comprehensive analysis of global political events, policy changes, and international relations from expert political analysts.",
    categories: ["Politics", "International"],
    frequency: "Every Sunday",
    isSubscribed: false,
    icon: GlobeAltIcon
  }
];

export default function SubscriptionsPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subscriptions</h2>
          <p className="text-muted-foreground">
            Manage your newsletter subscriptions here.
          </p>
        </div>
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search providers..."
            className="w-full"
          />
        </div>
      </div>

      <Tabs defaultValue="my-subscriptions" className="space-y-4">
        <TabsList className="bg-background">
          <TabsTrigger value="my-subscriptions">My Subscriptions</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>

        <TabsContent value="my-subscriptions" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsletters
              .filter(newsletter => newsletter.isSubscribed)
              .map((newsletter) => (
                <Card key={newsletter.id} className="p-4">
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold break-words">{newsletter.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {newsletter.categories.map((category) => (
                        <Badge key={category} variant="secondary" className="bg-[#F2F3D9] text-[#030027] hover:bg-[#F2F3D9]/90">
                          {category}
                        </Badge>
                      ))}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                        {newsletter.frequency}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {newsletter.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <Button variant="outline" size="sm" className="h-8">
                        View Archive
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                        Unsubscribe
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="discover" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsletters
              .filter(newsletter => !newsletter.isSubscribed)
              .map((newsletter) => (
                <Card key={newsletter.id} className="p-4">
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold break-words">{newsletter.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {newsletter.categories.map((category) => (
                        <Badge key={category} variant="secondary" className="bg-[#F2F3D9] text-[#030027] hover:bg-[#F2F3D9]/90">
                          {category}
                        </Badge>
                      ))}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                        {newsletter.frequency}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {newsletter.description}
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <Button size="sm" className="h-8">
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 