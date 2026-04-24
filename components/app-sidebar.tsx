"use client";

import { Download, Dumbbell, Home, ListChecks } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
];

export function AppSidebar() {
  const { setOpenMobile, isMobile } = useSidebar();
  const { user } = useUser();
  const pathname = usePathname() ?? "/";

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="gap-5 p-3">
          <SidebarGroupContent>
            <SidebarGroupLabel className="text-sidebar-foreground mb-3 h-auto px-2 py-2 text-sm font-black tracking-wide">
              <span className="flex items-center gap-2">
                <span className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 items-center justify-center rounded-md">
                  <Dumbbell className="size-4" />
                </span>
                Lifting Log
              </span>
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1.5">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    isActive={
                      item.url === "/"
                        ? pathname === item.url
                        : pathname.startsWith(item.url)
                    }
                    className="text-base font-semibold"
                  >
                    <Link
                      href={item.url}
                      onClick={handleLinkClick}
                      prefetch={item.url === "/exercises" ? false : undefined}
                    >
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
            <div className="border-sidebar-border bg-sidebar-accent/45 flex items-center gap-3 rounded-lg border px-3 py-3">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                    userButtonTrigger: "focus:shadow-none",
                  },
                }}
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold">
                  {user?.fullName || user?.username || "User"}
                </span>
                <span className="text-sidebar-foreground/55 truncate text-xs">
                  {user?.primaryEmailAddress?.emailAddress || ""}
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
