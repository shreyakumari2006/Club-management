"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useClubData } from "@/context/ClubDataContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeTime } from "@/lib/utils";
import {
  Bell,
  CheckCheck,
  CheckSquare,
  Clock,
  FolderKanban,
  Users2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function NotificationsPage() {
  const router = useRouter();
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useClubData();

  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  const filteredNotifications = notifications.filter((n) =>
    filter === "ALL" ? true : !n.is_read
  );

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "TASK_ASSIGNED":
        return <CheckSquare className="w-4 h-4 text-indigo-400" />;
      case "DEADLINE_APPROACHING":
        return <Clock className="w-4 h-4 text-amber-400" />;
      case "PROJECT_UPDATE":
        return <FolderKanban className="w-4 h-4 text-emerald-400" />;
      case "TEAM_ADDED":
        return <Users2 className="w-4 h-4 text-violet-400" />;
      default:
        return <Bell className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Notifications
            </h1>
            {unreadNotificationsCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-medium border border-indigo-500/30">
                {unreadNotificationsCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time updates regarding your task assignments, upcoming deadlines, and squad changes.
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={markAllNotificationsAsRead}
            className="gap-1.5 shrink-0"
          >
            <CheckCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Mark all as read</span>
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filter === "ALL"
              ? "bg-zinc-800 text-white border border-zinc-700 font-semibold"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("UNREAD")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filter === "UNREAD"
              ? "bg-zinc-800 text-white border border-zinc-700 font-semibold"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Unread Only ({unreadNotificationsCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center text-zinc-500 text-xs border-dashed">
            <Bell className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <p className="font-medium text-zinc-400">No notifications in this view.</p>
            <p className="mt-0.5">You are completely up to date with club activities.</p>
          </Card>
        ) : (
          filteredNotifications.map((notif) => (
            <Card
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                if (notif.link) router.push(notif.link);
              }}
              className={`p-4 transition-all cursor-pointer flex items-start gap-4 ${
                !notif.is_read
                  ? "bg-indigo-950/20 border-indigo-500/30 hover:border-indigo-500/50"
                  : "bg-[#0e131f]/60 hover:bg-[#0e131f] border-zinc-800"
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                {getNotificationIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-xs sm:text-sm text-zinc-100 flex items-center gap-2">
                    <span>{notif.title}</span>
                    {!notif.is_read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-indigo-950" />
                    )}
                  </h4>
                  <span className="text-[11px] text-zinc-500 shrink-0">
                    {formatRelativeTime(notif.created_at)}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {notif.message}
                </p>

                {notif.link && (
                  <div className="mt-2.5 flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium">
                    <span>Jump to target</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
