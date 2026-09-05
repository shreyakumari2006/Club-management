"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useClubData } from "@/context/ClubDataContext";
import { RoleWelcomeHeader } from "@/components/dashboard/RoleWelcomeHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { TaskModal } from "@/components/tasks/TaskModal";
import { formatDate } from "@/lib/utils";
import {
  Users,
  FolderKanban,
  Users2,
  CheckSquare,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  Play,
  Check,
  Circle,
  AlertCircle,
} from "lucide-react";

export default function DashboardPage() {
  const { user, role, isAdmin, isProjectLead, isMember } = useAuth();
  const {
    projects,
    teams,
    tasks,
    members,
    activities,
    stats,
    updateTaskStatus,
  } = useClubData();

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Filtered lists for Lead and Member personas
  const leadProjects = projects.filter((p) => p.lead_id === user?.id);
  const leadTasks = tasks.filter(
    (t) => leadProjects.some((p) => p.id === t.project_id) || t.assignee_id === user?.id
  );

  const memberTasks = tasks.filter((t) => t.assignee_id === user?.id);
  const memberProjects = projects.filter((p) =>
    teams.some(
      (tm) =>
        tm.project_id === p.id &&
        tm.members?.some((m) => m.id === user?.id)
    ) || p.lead_id === user?.id
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header with Action Buttons */}
      <RoleWelcomeHeader
        onNewProject={isAdmin ? () => setIsProjectModalOpen(true) : undefined}
        onNewTask={() => setIsTaskModalOpen(true)}
      />

      {/* ========================================================================= */}
      {/* 1. ADMIN DASHBOARD VIEW                                                  */}
      {/* ========================================================================= */}
      {isAdmin && (
        <>
          {/* KPI Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Members"
              value={stats.totalMembers}
              icon={Users}
              description="Active in 4 specialized teams"
              trend={{ value: "+18%", isPositive: true }}
              variant="indigo"
            />
            <StatCard
              title="Active Projects"
              value={stats.activeProjects}
              icon={FolderKanban}
              description={`${projects.length} total projects`}
              variant="emerald"
            />
            <StatCard
              title="Active Teams"
              value={stats.totalTeams}
              icon={Users2}
              description="Full department coverage"
              variant="zinc"
            />
            <StatCard
              title="Overall Velocity"
              value={`${stats.overallProgress}%`}
              icon={TrendingUp}
              description={`${stats.completedTasks} of ${tasks.length} tasks completed`}
              trend={{ value: `${stats.pendingTasks} pending`, isPositive: stats.pendingTasks < 10 }}
              variant="amber"
            />
          </div>

          {/* Main Content Grid: Projects Progress + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Project Progress & Milestones */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-sm font-semibold text-white">
                      Overall Project Progress
                    </CardTitle>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Milestone delivery status across all active initiatives
                    </p>
                  </div>
                  <Link
                    href="/projects"
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </CardHeader>

                <CardContent className="space-y-4 pt-2">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="p-3.5 rounded-lg bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Link
                          href={`/projects/${project.id}`}
                          className="font-medium text-xs sm:text-sm text-zinc-100 hover:text-indigo-400 transition-colors truncate"
                        >
                          {project.name}
                        </Link>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="status" status={project.status} />
                          <span className="text-xs font-semibold text-zinc-300">
                            {project.progress || 0}%
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            (project.progress || 0) === 100
                              ? "bg-emerald-500"
                              : (project.progress || 0) > 50
                              ? "bg-indigo-500"
                              : "bg-amber-500"
                          }`}
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2.5">
                        <div className="flex items-center gap-1.5">
                          <span>Lead:</span>
                          <span className="text-zinc-200 font-medium">
                            {project.lead?.full_name || "Unassigned"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span>
                            {project.completed_tasks_count || 0}/{project.tasks_count || 0} tasks
                          </span>
                          <span>•</span>
                          <span>Due {formatDate(project.deadline)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Team Performance Overview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-sm font-semibold text-white">
                      Specialized Squads & Teams
                    </CardTitle>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Sub-teams contributing to club initiatives
                    </p>
                  </div>
                  <Link
                    href="/teams"
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    <span>Manage teams</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80 hover:bg-zinc-800/40 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-xs font-semibold text-zinc-200 truncate">
                          {team.name}
                        </h4>
                        <span className="text-[10px] text-zinc-400">
                          {team.members_count || 0} members
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-1 mb-2.5">
                        {team.description}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[10px]">
                        <span className="text-zinc-400">
                          Lead: <span className="text-zinc-200">{team.lead?.full_name || "None"}</span>
                        </span>
                        <div className="flex -space-x-1.5">
                          {team.members?.slice(0, 3).map((m) => (
                            <Avatar
                              key={m.id}
                              src={m.avatar_url}
                              name={m.full_name}
                              size="xs"
                              showBorder
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right 1 Col: Upcoming Deadlines & Recent Activity Feed */}
            <div className="space-y-6">
              <UpcomingDeadlines tasks={tasks} limit={4} />
              <ActivityFeed activities={activities} limit={5} />
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 2. PROJECT LEAD DASHBOARD VIEW                                           */}
      {/* ========================================================================= */}
      {isProjectLead && (
        <>
          {/* Lead KPI Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Assigned Projects"
              value={leadProjects.length}
              icon={FolderKanban}
              description="Under your direct leadership"
              variant="indigo"
            />
            <StatCard
              title="Active Tasks"
              value={leadTasks.filter((t) => t.status !== "Completed").length}
              icon={CheckSquare}
              description="Pending team completion"
              variant="amber"
            />
            <StatCard
              title="Completed Deliverables"
              value={leadTasks.filter((t) => t.status === "Completed").length}
              icon={CheckCircle2}
              description="Successfully verified"
              variant="emerald"
            />
            <StatCard
              title="Upcoming Deadlines"
              value={leadTasks.filter((t) => t.deadline && t.status !== "Completed").length}
              icon={Clock}
              description="Milestones within next 14 days"
              variant="rose"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: My Projects & Assigned Tasks */}
            <div className="lg:col-span-2 space-y-6">
              {/* My Projects */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    My Projects
                  </h3>
                  <span className="text-xs text-zinc-400">
                    {leadProjects.length} projects assigned to you
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {leadProjects.map((proj) => (
                    <Card key={proj.id} hover className="p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Link
                            href={`/projects/${proj.id}`}
                            className="font-semibold text-sm text-zinc-100 hover:text-indigo-400 transition-colors"
                          >
                            {proj.name}
                          </Link>
                          <Badge variant="status" status={proj.status} />
                        </div>
                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-800/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400">Progress</span>
                          <span className="font-semibold text-zinc-200">{proj.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${proj.progress || 0}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                          <span>{proj.completed_tasks_count || 0}/{proj.tasks_count || 0} tasks</span>
                          <span>Due {formatDate(proj.deadline)}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Tasks Under My Projects */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-indigo-400" />
                    <CardTitle className="text-sm font-semibold text-white">
                      Tasks Under My Projects
                    </CardTitle>
                  </div>
                  <Link
                    href="/tasks"
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Open Kanban →
                  </Link>
                </CardHeader>

                <CardContent className="space-y-2.5 pt-1">
                  {leadTasks.length === 0 ? (
                    <p className="text-xs text-zinc-500 text-center py-4">No tasks found</p>
                  ) : (
                    leadTasks.slice(0, 6).map((task) => (
                      <div
                        key={task.id}
                        className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-zinc-200 truncate">
                              {task.title}
                            </span>
                            <Badge variant="priority" priority={task.priority} showDot={false} />
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                            <span className="truncate">{task.project?.name}</span>
                            <span>•</span>
                            <span>Assignee: {task.assignee?.full_name || "Unassigned"}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="status" status={task.status} />
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right 1 Col */}
            <div className="space-y-6">
              <UpcomingDeadlines tasks={leadTasks} limit={4} />
              <ActivityFeed activities={activities} limit={4} />
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 3. MEMBER DASHBOARD VIEW                                                 */}
      {/* ========================================================================= */}
      {isMember && (
        <>
          {/* Member KPI Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="My Assigned Tasks"
              value={memberTasks.length}
              icon={CheckSquare}
              description={`${stats.myActiveTasks} pending, ${stats.myCompletedTasks} done`}
              variant="indigo"
            />
            <StatCard
              title="Pending Deliverables"
              value={stats.myActiveTasks}
              icon={Clock}
              description="Awaiting completion"
              variant="amber"
            />
            <StatCard
              title="Completed Tasks"
              value={stats.myCompletedTasks}
              icon={CheckCircle2}
              description="Great job!"
              variant="emerald"
            />
            <StatCard
              title="My Completion Rate"
              value={`${
                memberTasks.length === 0
                  ? 100
                  : Math.round((stats.myCompletedTasks / memberTasks.length) * 100)
              }%`}
              icon={TrendingUp}
              description="Personal execution velocity"
              variant="zinc"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Interactive My Tasks with Quick Status Switcher */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-sm font-semibold text-white">
                      My Assigned Tasks
                    </CardTitle>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Update your task status directly as you make progress
                    </p>
                  </div>
                  <Link
                    href="/tasks"
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    View board →
                  </Link>
                </CardHeader>

                <CardContent className="space-y-3 pt-1">
                  {memberTasks.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500 text-xs">
                      No active tasks currently assigned to you. Enjoy your day!
                    </div>
                  ) : (
                    memberTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-lg bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-100 text-xs sm:text-sm">
                              {task.title}
                            </span>
                            <Badge variant="priority" priority={task.priority} />
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                            {task.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-[11px] text-zinc-500">
                            <span className="text-indigo-400 font-medium">
                              {task.project?.name}
                            </span>
                            <span>•</span>
                            <span>Due {formatDate(task.deadline)}</span>
                          </div>
                        </div>

                        {/* Interactive Status Switcher */}
                        <div className="flex items-center gap-1.5 shrink-0 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                          <button
                            onClick={() => updateTaskStatus(task.id, "To Do")}
                            className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
                              task.status === "To Do"
                                ? "bg-zinc-800 text-white font-semibold"
                                : "text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            <Circle className="w-2.5 h-2.5" />
                            <span>To Do</span>
                          </button>
                          <button
                            onClick={() => updateTaskStatus(task.id, "In Progress")}
                            className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
                              task.status === "In Progress"
                                ? "bg-indigo-600 text-white font-semibold shadow-sm"
                                : "text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            <Play className="w-2.5 h-2.5" />
                            <span>In Progress</span>
                          </button>
                          <button
                            onClick={() => updateTaskStatus(task.id, "Completed")}
                            className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition-all ${
                              task.status === "Completed"
                                ? "bg-emerald-600 text-white font-semibold shadow-sm"
                                : "text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            <Check className="w-2.5 h-2.5" />
                            <span>Done</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* My Projects */}
              <div>
                <h3 className="text-sm font-semibold text-white tracking-tight mb-3">
                  My Projects & Squads
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {memberProjects.map((p) => (
                    <Card key={p.id} hover className="p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <Link
                          href={`/projects/${p.id}`}
                          className="font-semibold text-xs text-zinc-100 hover:text-indigo-400"
                        >
                          {p.name}
                        </Link>
                        <Badge variant="status" status={p.status} />
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 mb-3">
                        {p.description}
                      </p>
                      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
                        <span>Lead: {p.lead?.full_name}</span>
                        <span>{p.progress || 0}% Completed</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col */}
            <div className="space-y-6">
              <UpcomingDeadlines tasks={memberTasks} limit={4} />
              <ActivityFeed activities={activities} limit={4} />
            </div>
          </div>
        </>
      )}

      {/* Creation Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
      />
    </div>
  );
}
