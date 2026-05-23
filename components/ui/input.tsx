import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "h-12 w-full rounded-[10px] border border-border bg-card px-3 text-base text-foreground",
        "focus:border-foreground focus:outline-none focus:ring-[3px] focus:ring-foreground/10",
        "placeholder:text-faint",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
