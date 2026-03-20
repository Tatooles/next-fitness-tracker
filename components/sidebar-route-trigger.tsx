"use client";

import { usePathname } from "next/navigation";

import { SidebarTrigger } from "@/components/ui/sidebar";

const workoutFormRoutePatterns = [
  /^\/workouts\/create$/,
  /^\/workouts\/edit\/[^/]+$/,
  /^\/workouts\/duplicate\/[^/]+$/,
];

export function SidebarRouteTrigger() {
  const pathname = usePathname();

  const isWorkoutFormRoute = workoutFormRoutePatterns.some((pattern) =>
    pattern.test(pathname),
  );

  if (isWorkoutFormRoute) {
    return null;
  }

  return <SidebarTrigger />;
}
