"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useClubData } from "@/context/ClubDataContext";
import { Task, TaskStatus } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { TaskModal } from "@/components/tasks/TaskModal";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { formatDate, formatRelativeTime, isOverdue } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  CheckSquare,
  Users2,
  Activity,
  Plus,
  Edit2,
  Trash2,
  Clock,
  AlertCircle,
  Play,
  Check,
  Circle,
  UserCheck,
} from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const { user, isAdmin, isProjectLead } = useAuth();
  const {
    projects,
    tasks,
    teams,
    members,
    activities,
    updateTaskStatus,
    deleteProject,
  } = useClubData();

  const [activeTab, setActiveTab] = useState<"tasks" | "teams" | "activity">("tasks");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const project = useMemo(() => {
    return projects.find((p) => p.id === projectId);
  }, [projects, projectId]);

  const projectTasks = useMemo(() => {
    return tasks.filter((t) => t.project_id === projectId);
  }, [tasks, projectId]);

  const projectTeams = useMemo(() => {
    return teams.filter((t) => t.project_id === projectId);
  }, [teams, projectId]);

  const projectActivities = useMemo(() => {
    return activities.filter((a) => a.project_id === projectId);
  }, [activities, projectId]);

  if (!project) {
    return (
      <div className="py-16 text-center space-y-3">
        <p className="text-sm text-zinc-400">Project not found or deleted.</p>
        <Link href="/projects">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Back to Projects</span>
          </Button>
        </Link>
      </div>
    );
  }

  const canEdit = isAdmin || (isProjectLead && project.lead_id === user?.id);

  const handleDeleteConfirm = async () => {
    await deleteProject(project.id);
    router.push("/projects");
  };

  return (
    <div className="space-y-6">
      {/* Back button & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>

        <div className="flex items-center gap-2">
          {canEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditProjectOpen(true)}
              className="gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Project</span>
            </Button>
          )}

          {canEdit && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsTaskModalOpen(true)}
              className="gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </Button>
          )}

          {isAdmin && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Project Overview Card */}
      <Card className="p-6 bg-gradient-to-b from-[#0e131f] to-[#0a0d14] border-zinc-700/70">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {project.name}
              </h1>
              <Badge variant="status" status={project.status} />
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {project.description}
            </p>

            {/* Project Lead Pill */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs">
                <Avatar
                  src={project.lead?.avatar_url}
                  name={project.lead?.full_name || "Unassigned"}
                  size="xs"
                />
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 font-medium">Project Lead</span>
                  <span className="text-xs font-semibold text-zinc-200">
                    {project.lead?.full_name || "No Lead Assigned"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 font-medium">Target Deadline</span>
                  <span className="text-xs font-semibold text-zinc-200">
                    {formatDate(project.deadline)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Box */}
          <div className="lg:w-72 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Project Progress</span>
              <span className="text-base font-bold text-white">{project.progress || 0}%</span>
            </div>

            <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  (project.progress || 0) === 100
                    ? "bg-emerald-500"
                    : (project.progress || 0) > 40
                    ? "bg-indigo-500"
                    : "bg-amber-500"
                }`}
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-center pt-1 text-xs">
              <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <span className="block text-zinc-400 text-[10px]">Tasks Done</span>
                <span className="font-bold text-zinc-200 text-sm">
                  {project.completed_tasks_count || 0}/{project.tasks_count || 0}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <span className="block text-zinc-400 text-[10px]">Assigned Teams</span>
                <span className="font-bold text-zinc-200 text-sm">
                  {projectTeams.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "tasks"
              ? "bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/20"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Deliverables & Tasks ({projectTasks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("teams")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "teams"
              ? "bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/20"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Users2 className="w-3.5 h-3.5" />
          <span>Teams & Members ({projectTeams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("activity")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "activity"
              ? "bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/20"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Activity Audit ({projectActivities.length})</span>
        </button>
      </div>

      {/* Tab 1: Tasks List */}
      {activeTab === "tasks" && (
        <div className="space-y-3">
          {projectTasks.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 text-zinc-500 text-xs">
              No tasks created for this project yet. Click "Add Task" to get started.
            </div>
          ) : (
            projectTasks.map((task) => {
              const overdue = isOverdue(task.deadline, task.status);
              const canModify =
                isAdmin ||
                (isProjectLead && project.lead_id === user?.id) ||
                task.assignee_id === user?.id;

              return (
                <div
                  key={task.id}
                  className="p-4 rounded-xl bg-[#0e131f]/70 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-zinc-100 text-sm">{task.title}</span>
                      <Badge variant="priority" priority={task.priority} />
                      <Badge variant="status" status={task.status} />
                    </div>
                    {task.description && (
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <Avatar
                          src={task.assignee?.avatar_url}
                          name={task.assignee?.full_name || "Unassigned"}
                          size="xs"
                        />
                        <span className="text-zinc-300">
                          {task.assignee?.full_name || "Unassigned"}
                        </span>
                      </div>
                      <span>•</span>
                      <span className={overdue ? "text-rose-400 font-semibold" : ""}>
                        Due {formatDate(task.deadline)}
                      </span>
                    </div>
                  </div>

                  {/* Status update buttons */}
                  {canModify && (
                    <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 shrink-0">
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
                            ? "bg-indigo-600 text-white font-semibold"
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
                            ? "bg-emerald-600 text-white font-semibold"
                            : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        <Check className="w-2.5 h-2.5" />
                        <span>Done</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Teams & Members */}
      {activeTab === "teams" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectTeams.length === 0 ? (
            <div className="col-span-2 text-center py-12 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 text-zinc-500 text-xs">
              No squads specifically assigned to this project yet.
            </div>
          ) : (
            projectTeams.map((team) => (
              <Card key={team.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-zinc-100">{team.name}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{team.description}</p>
                  </div>
                  <Badge variant="default">{team.members_count || 0} Members</Badge>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    Team Members
                  </span>
                  <div className="space-y-1.5">
                    {team.members?.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/60 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={member.avatar_url}
                            name={member.full_name}
                            size="xs"
                          />
                          <span className="font-medium text-zinc-200">
                            {member.full_name}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400">{member.department}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Activity Log */}
      {activeTab === "activity" && (
        <Card className="p-4 space-y-2">
          {projectActivities.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-8">
              No activity logs recorded for this project yet.
            </p>
          ) : (
            projectActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Avatar
                    src={act.user?.avatar_url}
                    name={act.user?.full_name || "Member"}
                    size="xs"
                  />
                  <span className="text-zinc-300">
                    <strong className="text-white">{act.user?.full_name || "User"}</strong>{" "}
                    {act.action}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 shrink-0">
                  {formatRelativeTime(act.created_at)}
                </span>
              </div>
            ))
          )}
        </Card>
      )}

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen || editingTask !== null}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        taskToEdit={editingTask}
        defaultProjectId={project.id}
      />

      <ProjectModal
        isOpen={isEditProjectOpen}
        onClose={() => setIsEditProjectOpen(false)}
        projectToEdit={project}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project?"
        message="This action will permanently delete this project and unbind all its associated tasks and squads."
      />
    </div>
  );
}
