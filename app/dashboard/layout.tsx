"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  HomeIcon,
  UserGroupIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  ArrowLeftIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "My Providers", href: "/dashboard/providers", icon: UserGroupIcon },
  {
    name: "Subscriptions",
    href: "/dashboard/subscriptions",
    icon: EnvelopeIcon,
  },
  { name: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen h-screen overflow-hidden">
      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar for both mobile and desktop */}
      <div 
        className={`fixed md:sticky md:top-0 md:flex md:w-64 md:flex-col h-screen z-50 transition-transform duration-300 ease-in-out bg-background border-r ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between flex-shrink-0 px-4 py-5">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span className="text-xl font-bold">Infoscribe</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center p-4 border-t mt-auto">
            <div className="flex items-center flex-1">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-sm font-medium">JD</span>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">
                  john@example.com
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={() => window.location.href = '/'}
              >
                <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="border-b sticky top-0 bg-background z-10">
          <div className="flex h-16 items-center px-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden mr-2"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" asChild className="hidden md:flex">
              <Link href="/dashboard">
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
            </Button>
            <div className="ml-auto">
              <Link href="/upgrade">
                <Button variant="outline">Upgrade to Pro</Button>
              </Link>
            </div>
          </div>
        </div>
        <main className="flex-1 pb-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}