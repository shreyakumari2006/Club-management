"use client";

import React from "react";
import { ActivityLog } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Activity, FolderKanban, CheckSquare, Users2, User } from "lucide-react";

export function ActivityFeed({
  activities,
  limit = 5,
}: {
  activities: ActivityLog[];
  limit?: number;
}) {
  const displayActivities = activities.slice(0, limit);

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "PROJECT":
        return <FolderKanban className="w-3 h-3 text-indigo-400" />;
      case "TASK":
        return <CheckSquare className="w-3 h-3 text-emerald-400" />;
      case "TEAM":
        return <Users2 className="w-3 h-3 text-violet-400" />;
      default:
        return <User className="w-3 h-3 text-zinc-400" />;
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <CardTitle className="text-sm font-semibold text-white">Recent Activity</CardTitle>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">Live Audit</span>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pt-1">
        {displayActivities.length === 0 ? (
          <p className="text-xs text-zinc-500 text-center py-6">No recent club activity</p>
        ) : (
          displayActivities.map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-3 p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-800/40 transition-colors text-xs"
            >
              <Avatar
                src={act.user?.avatar_url}
                name={act.user?.full_name || "Club Member"}
                size="xs"
              />
              <div className="flex-1 min-w-0">
                <p className="text-zinc-300 leading-snug">
                  <span className="font-semibold text-white">
                    {act.user?.full_name || "A member"}{" "}
                  </span>
                  <span className="text-zinc-400">{act.action}</span>
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    {getEntityIcon(act.entity_type)}
                    <span>{act.entity_type}</span>
                  </span>
                  <span>•</span>
                  <span>{formatRelativeTime(act.created_at)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
