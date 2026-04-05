"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export type WorkoutSaveStatus =
  | "not_saved"
  | "unsaved"
  | "saving"
  | "saved"
  | "failed";

const saveStatusConfig: Record<
  WorkoutSaveStatus,
  { label: string; className: string }
> = {
  not_saved: {
    label: "Not saved",
    className:
      "border-border/70 bg-muted/80 text-muted-foreground dark:bg-muted/40",
  },
  unsaved: {
    label: "Unsaved changes",
    className:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
  },
  saving: {
    label: "Saving",
    className:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300",
  },
  saved: {
    label: "Saved",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
  },
  failed: {
    label: "Save failed",
    className:
      "border-destructive/20 bg-destructive/10 text-destructive dark:border-destructive/30 dark:bg-destructive/15",
  },
};

interface WorkoutFormActionHeaderProps {
  saveStatus: WorkoutSaveStatus;
}

export default function WorkoutFormActionHeader({
  saveStatus,
}: WorkoutFormActionHeaderProps) {
  const status = saveStatusConfig[saveStatus];

  return (
    <div
      className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-xl"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="flex px-3 py-3">
        <SidebarTrigger className="size-9" />
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          <p
            aria-live="polite"
            className={cn(
              "inline-flex max-w-full items-center overflow-hidden rounded-full border px-3 py-1 text-sm font-semibold whitespace-nowrap shadow-xs transition-colors sm:px-3.5",
              status.className,
            )}
          >
            <span className="truncate">{status.label}</span>
          </p>
          <Button type="submit" disabled={saveStatus === "saving"}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
