"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const liquidButtonVariants = cva("liquid-glass-button", {
  variants: {
    size: {
      default: "liquid-glass-button--default",
      large: "liquid-glass-button--large",
    },
  },
  defaultVariants: { size: "default" },
});

type LiquidButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof liquidButtonVariants> & { asChild?: boolean };

const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ asChild = false, className, size, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    return <Component ref={ref} className={cn(liquidButtonVariants({ size }), className)} {...props} />;
  },
);

LiquidButton.displayName = "LiquidButton";

export { LiquidButton, liquidButtonVariants };
