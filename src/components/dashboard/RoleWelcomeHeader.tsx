"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Plus, FolderKanban, CheckSquare, Sparkles } from "lucide-react";

export function RoleWelcomeHeader({
  onNewProject,
  onNewTask,
}: {
  onNewProject?: () => void;
  onNewTask?: () => void;
}) {
  const { user, role, isAdmin, isProjectLead } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {getGreeting()}, {user?.full_name?.split(" ")[0] || "Member"} 👋
          </h1>
          <Badge variant="role" role={role} />
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          {isAdmin && "Manage TechVerse Club operations, track team velocity, and review milestones."}
          {isProjectLead && "Manage your assigned projects, lead your team, and track task deliveries."}
          {!isAdmin && !isProjectLead && "Track your assigned deliverables, team progress, and upcoming deadlines."}
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {(isAdmin || isProjectLead) && onNewTask && (
          <Button
            size="sm"
            variant="outline"
            onClick={onNewTask}
            className="gap-1.5"
          >
            <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>New Task</span>
          </Button>
        )}

        {isAdmin && onNewProject && (
          <Button
            size="sm"
            variant="primary"
            onClick={onNewProject}
            className="gap-1.5 shadow-md shadow-indigo-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </Button>
        )}
      </div>
    </div>
  );
}
