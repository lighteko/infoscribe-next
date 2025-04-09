"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { sendGAEvent } from "@/lib/analytics";

const plans = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Free",
    description: "Free plan - Up to 3 keywords and subscriptions",
    price: "$0.00",
    duration: "Forever",
    features: [
      `Up to 3 keywords`,
      `Up to 2 subscriptions`,
      `Email delivery`,
      `Web access to archives`,
    ],
    cta: "Get Started",
    ctaLink: "/register",
    popular: false,
    maxKeywords: 3,
    maxSubscriptions: 2,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Basic",
    description: "Basic plan - Up to 10 keywords and subscriptions",
    price: "$9.99",
    duration: "per month",
    features: [
      `Up to 10 keywords`,
      `Up to 10 subscriptions`,
      `Priority email delivery`,
      `Full archive access`,
      `Custom folders`,
    ],
    cta: "Upgrade to Basic",
    ctaLink: "/register?plan=basic",
    popular: true,
    maxKeywords: 10,
    maxSubscriptions: 10,
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Pro",
    description: "Pro plan - Unlimited keywords and subscriptions",
    price: "$19.99",
    duration: "per month",
    features: [
      `Unlimited keywords`,
      `Unlimited subscriptions`,
      `Priority email delivery`,
      `Full archive access`,
      `Custom folders`,
      `API access`,
      `Priority support`,
    ],
    cta: "Upgrade to Pro",
    ctaLink: "/register?plan=pro",
    popular: false,
    maxKeywords: 999,
    maxSubscriptions: 999,
  },
];

export default function PricingPlansPage() {
  const handlePlanCTAClick = (planName: string, planId: string) => {
    sendGAEvent('select_plan', { 
      plan_name: planName,
      plan_id: planId,
      source: 'pricing_page'
    });
  };

  const handleContactClick = () => {
    sendGAEvent('contact_us_click', { source: 'pricing_page' });
  };

  return (
    <div className="container px-4 py-6 md:py-12 max-w-6xl mx-auto">
      <div className="text-center mb-6 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2 md:mb-3">
          Choose Your Plan
        </h1>
        <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Select the perfect subscription that suits your needs. Upgrade or
          downgrade at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col ${
              plan.name === "Basic" ? "border-primary shadow-lg relative" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-primary text-primary-foreground text-xs px-3 py-1 rounded">
                Popular
              </div>
            )}
            <CardHeader className="pb-2">
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription className="text-sm">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-2">
              <div className="mb-4">
                <span className="text-2xl md:text-3xl font-bold">
                  {plan.price}
                </span>
                <span className="text-muted-foreground ml-1">
                  {plan.duration}
                </span>
              </div>
              <ul className="space-y-2 text-sm md:text-base">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-4 w-4 text-primary mr-2 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full"
                variant={plan.name === "Basic" ? "default" : "outline"}
                onClick={() => handlePlanCTAClick(plan.name, plan.id)}
              >
                <Link href={`${plan.ctaLink}&planId=${plan.id}`}>
                  {plan.cta}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8 md:mt-12">
        <h2 className="text-xl md:text-2xl font-semibold mb-3">
          Not sure which plan is right for you?
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mb-4 max-w-xl mx-auto">
          Contact our sales team for a personalized consultation or try the free
          plan to get started.
        </p>
        <Button asChild variant="outline" onClick={handleContactClick}>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
} 