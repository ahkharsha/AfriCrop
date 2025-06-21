import * as React from "react"
import { cn } from "@/lib/utils"

const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "animate-pulse rounded-md bg-muted",
      "bg-gradient-to-r from-muted/10 via-muted/30 to-muted/10",
      "bg-[length:200%_100%]",
      className
    )}
    {...props}
  />
))
Skeleton.displayName = "Skeleton"

export { Skeleton }