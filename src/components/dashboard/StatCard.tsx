import React from "react";
import { Card } from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  variant?: "indigo" | "rose" | "emerald" | "amber" | "zinc";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  variant = "indigo",
}: StatCardProps) {
  const variantStyles = {
    indigo: {
      iconBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      glow: "hover:border-indigo-500/30 hover:shadow-indigo-500/5",
    },
    rose: {
      iconBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      glow: "hover:border-rose-500/30 hover:shadow-rose-500/5",
    },
    emerald: {
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      glow: "hover:border-emerald-500/30 hover:shadow-emerald-500/5",
    },
    amber: {
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      glow: "hover:border-amber-500/30 hover:shadow-amber-500/5",
    },
    zinc: {
      iconBg: "bg-zinc-800 text-zinc-300 border-zinc-700",
      glow: "hover:border-zinc-700",
    },
  };

  const style = variantStyles[variant];

  return (
    <Card hover className={cn("relative overflow-hidden p-5 flex flex-col justify-between", style.glow)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-zinc-400 tracking-tight">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1.5 tracking-tight">
            {value}
          </h3>
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0",
            style.iconBg
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(description || trend) && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-800/60 text-xs">
          {trend && (
            <span
              className={cn(
                "font-semibold",
                trend.isPositive ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {trend.value}
            </span>
          )}
          {description && <span className="text-zinc-400">{description}</span>}
        </div>
      )}
    </Card>
  );
}
