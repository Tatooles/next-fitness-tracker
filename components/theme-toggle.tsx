"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { setTheme, theme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? theme : undefined;

  return (
    <div
      className="border-sidebar-border bg-sidebar-accent/45 grid grid-cols-3 gap-1 rounded-lg border p-1"
      role="group"
      aria-label="Theme"
    >
      {themeOptions.map((option) => {
        const Icon = option.icon;
        const isActive = activeTheme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            aria-label={`${option.label} theme`}
            aria-pressed={isActive}
            title={`${option.label} theme`}
            className={cn(
              "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:ring-sidebar-ring inline-flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-none",
              isActive &&
                "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground shadow-sm shadow-black/20",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span className="hidden min-[420px]:inline md:inline">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
