import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-semibold",
  {
    variants: {
      variant: {
        tag: "border border-border bg-background text-muted-foreground text-[10.5px] px-2.5 py-0.5",
        pos: "bg-pos-tint text-pos text-[11.5px] px-2.5 py-1",
        neg: "bg-neg-tint text-neg text-[11.5px] px-2.5 py-1",
      },
    },
    defaultVariants: { variant: "tag" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
