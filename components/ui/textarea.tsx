import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-border placeholder:text-muted-foreground focus-visible:border-ring aria-invalid:border-destructive aria-invalid:ring-destructive/30 bg-input text-foreground focus-visible:bg-input focus-visible:ring-ring/45 flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base shadow-sm shadow-black/20 transition-[border-color,box-shadow,background-color] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
