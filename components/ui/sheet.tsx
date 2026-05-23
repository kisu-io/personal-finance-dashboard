"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

/** Bottom sheet, mobile style. */
const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { title?: string }
>(({ className, children, title, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92vh] w-full max-w-[480px] flex-col overflow-y-auto rounded-t-[18px] bg-background px-4 pb-6 pt-2 animate-sheet-up safe-bottom",
        className
      )}
      {...props}
    >
      <div className="mx-auto mb-2 mt-2 h-[5px] w-9 rounded-full bg-[#D1D1D6]" />
      <DialogPrimitive.Title className="mx-0.5 mb-4 mt-1.5 text-[21px] font-bold">{title}</DialogPrimitive.Title>
      {children}
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = DialogPrimitive.Content.displayName;

export { Sheet, SheetTrigger, SheetClose, SheetContent };
