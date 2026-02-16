import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
    {
        variants: {
            variant: {
                default:
                    "bg-petal-pink text-slate-800 shadow-sm hover:bg-petal-pink/90 focus-visible:ring-petal-pink",
                destructive:
                    "bg-red-500 text-white shadow-sm hover:bg-red-600 focus-visible:ring-red-500",
                outline:
                    "border-2 border-petal-pink bg-transparent text-slate-800 hover:bg-petal-pink/10 focus-visible:ring-petal-pink",
                secondary:
                    "bg-petal-purple text-slate-800 shadow-sm hover:bg-petal-purple/90 focus-visible:ring-petal-purple",
                success:
                    "bg-petal-green text-slate-800 shadow-sm hover:bg-petal-green/90 focus-visible:ring-petal-green",
                ghost:
                    "hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400",
                link: "text-petal-pink underline-offset-4 hover:underline",
            },
            size: {
                default: "h-12 px-5 py-3",
                sm: "h-10 rounded-md px-3 text-xs",
                lg: "h-14 rounded-lg px-8 text-base",
                icon: "h-12 w-12",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
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
