"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useClubData } from "@/context/ClubDataContext";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatRelativeTime } from "@/lib/utils";
import {
  Bell,
  Search,
  Menu,
  ChevronRight,
  LogOut,
  User,
  Settings,
  CheckCircle2,
  AlertCircle,
  Users2,
  FolderKanban,
  Sparkles,
} from "lucide-react";

export function TopNav({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, logout } = useAuth();
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    projects,
    tasks,
    members,
  } = useClubData();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut Cmd+K or Ctrl+K for search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Breadcrumbs generation
  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return [{ name: "Dashboard", href: "/dashboard" }];

    return parts.map((part, index) => {
      const href = "/" + parts.slice(0, index + 1).join("/");
      let name = part.charAt(0).toUpperCase() + part.slice(1);
      if (part.startsWith("proj_") || part.startsWith("a111") || part.length > 20) {
        const found = projects.find((p) => p.id === part);
        name = found ? found.name : "Project Details";
      }
      return { name, href };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  // Filtered search results
  const searchResults = {
    projects: searchQuery.trim()
      ? projects.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [],
    tasks: searchQuery.trim()
      ? tasks.filter((t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [],
    members: searchQuery.trim()
      ? members.filter((m) =>
          m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.department?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [],
  };

  const hasSearchResults =
    searchResults.projects.length > 0 ||
    searchResults.tasks.length > 0 ||
    searchResults.members.length > 0;

  return (
    <>
      <header className="h-16 px-4 md:px-6 bg-[#090b10]/90 backdrop-blur-md border-b border-zinc-800/80 flex items-center justify-between sticky top-0 z-20">
        {/* Left Side: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-1.5 text-xs text-zinc-400">
            <Link
              href="/dashboard"
              className="text-zinc-400 hover:text-zinc-200 transition-colors hidden sm:inline"
            >
              ClubFlow
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.href}>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 hidden sm:inline" />
                <span
                  className={
                    idx === breadcrumbs.length - 1
                      ? "text-zinc-100 font-medium truncate max-w-[200px]"
                      : "text-zinc-400 hover:text-zinc-200"
                  }
                >
                  {crumb.name}
                </span>
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Right Side: Global Search, Notification Bell, User Menu */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-700/60 text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-all shadow-inner"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <span>Search club...</span>
            <kbd className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Notification Popover Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className="relative p-2 rounded-lg text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#090b10] animate-pulse" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#0f1420] border border-zinc-700/80 shadow-2xl p-4 text-zinc-100 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">Notifications</span>
                    {unreadNotificationsCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-400 font-medium border border-indigo-500/30">
                        {unreadNotificationsCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="py-2 max-h-72 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-zinc-500 text-center py-4">No notifications yet</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          if (n.link) {
                            router.push(n.link);
                            setIsNotifOpen(false);
                          }
                        }}
                        className={`p-2.5 rounded-lg text-xs cursor-pointer transition-all ${
                          !n.is_read
                            ? "bg-indigo-950/30 border border-indigo-500/30 text-zinc-100"
                            : "bg-zinc-900/50 hover:bg-zinc-800/60 text-zinc-300 border border-transparent"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-xs text-zinc-200">{n.title}</p>
                          <span className="text-[10px] text-zinc-500 shrink-0">
                            {formatRelativeTime(n.created_at)}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-zinc-800 text-center">
                  <Link
                    href="/notifications"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200"
                  >
                    View all notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-800/70 transition-colors"
            >
              <Avatar
                src={user?.avatar_url}
                name={user?.full_name || "User"}
                size="sm"
              />
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-medium text-zinc-200 truncate max-w-[110px]">
                  {user?.full_name || "User"}
                </span>
                <span className="text-[10px] text-zinc-400 truncate max-w-[110px]">
                  {role}
                </span>
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0f1420] border border-zinc-700/80 shadow-2xl p-2 text-zinc-100 z-50 animate-fade-in">
                <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
                  <p className="text-xs font-semibold text-white truncate">
                    {user?.full_name || "Alex Rivera"}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate">{user?.email}</p>
                  <div className="mt-1.5">
                    <Badge variant="role" role={role} />
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>My Profile</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Club Settings</span>
                </Link>

                <div className="pt-1 mt-1 border-t border-zinc-800/80">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                      router.push("/login");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Quick Search Modal (Cmd+K) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 animate-fade-in">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-xl bg-[#0e131f] border border-zinc-700/80 shadow-2xl overflow-hidden z-10">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-[#090b10]">
              <Search className="w-4 h-4 text-zinc-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search projects, tasks, members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-xs text-zinc-500 hover:text-zinc-300 px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700"
              >
                ESC
              </button>
            </div>

            <div className="p-4 max-h-80 overflow-y-auto space-y-4">
              {!searchQuery.trim() ? (
                <div className="text-center py-6 text-zinc-500 text-xs">
                  Type something to search across TechVerse projects, tasks, and members...
                </div>
              ) : !hasSearchResults ? (
                <div className="text-center py-6 text-zinc-500 text-xs">
                  No matching results found for "{searchQuery}"
                </div>
              ) : (
                <>
                  {searchResults.projects.length > 0 && (
                    <div>
                      <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <FolderKanban className="w-3 h-3 text-indigo-400" /> Projects
                      </div>
                      <div className="space-y-1">
                        {searchResults.projects.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => {
                              router.push(`/projects/${p.id}`);
                              setIsSearchOpen(false);
                            }}
                            className="p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 text-xs cursor-pointer flex items-center justify-between"
                          >
                            <span className="text-zinc-200 font-medium">{p.name}</span>
                            <Badge variant="status" status={p.status} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.tasks.length > 0 && (
                    <div>
                      <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Tasks
                      </div>
                      <div className="space-y-1">
                        {searchResults.tasks.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => {
                              router.push("/tasks");
                              setIsSearchOpen(false);
                            }}
                            className="p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 text-xs cursor-pointer flex items-center justify-between"
                          >
                            <span className="text-zinc-200">{t.title}</span>
                            <Badge variant="priority" priority={t.priority} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.members.length > 0 && (
                    <div>
                      <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Users2 className="w-3 h-3 text-violet-400" /> Members
                      </div>
                      <div className="space-y-1">
                        {searchResults.members.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => {
                              router.push("/members");
                              setIsSearchOpen(false);
                            }}
                            className="p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/80 text-xs cursor-pointer flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar src={m.avatar_url} name={m.full_name} size="xs" />
                              <span className="text-zinc-200 font-medium">{m.full_name}</span>
                            </div>
                            <span className="text-zinc-400 text-[11px]">{m.department}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
