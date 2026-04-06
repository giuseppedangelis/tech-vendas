import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border border-transparent px-2 py-0.5 text-xs whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring/30 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "rounded-md bg-primary text-primary-foreground font-semibold",
        secondary:
          "rounded-md bg-secondary text-secondary-foreground font-medium",
        destructive:
          "rounded-md bg-destructive/10 text-destructive dark:bg-destructive/15 font-medium",
        outline:
          "rounded-md border-border text-foreground font-medium",
        ghost:
          "rounded-md hover:bg-muted hover:text-muted-foreground font-medium",
        link: "text-primary underline-offset-4 hover:underline font-medium",
        glass:
          "rounded-md glass font-semibold",
        success:
          "rounded-md bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 font-medium",
        warning:
          "rounded-md bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 font-medium",
        info:
          "rounded-md bg-sky-500/10 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400 font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
