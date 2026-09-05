import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TaskPriority, TaskStatus, ProjectStatus, UserRole } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "No date";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "Invalid date";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 30) return formatDate(dateString);
    if (diffDay > 0) return `${diffDay}d ago`;
    if (diffHour > 0) return `${diffHour}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return "just now";
  } catch {
    return "";
  }
}

export function isOverdue(deadlineString?: string | null, status?: TaskStatus): boolean {
  if (!deadlineString || status === "Completed") return false;
  try {
    const deadline = new Date(deadlineString);
    const now = new Date();
    return deadline.getTime() < now.getTime();
  } catch {
    return false;
  }
}

export function getDaysLeft(deadlineString?: string | null): number | null {
  if (!deadlineString) return null;
  try {
    const deadline = new Date(deadlineString);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}

export function getPriorityStyles(priority: TaskPriority) {
  switch (priority) {
    case "Urgent":
      return {
        badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        dot: "bg-rose-500",
        text: "text-rose-400",
      };
    case "High":
      return {
        badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        dot: "bg-amber-500",
        text: "text-amber-400",
      };
    case "Medium":
      return {
        badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        dot: "bg-indigo-500",
        text: "text-indigo-400",
      };
    case "Low":
    default:
      return {
        badge: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
        dot: "bg-zinc-400",
        text: "text-zinc-400",
      };
  }
}

export function getStatusStyles(status: TaskStatus | ProjectStatus) {
  switch (status) {
    case "Completed":
      return {
        badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        dot: "bg-emerald-500",
        border: "border-emerald-500/30",
      };
    case "In Progress":
    case "Active":
      return {
        badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        dot: "bg-indigo-500",
        border: "border-indigo-500/30",
      };
    case "Planning":
    case "To Do":
      return {
        badge: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
        dot: "bg-zinc-400",
        border: "border-zinc-800",
      };
    case "On Hold":
      return {
        badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        dot: "bg-amber-500",
        border: "border-amber-500/30",
      };
    default:
      return {
        badge: "bg-zinc-500/10 text-zinc-300 border-zinc-500/20",
        dot: "bg-zinc-400",
        border: "border-zinc-800",
      };
  }
}

export function getRoleBadgeStyles(role: UserRole) {
  switch (role) {
    case "ADMIN":
      return "bg-rose-500/10 text-rose-400 border-rose-500/20 font-medium";
    case "PROJECT_LEAD":
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-medium";
    case "MEMBER":
      return "bg-zinc-500/10 text-zinc-300 border-zinc-500/20 font-medium";
    default:
      return "bg-zinc-500/10 text-zinc-300 border-zinc-500/20";
  }
}
