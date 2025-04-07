import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";

interface DashboardHeaderProps {
  setMobileMenuOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export function DashboardHeader({
  setMobileMenuOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <button
        type="button"
        className="hidden md:flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-6 w-6" />
        ) : (
          <ChevronLeft className="h-6 w-6" />
        )}
        <span className="sr-only">
          {sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        </span>
      </button>
      <button
        type="button"
        className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground"
        onClick={() => setMobileMenuOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>
      <div className="ml-auto">
        <Link href="/pricing-plans">
          <Button variant="outline">Upgrade Your Plan</Button>
        </Link>
      </div>
    </header>
  );
}