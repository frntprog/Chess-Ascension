import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-[#cbd5e1] bg-[#fef3c7] text-[#78350f] hover:bg-[#fde68a]",
        secondary:
          "border-[#cbd5e1] bg-[#e2e8f0] text-[#1e293b] hover:bg-[#cbd5e1]",
        destructive:
          "border-[#fecaca] bg-[#fee2e2] text-[#991b1b] hover:bg-[#fecaca]",
        outline: "text-foreground border-foreground/20 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
