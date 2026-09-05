import React from "react";
import { cn, getPriorityStyles, getStatusStyles, getRoleBadgeStyles } from "@/lib/utils";
import { TaskPriority, TaskStatus, ProjectStatus, UserRole } from "@/types";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "priority" | "status" | "role";
  priority?: TaskPriority;
  status?: TaskStatus | ProjectStatus;
  role?: UserRole;
  showDot?: boolean;
}

export function Badge({
  className,
  variant = "default",
  priority,
  status,
  role,
  showDot = true,
  children,
  ...props
}: BadgeProps) {
  if (variant === "priority" && priority) {
    const style = getPriorityStyles(priority);
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
          style.badge,
          className
        )}
        {...props}
      >
        {showDot && <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />}
        {children || priority}
      </div>
    );
  }

  if (variant === "status" && status) {
    const style = getStatusStyles(status);
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
          style.badge,
          className
        )}
        {...props}
      >
        {showDot && <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />}
        {children || status}
      </div>
    );
  }

  if (variant === "role" && role) {
    const style = getRoleBadgeStyles(role);
    const label =
      role === "ADMIN"
        ? "Admin"
        : role === "PROJECT_LEAD"
        ? "Project Lead"
        : "Member";
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border font-medium",
          style,
          className
        )}
        {...props}
      >
        {children || label}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
