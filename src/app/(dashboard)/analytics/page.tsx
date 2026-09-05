"use client";

import React, { useMemo } from "react";
import { useClubData } from "@/context/ClubDataContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderKanban,
  Users2,
} from "lucide-react";

export default function AnalyticsPage() {
  const { projects, tasks, teams, stats } = useClubData();

  // 1. Task Distribution by Status
  const statusData = useMemo(() => {
    const todo = tasks.filter((t) => t.status === "To Do").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const completed = tasks.filter((t) => t.status === "Completed").length;

    return [
      { name: "To Do", value: todo, color: "#71717a" },
      { name: "In Progress", value: inProgress, color: "#6366f1" },
      { name: "Completed", value: completed, color: "#10b981" },
    ];
  }, [tasks]);

  // 2. Task Distribution by Priority
  const priorityData = useMemo(() => {
    const urgent = tasks.filter((t) => t.priority === "Urgent").length;
    const high = tasks.filter((t) => t.priority === "High").length;
    const medium = tasks.filter((t) => t.priority === "Medium").length;
    const low = tasks.filter((t) => t.priority === "Low").length;

    return [
      { name: "Urgent", count: urgent, fill: "#f43f5e" },
      { name: "High", count: high, fill: "#f59e0b" },
      { name: "Medium", count: medium, fill: "#6366f1" },
      { name: "Low", count: low, fill: "#71717a" },
    ];
  }, [tasks]);

  // 3. Project Progress & Completion %
  const projectProgressData = useMemo(() => {
    return projects.map((p) => ({
      name: p.name.length > 18 ? p.name.substring(0, 16) + "..." : p.name,
      progress: p.progress || 0,
      tasks: p.tasks_count || 0,
      completed: p.completed_tasks_count || 0,
    }));
  }, [projects]);

  // 4. Team Workload / Performance
  const teamPerformanceData = useMemo(() => {
    return teams.map((tm) => {
      const teamTaskCount = tasks.filter((t) => t.project_id === tm.project_id).length;
      const teamCompleted = tasks.filter(
        (t) => t.project_id === tm.project_id && t.status === "Completed"
      ).length;

      return {
        name: tm.name.replace(" Team", ""),
        total: teamTaskCount,
        completed: teamCompleted,
        members: tm.members_count || 0,
      };
    });
  }, [teams, tasks]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Club Analytics & Velocity
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
              Live Metrics
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Data-driven insights on project milestones, task delivery velocity, and team capacity.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Velocity"
          value={`${stats.overallProgress}%`}
          icon={TrendingUp}
          description={`${stats.completedTasks} completed / ${tasks.length} total`}
          variant="emerald"
        />
        <StatCard
          title="Pending Deliverables"
          value={stats.pendingTasks}
          icon={Clock}
          description="In Progress & To Do"
          variant="indigo"
        />
        <StatCard
          title="Overdue Tasks"
          value={stats.overdueTasks}
          icon={AlertTriangle}
          description="Milestones past due date"
          variant="rose"
        />
        <StatCard
          title="Active Squads"
          value={teams.length}
          icon={Users2}
          description="Managing 4 active initiatives"
          variant="amber"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Project Progress % */}
        <Card className="p-5 flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-indigo-400" />
                <span>Project Milestone Completion</span>
              </CardTitle>
              <span className="text-[11px] text-zinc-400 font-mono">% Complete</span>
            </div>
          </CardHeader>
          <CardContent className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectProgressData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f1420",
                    borderColor: "#3f3f46",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="progress" fill="#6366f1" radius={[4, 4, 0, 0]} name="Progress %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 2: Task Status Funnel */}
        <Card className="p-5 flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Task Distribution by Status</span>
              </CardTitle>
              <span className="text-[11px] text-zinc-400 font-mono">Deliverables</span>
            </div>
          </CardHeader>
          <CardContent className="h-64 pt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f1420",
                    borderColor: "#3f3f46",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs text-zinc-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 3: Priority Breakdown */}
        <Card className="p-5 flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Task Distribution by Priority</span>
              </CardTitle>
              <span className="text-[11px] text-zinc-400 font-mono">Severity</span>
            </div>
          </CardHeader>
          <CardContent className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f1420",
                    borderColor: "#3f3f46",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Task Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chart 4: Team Output & Workload */}
        <Card className="p-5 flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Users2 className="w-4 h-4 text-violet-400" />
                <span>Squad Workload & Output</span>
              </CardTitle>
              <span className="text-[11px] text-zinc-400 font-mono">Deliverables</span>
            </div>
          </CardHeader>
          <CardContent className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f1420",
                    borderColor: "#3f3f46",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="total" fill="#3f3f46" radius={[4, 4, 0, 0]} name="Total Tasks" />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
