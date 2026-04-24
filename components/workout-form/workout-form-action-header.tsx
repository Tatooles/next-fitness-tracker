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
    className: "border-border/70 bg-secondary/80 text-muted-foreground",
  },
  unsaved: {
    label: "Unsaved changes",
    className: "border-primary/35 bg-primary/12 text-primary",
  },
  saving: {
    label: "Saving",
    className: "border-border/80 bg-card text-foreground",
  },
  saved: {
    label: "Saved",
    className: "border-border/80 bg-secondary/80 text-muted-foreground",
  },
  failed: {
    label: "Save failed",
    className: "border-destructive/35 bg-destructive/12 text-destructive",
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
      className="border-border/80 bg-background/90 sticky top-0 z-30 border-b backdrop-blur-xl"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="flex px-3 py-3 sm:px-5">
        <SidebarTrigger className="size-9" />
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          <p
            aria-live="polite"
            className={cn(
              "inline-flex max-w-full items-center overflow-hidden rounded-full border px-3 py-1 text-sm font-semibold whitespace-nowrap shadow-xs shadow-black/20 transition-colors sm:px-3.5",
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
