import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "subtle";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const variants = {
      primary:
        "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-500/25 border border-indigo-500/30",
      secondary:
        "bg-zinc-800 text-zinc-100 hover:bg-zinc-700/80 border border-zinc-700/60 shadow-sm",
      outline:
        "bg-transparent text-zinc-200 border border-zinc-700/80 hover:bg-zinc-800/60 hover:text-white",
      ghost:
        "bg-transparent text-zinc-300 hover:bg-zinc-800/60 hover:text-white",
      destructive:
        "bg-rose-600/90 text-white hover:bg-rose-600 shadow-sm shadow-rose-600/20 border border-rose-500/30",
      subtle:
        "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20",
    };

    const sizes = {
      sm: "text-xs px-2.5 py-1.5 gap-1.5 h-8",
      md: "text-sm px-3.5 py-2 gap-2 h-9",
      lg: "text-sm px-5 py-2.5 gap-2.5 h-11",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
