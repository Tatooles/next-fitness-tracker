"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";

interface SidebarItem {
  title: string;
  href: string;
}

export default function Navbar({
  sidebarItems,
}: {
  sidebarItems: SidebarItem[];
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathName = usePathname();

  return (
    <header className="flex items-center justify-between border-b bg-background p-4 text-lg shadow-sm">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger className="p-2 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <span className="sr-only">Open menu</span>
          <div className="flex h-6 w-6 flex-col justify-around">
            <div className="h-0.5 w-full bg-foreground rounded-full"></div>
            <div className="h-0.5 w-full bg-foreground rounded-full"></div>
            <div className="h-0.5 w-full bg-foreground rounded-full"></div>
          </div>
        </SheetTrigger>
        <SheetContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          side="left"
          className="w-[250px] bg-background border-r p-6"
        >
          <nav className="flex flex-col space-y-2 pt-6">
            {sidebarItems.map((item) => (
              <Link
                onClick={() => setSidebarOpen(false)}
                key={item.href}
                href={item.href}
                className={cn(
                  pathName === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                  "rounded-md p-3 text-base font-medium transition-colors"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-4 p-2">
        <ThemeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
