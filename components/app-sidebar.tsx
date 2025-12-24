"use client";

import {
  BookOpen,
  Download,
  Dumbbell,
  Home,
  ListChecks,
  Plus,
} from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import { UserButton, useUser } from "@clerk/nextjs";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Workouts",
    url: "/workouts",
    icon: Dumbbell,
  },
  {
    title: "Exercises",
    url: "/exercises",
    icon: ListChecks,
  },
  {
    title: "Export",
    url: "/export",
    icon: Download,
  },
  {
    title: "Guide",
    url: "/guide",
    icon: BookOpen,
  },
];

export function AppSidebar() {
  const { setOpenMobile, isMobile } = useSidebar();
  const { user } = useUser();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="lg" className="text-base">
                    <Link href={item.url} onClick={handleLinkClick}>
                      <item.icon className="size-5!" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                    userButtonTrigger: "focus:shadow-none",
                  },
                }}
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-base font-semibold">
                  {user?.fullName || user?.username || "User"}
                </span>
                <span className="text-muted-foreground truncate text-sm">
                  {user?.primaryEmailAddress?.emailAddress || ""}
                </span>
              </div>
              <ThemeToggle />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
