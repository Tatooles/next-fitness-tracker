"use client";

import { Moon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={() => setTheme("dark")}
      aria-label="Dark mode"
    >
      <Moon className="h-[1.2rem] w-[1.2rem]" />
    </Button>
  );
}
