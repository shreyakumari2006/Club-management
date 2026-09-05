"use client";

import React from "react";
import Link from "next/link";
import { Task } from "@/types";
import { formatDate, isOverdue, getDaysLeft } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Calendar, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

export function UpcomingDeadlines({
  tasks,
  limit = 5,
}: {
  tasks: Task[];
  limit?: number;
}) {
  const pendingTasksWithDeadlines = tasks
    .filter((t) => t.deadline && t.status !== "Completed")
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, limit);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <CardTitle className="text-sm font-semibold text-white">Upcoming Deadlines</CardTitle>
        </div>
        <Link
          href="/tasks"
          className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
        >
          View all →
        </Link>
      </CardHeader>

      <CardContent className="flex-1 space-y-2.5 pt-1">
        {pendingTasksWithDeadlines.length === 0 ? (
          <div className="text-center py-6 text-zinc-500 text-xs flex flex-col items-center gap-1.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-500/60" />
            <span>All upcoming deadlines are clear!</span>
          </div>
        ) : (
          pendingTasksWithDeadlines.map((task) => {
            const overdue = isOverdue(task.deadline, task.status);
            const daysLeft = getDaysLeft(task.deadline);

            return (
              <div
                key={task.id}
                className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 hover:bg-zinc-800/40 transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-zinc-200 truncate">{task.title}</p>
                    <Badge variant="priority" priority={task.priority} showDot={false} />
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                    <span className="truncate">{task.project?.name || "General"}</span>
                    {task.assignee && (
                      <>
                        <span>•</span>
                        <span className="text-zinc-300">{task.assignee.full_name}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right flex flex-col items-end">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded ${
                      overdue
                        ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                        : daysLeft !== null && daysLeft <= 2
                        ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        : "text-zinc-400 bg-zinc-800/80 border border-zinc-700"
                    }`}
                  >
                    {overdue ? (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        <span>Overdue</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        <span>{daysLeft === 0 ? "Due today" : `${daysLeft}d left`}</span>
                      </>
                    )}
                  </span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">
                    {formatDate(task.deadline)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
