"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderKanban,
  Users2,
  CheckSquare,
  Users,
  Bell,
  BarChart3,
  Settings,
  Sparkles,
  ShieldCheck,
  UserCheck,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, role, isAdmin, isProjectLead, switchDemoRole } = useAuth();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN", "PROJECT_LEAD", "MEMBER"],
    },
    {
      name: "Projects",
      href: "/projects",
      icon: FolderKanban,
      roles: ["ADMIN", "PROJECT_LEAD", "MEMBER"],
    },
    {
      name: "Tasks & Board",
      href: "/tasks",
      icon: CheckSquare,
      roles: ["ADMIN", "PROJECT_LEAD", "MEMBER"],
    },
    {
      name: "Teams",
      href: "/teams",
      icon: Users2,
      roles: ["ADMIN", "PROJECT_LEAD", "MEMBER"],
    },
    {
      name: "Members",
      href: "/members",
      icon: Users,
      roles: ["ADMIN", "PROJECT_LEAD", "MEMBER"],
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      roles: ["ADMIN", "PROJECT_LEAD", "MEMBER"],
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: Bell,
      roles: ["ADMIN", "PROJECT_LEAD", "MEMBER"],
    },
  ];

  const filteredNav = navigation.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-64 bg-[#0a0d14] border-r border-zinc-800/80 shrink-0 h-screen sticky top-0 select-none z-30",
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-zinc-800/80">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-white">ClubFlow</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 font-mono font-medium border border-indigo-500/20">
              v1.0
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 truncate font-normal">
            TechVerse Club
          </span>
        </div>
      </div>

      {/* Role Indicator Banner */}
      <div className="px-4 py-3 border-b border-zinc-800/50 bg-[#0e131f]/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 text-[11px] font-medium flex items-center gap-1.5">
            {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />}
            {isProjectLead && <UserCheck className="w-3.5 h-3.5 text-indigo-400" />}
            {!isAdmin && !isProjectLead && <User className="w-3.5 h-3.5 text-zinc-400" />}
            Active Role
          </span>
          <Badge variant="role" role={role} />
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-2">
          Management
        </div>
        {filteredNav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 relative",
                isActive
                  ? "bg-indigo-600/10 text-indigo-400 font-semibold border border-indigo-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  isActive ? "text-indigo-400" : "text-zinc-400 group-hover:text-zinc-200"
                )}
              />
              <span>{item.name}</span>
              {isActive && (
                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500" />
              )}
            </Link>
          );
        })}

        <div className="pt-5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-2">
          Preferences
        </div>
        <Link
          href="/settings"
          className={cn(
            "group flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150",
            pathname === "/settings"
              ? "bg-indigo-600/10 text-indigo-400 font-semibold border border-indigo-500/20"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          )}
        >
          <Settings className="w-4 h-4 text-zinc-400 group-hover:text-zinc-200" />
          <span>Club Settings</span>
        </Link>
      </div>

      {/* Demo Persona Switcher Box */}
      <div className="p-3 border-t border-zinc-800/80 bg-[#080b12]">
        <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 font-medium">Quick Role Switcher</span>
            <span className="text-[9px] px-1 py-0.2 bg-amber-500/10 text-amber-400 rounded border border-amber-500/20">
              Demo
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => switchDemoRole("admin")}
              className={cn(
                "px-2 py-1 text-[10px] rounded font-medium transition-all text-center",
                isAdmin
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
              )}
              title="Switch to Admin (Alex Rivera)"
            >
              Admin
            </button>
            <button
              onClick={() => switchDemoRole("lead")}
              className={cn(
                "px-2 py-1 text-[10px] rounded font-medium transition-all text-center",
                isProjectLead
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
              )}
              title="Switch to Lead (Sarah Chen)"
            >
              Lead
            </button>
            <button
              onClick={() => switchDemoRole("member")}
              className={cn(
                "px-2 py-1 text-[10px] rounded font-medium transition-all text-center",
                !isAdmin && !isProjectLead
                  ? "bg-zinc-700 text-zinc-200 border border-zinc-600"
                  : "bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
              )}
              title="Switch to Member (Liam Davis)"
            >
              Member
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
