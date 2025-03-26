"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Filter,
  Mail,
  Newspaper,
  Rocket,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 flex flex-col items-center text-center gap-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
          Stay Informed Effortlessly with{" "}
          <span className="text-[#FFB800]">AI-Powered Newsletters</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Infoscribe automatically summarizes the latest news in your chosen
          categories and delivers a curated newsletter to your inbox.
        </p>
        <Link href="/auth/signup">
          <Button
            size="lg"
            className="mt-8 bg-[#F2F3D9] text-[#030027] hover:bg-[#F2F3D9]/90"
          >
            Get Started for Free
          </Button>
        </Link>
      </section>

      {/* Key Features Section */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-16">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 flex flex-col gap-4 items-start">
            <div className="p-3 bg-[#FFB800]/10 rounded-lg">
              <Sparkles className="w-6 h-6 text-[#FFB800]" />
            </div>
            <h3 className="text-xl font-semibold">
              AI-Powered News Summarization
            </h3>
            <p className="text-muted-foreground">
              Infoscribe gathers the latest news, summarizes key insights using
              AI, and removes duplicate content through similarity analysis.
            </p>
          </Card>
          <Card className="p-6 flex flex-col gap-4 items-start">
            <div className="p-3 bg-[#FFB800]/10 rounded-lg">
              <Mail className="w-6 h-6 text-[#FFB800]" />
            </div>
            <h3 className="text-xl font-semibold">
              Fully Automated Newsletter Delivery
            </h3>
            <p className="text-muted-foreground">
              Select your preferred news categories, and Infoscribe
              automatically compiles and sends newsletters every Monday.
            </p>
          </Card>
          <Card className="p-6 flex flex-col gap-4 items-start">
            <div className="p-3 bg-[#FFB800]/10 rounded-lg">
              <Settings className="w-6 h-6 text-[#FFB800]" />
            </div>
            <h3 className="text-xl font-semibold">
              Personalized News Curation
            </h3>
            <p className="text-muted-foreground">
              Unlike generic news feeds, Infoscribe is designed for personalized
              curation with smart learning capabilities.
            </p>
          </Card>
        </div>
      </section>

      {/* Problems Solved Section */}
      <section className="container mx-auto px-4 py-24 bg-secondary/50">
        <h2 className="text-3xl font-bold text-center mb-16">
          Problems We Solve
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center gap-4">
            <Clock className="w-12 h-12 text-[#FFB800]" />
            <h3 className="text-xl font-semibold">Time Constraints</h3>
            <p className="text-muted-foreground">
              Get only the essential news without spending hours browsing.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <Filter className="w-12 h-12 text-[#FFB800]" />
            <h3 className="text-xl font-semibold">Information Overload</h3>
            <p className="text-muted-foreground">
              AI filters redundant articles and curates relevant updates.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-4">
            <Newspaper className="w-12 h-12 text-[#FFB800]" />
            <h3 className="text-xl font-semibold">
              Hassle-Free News Management
            </h3>
            <p className="text-muted-foreground">
              Set it up once, and let Infoscribe handle the rest.
            </p>
          </div>
        </div>
      </section>

      {/* Future Plans Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Future Plans</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're constantly improving Infoscribe to deliver the best possible
            experience
          </p>
        </div>
        <Tabs defaultValue="filtering" className="max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="filtering">Advanced Filtering</TabsTrigger>
            <TabsTrigger value="ui">Enhanced UI/UX</TabsTrigger>
            <TabsTrigger value="enterprise">Enterprise Solutions</TabsTrigger>
          </TabsList>
          <TabsContent value="filtering" className="mt-8">
            <Card className="p-6">
              <div className="flex gap-4 items-start">
                <Rocket className="w-8 h-8 text-[#FFB800] flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    More Advanced Filtering & Recommendations
                  </h3>
                  <p className="text-muted-foreground">
                    We're developing sophisticated algorithms to better
                    understand your preferences and deliver even more relevant
                    content.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="ui" className="mt-8">
            <Card className="p-6">
              <div className="flex gap-4 items-start">
                <Rocket className="w-8 h-8 text-[#FFB800] flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Enhanced UI/UX for Subscriber Management
                  </h3>
                  <p className="text-muted-foreground">
                    A completely redesigned dashboard is coming, making it
                    easier than ever to manage your newsletter preferences.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="enterprise" className="mt-8">
            <Card className="p-6">
              <div className="flex gap-4 items-start">
                <Rocket className="w-8 h-8 text-[#FFB800] flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Team and Enterprise Solutions
                  </h3>
                  <p className="text-muted-foreground">
                    Expanding our service to support team collaboration and
                    enterprise-level newsletter management.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <Card className="max-w-4xl mx-auto p-12 bg-[#F2F3D9] text-[#030027]">
          <Users className="w-16 h-16 mx-auto mb-8 text-[#FFB800]" />
          <h2 className="text-3xl font-bold mb-4">
            Sign up today and let Infoscribe be your AI-powered news assistant!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are already saving time and staying
            informed with Infoscribe.
          </p>
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="bg-[#030027] text-[#F2F3D9] hover:bg-[#030027]/90"
            >
              Get Started for Free
            </Button>
          </Link>
        </Card>
      </section>
    </main>
  );
}
