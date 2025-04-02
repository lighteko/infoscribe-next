import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Bars3Icon } from "@heroicons/react/24/outline";

interface HeaderProps {
  setMobileMenuOpen: (open: boolean) => void;
}

export function DashboardHeader({ setMobileMenuOpen }: HeaderProps) {
  return (
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
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="hidden md:flex"
        >
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
  );
}