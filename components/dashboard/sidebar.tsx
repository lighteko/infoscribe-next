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
  ArrowRightStartOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { logOut } from "@/lib/api/requests/auth.requests";

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

interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onLogout: () => Promise<void>;
}

export function DashboardSidebar({ 
  mobileMenuOpen, 
  setMobileMenuOpen,
  onLogout
}: SidebarProps) {
  const pathname = usePathname();
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar content */}
      <div
        className={`fixed md:sticky md:top-0 md:flex md:w-64 md:flex-col h-screen z-50 transition-transform duration-300 ease-in-out bg-background border-r ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
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
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
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

            <div className="p-2 mt-auto">
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={onLogout}
              >
                <ArrowRightStartOnRectangleIcon className="h-5 w-5 mr-3" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}