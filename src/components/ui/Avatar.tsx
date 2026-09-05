import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showBorder?: boolean;
}

export function Avatar({
  src,
  name = "User",
  size = "md",
  className,
  showBorder = false,
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const getInitials = (n?: string | null) => {
    if (!n) return "U";
    const parts = n.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const sizes = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-7 h-7 text-xs",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
    xl: "w-14 h-14 text-base",
  };

  const colors = [
    "bg-indigo-600/30 text-indigo-300 border-indigo-500/30",
    "bg-violet-600/30 text-violet-300 border-violet-500/30",
    "bg-emerald-600/30 text-emerald-300 border-emerald-500/30",
    "bg-sky-600/30 text-sky-300 border-sky-500/30",
    "bg-amber-600/30 text-amber-300 border-amber-500/30",
    "bg-rose-600/30 text-rose-300 border-rose-500/30",
  ];

  // Pick stable color based on name hash
  const colorIndex = (name || "U")
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center font-medium select-none overflow-hidden shrink-0 border border-zinc-700/60 bg-zinc-800 text-zinc-200",
        sizes[size],
        showBorder && "ring-2 ring-[#090b10]",
        className
      )}
    >
      {src && !hasError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name || "Avatar"}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className={cn("w-full h-full flex items-center justify-center font-semibold", colors[colorIndex])}>
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}
