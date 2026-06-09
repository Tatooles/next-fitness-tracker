"use client";
import { Download, Dumbbell, Home, ListChecks, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
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
import { useState, useEffect } from "react";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Workouts", url: "/workouts", icon: Dumbbell },
  { title: "Exercises", url: "/exercises", icon: ListChecks },
  { title: "Export", url: "/export", icon: Download },
];

export function AppSidebar() {
  const { setOpenMobile, isMobile } = useSidebar();
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
  fetch("/api/auth/me")
    .then((res) => res.json())
    .then((data) => {
      if (data.isLoggedIn) {
        setUsername(data.username);
      } else {
        setUsername("");
      }
    })
    .catch(() => {
      setUsername("");
    });
}, [pathname]);

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
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
        <SidebarMenu className="gap-2">
          {username && (
            <SidebarMenuItem>
              <div className="border-sidebar-border bg-sidebar-accent/45 flex items-center gap-3 rounded-lg border px-3 py-3">
                <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-full font-bold uppercase">
                  {username[0]}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-semibold">
                    {username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <ThemeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}