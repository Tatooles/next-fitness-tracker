"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
    <header className="flex items-center justify-between border-b-2 text-lg text-black">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger>
          <div className="p-5">
            <div className="flex h-[20px] w-[20px] flex-col justify-between overflow-hidden">
              <div className="h-[2px] w-7 bg-slate-700"></div>
              <div className="h-[2px] w-7 bg-slate-700"></div>
              <div className="h-[2px] w-7 bg-slate-700 "></div>
            </div>
          </div>
        </SheetTrigger>
        <SheetContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          side="left"
          className="w-[200px]"
        >
          <nav className="flex flex-col space-y-2">
            {sidebarItems.map((item) => (
              <Link
                onClick={() => setSidebarOpen(false)}
                key={item.href}
                href={item.href}
                className={cn(
                  pathName === item.href ? "bg-muted" : "hover:underline",
                  "w-5/6 rounded-md p-2 text-xl"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="p-5">
        <UserButton></UserButton>
      </div>
    </header>
  );
}
