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
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function MobileNav({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { role, switchDemoRole, isAdmin, isProjectLead } = useAuth();

  if (!isOpen) return null;

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Tasks & Board", href: "/tasks", icon: CheckSquare },
    { name: "Teams", href: "/teams", icon: Users2 },
    { name: "Members", href: "/members", icon: Users },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Club Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] bg-[#0a0d14] border-r border-zinc-800 h-full flex flex-col z-10">
        <div className="h-16 px-5 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-white">ClubFlow</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 border-b border-zinc-800/80 bg-[#0e131f]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 text-[11px]">Role</span>
            <Badge variant="role" role={role} />
          </div>
        </div>

        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors",
                  isActive
                    ? "bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/20"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Demo Switcher */}
        <div className="p-3 border-t border-zinc-800 bg-[#080b12]">
          <p className="text-[10px] text-zinc-500 font-medium mb-1.5 uppercase tracking-wider">
            Switch Demo Role
          </p>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => {
                switchDemoRole("admin");
                onClose();
              }}
              className={cn(
                "px-2 py-1 text-[10px] rounded font-medium",
                isAdmin ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" : "bg-zinc-800 text-zinc-400"
              )}
            >
              Admin
            </button>
            <button
              onClick={() => {
                switchDemoRole("lead");
                onClose();
              }}
              className={cn(
                "px-2 py-1 text-[10px] rounded font-medium",
                isProjectLead ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" : "bg-zinc-800 text-zinc-400"
              )}
            >
              Lead
            </button>
            <button
              onClick={() => {
                switchDemoRole("member");
                onClose();
              }}
              className={cn(
                "px-2 py-1 text-[10px] rounded font-medium",
                !isAdmin && !isProjectLead ? "bg-zinc-700 text-zinc-200" : "bg-zinc-800 text-zinc-400"
              )}
            >
              Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
