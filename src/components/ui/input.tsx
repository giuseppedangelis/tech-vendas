import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-lg border border-input bg-[var(--surface-1)] px-3.5 py-2 text-sm transition-all duration-200 outline-none backdrop-blur-sm file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/10 focus-visible:bg-[var(--surface-2)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/10 dark:bg-[oklch(0.15_0.008_55/0.6)] dark:focus-visible:bg-[oklch(0.18_0.008_55/0.8)] dark:disabled:bg-input/50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
