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
  isLoading: boolean;
  saveStatus: WorkoutSaveStatus;
}

export default function WorkoutFormActionHeader({
  isLoading,
  saveStatus,
}: WorkoutFormActionHeaderProps) {
  const status = saveStatusConfig[saveStatus];

  return (
    <div className="sticky top-0 z-30 -mx-3 -mt-3 mb-4 sm:-mx-6 sm:-mt-6 sm:mb-6">
      <div
        className="border-border/80 bg-background/95 supports-backdrop-filter:bg-background/80 flex items-center justify-between gap-3 border-b px-3 py-3 backdrop-blur sm:px-6"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 0.75rem)" }}
      >
        <SidebarTrigger className="size-9 shrink-0" />
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <p
            aria-live="polite"
            className={cn(
              "inline-flex max-w-full min-w-0 items-center rounded-full border px-3 py-1 text-sm font-semibold whitespace-nowrap shadow-xs transition-colors sm:px-3.5",
              status.className,
            )}
          >
            {status.label}
          </p>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-base"
            disabled={isLoading}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
