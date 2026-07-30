import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-sm)] text-sm font-medium transition-all cursor-pointer relative overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-success disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] after:content-[''] after:absolute after:inset-0 after:bg-white/20 after:scale-0 after:rounded-full after:transition-transform after:duration-500 active:after:scale-[2]",
  {
    variants: {
      variant: {
        primary: "bg-success text-background hover:bg-accent",
        secondary: "bg-surface text-text-primary border border-border hover:bg-border",
        ghost: "hover:bg-surface text-text-primary",
        danger: "text-danger border border-danger hover:bg-danger-bg",
        link: "text-text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
