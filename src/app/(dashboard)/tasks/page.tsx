"use client";

import React, { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useClubData } from "@/context/ClubDataContext";
import { Task, TaskPriority, TaskStatus } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { TaskModal } from "@/components/tasks/TaskModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { formatDate, isOverdue, getDaysLeft } from "@/lib/utils";
import {
  CheckSquare,
  LayoutGrid,
  List,
  Plus,
  Search,
  SlidersHorizontal,
  Calendar,
  Clock,
  AlertCircle,
  Play,
  Check,
  Circle,
  Edit2,
  Trash2,
  ArrowRight,
} from "lucide-react";

export default function TasksPage() {
  const { user, isAdmin, isProjectLead } = useAuth();
  const {
    tasks,
    projects,
    members,
    updateTaskStatus,
    deleteTask,
  } = useClubData();

  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [projectFilter, setProjectFilter] = useState<string>("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("ALL");

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" || task.priority === priorityFilter;

      const matchesProject =
        projectFilter === "ALL" || task.project_id === projectFilter;

      const matchesAssignee =
        assigneeFilter === "ALL" || task.assignee_id === assigneeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesProject &&
        matchesAssignee
      );
    });
  }, [
    tasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    projectFilter,
    assigneeFilter,
  ]);

  const kanbanColumns: { status: TaskStatus; title: string; color: string }[] = [
    { status: "To Do", title: "TO DO", color: "text-zinc-400 border-zinc-700" },
    { status: "In Progress", title: "IN PROGRESS", color: "text-indigo-400 border-indigo-500/40" },
    { status: "Completed", title: "COMPLETED", color: "text-emerald-400 border-emerald-500/40" },
  ];

  const handleDeleteConfirm = async () => {
    if (deletingTaskId) {
      await deleteTask(deletingTaskId);
      setDeletingTaskId(null);
    }
  };

  const canCreateTask = isAdmin || isProjectLead;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Tasks & Kanban Board
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-medium">
              {tasks.length} Deliverables
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Track sprints, change task statuses, assign members, and monitor deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* View Toggle */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                viewMode === "kanban"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                viewMode === "list"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          {canCreateTask && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsTaskModalOpen(true)}
              className="gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Task</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
        <div className="relative lg:col-span-2">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks by title or desc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="ALL">All Priorities</option>
          <option value="Urgent">Urgent</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* Project Filter */}
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="ALL">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Assignee Filter */}
        <select
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="ALL">All Assignees</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.full_name}
            </option>
          ))}
        </select>
      </div>

      {/* ======================================================================= */}
      {/* 1. KANBAN BOARD VIEW                                                    */}
      {/* ======================================================================= */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {kanbanColumns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);

            return (
              <div
                key={col.status}
                className="bg-[#0b0e17] rounded-xl border border-zinc-800/80 p-3.5 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-current text-indigo-400" />
                    <span className="text-xs font-bold text-zinc-200 tracking-wider uppercase">
                      {col.title}
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 font-mono border border-zinc-800">
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Task Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-10 text-zinc-600 text-xs border border-dashed border-zinc-800/60 rounded-lg">
                      No tasks in {col.status}
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const overdue = isOverdue(task.deadline, task.status);
                      const daysLeft = getDaysLeft(task.deadline);
                      const canModify =
                        isAdmin ||
                        isProjectLead ||
                        task.assignee_id === user?.id;

                      return (
                        <Card
                          key={task.id}
                          className="p-3.5 bg-[#101522] border-zinc-800 hover:border-zinc-700 transition-all glow-card flex flex-col justify-between gap-3 text-xs"
                        >
                          <div>
                            {/* Priority & Actions Header */}
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <Badge variant="priority" priority={task.priority} />
                              <div className="flex items-center gap-1">
                                {canModify && (
                                  <button
                                    onClick={() => setEditingTask(task)}
                                    className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors"
                                    title="Edit task"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                )}
                                {(isAdmin || isProjectLead) && (
                                  <button
                                    onClick={() => setDeletingTaskId(task.id)}
                                    className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                                    title="Delete task"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>

                            <h4 className="font-semibold text-zinc-100 text-xs sm:text-sm leading-snug">
                              {task.title}
                            </h4>

                            {task.description && (
                              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                                {task.description}
                              </p>
                            )}

                            {/* Project Tag */}
                            <div className="mt-2.5">
                              <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 font-medium">
                                {task.project?.name || "General"}
                              </span>
                            </div>
                          </div>

                          {/* Footer Meta & Status Move Buttons */}
                          <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                            <div className="flex items-center justify-between text-[11px]">
                              {/* Assignee Avatar */}
                              <div className="flex items-center gap-1.5">
                                <Avatar
                                  src={task.assignee?.avatar_url}
                                  name={task.assignee?.full_name || "Unassigned"}
                                  size="xs"
                                />
                                <span className="text-zinc-300 truncate max-w-[85px]">
                                  {task.assignee?.full_name || "Unassigned"}
                                </span>
                              </div>

                              {/* Deadline */}
                              {task.deadline && (
                                <span
                                  className={`flex items-center gap-1 text-[10px] ${
                                    overdue
                                      ? "text-rose-400 font-semibold"
                                      : daysLeft !== null && daysLeft <= 2
                                      ? "text-amber-400 font-medium"
                                      : "text-zinc-500"
                                  }`}
                                >
                                  {overdue ? (
                                    <AlertCircle className="w-3 h-3" />
                                  ) : (
                                    <Clock className="w-3 h-3" />
                                  )}
                                  <span>{formatDate(task.deadline)}</span>
                                </span>
                              )}
                            </div>

                            {/* Move to status buttons */}
                            {canModify && (
                              <div className="grid grid-cols-3 gap-1 pt-1">
                                <button
                                  onClick={() => updateTaskStatus(task.id, "To Do")}
                                  className={`py-1 text-[10px] rounded font-medium text-center transition-all ${
                                    task.status === "To Do"
                                      ? "bg-zinc-800 text-white font-semibold"
                                      : "bg-zinc-950 text-zinc-500 hover:text-zinc-300"
                                  }`}
                                >
                                  To Do
                                </button>
                                <button
                                  onClick={() => updateTaskStatus(task.id, "In Progress")}
                                  className={`py-1 text-[10px] rounded font-medium text-center transition-all ${
                                    task.status === "In Progress"
                                      ? "bg-indigo-600 text-white font-semibold shadow-sm"
                                      : "bg-zinc-950 text-zinc-500 hover:text-zinc-300"
                                  }`}
                                >
                                  In Prog
                                </button>
                                <button
                                  onClick={() => updateTaskStatus(task.id, "Completed")}
                                  className={`py-1 text-[10px] rounded font-medium text-center transition-all ${
                                    task.status === "Completed"
                                      ? "bg-emerald-600 text-white font-semibold shadow-sm"
                                      : "bg-zinc-950 text-zinc-500 hover:text-zinc-300"
                                  }`}
                                >
                                  Done
                                </button>
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. LIST VIEW                                                            */}
      {/* ======================================================================= */}
      {viewMode === "list" && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 text-zinc-400 uppercase tracking-wider font-semibold text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-3">Task Deliverable</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Assignee</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                      No tasks matching your search and filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => {
                    const overdue = isOverdue(task.deadline, task.status);
                    const canModify =
                      isAdmin || isProjectLead || task.assignee_id === user?.id;

                    return (
                      <tr
                        key={task.id}
                        className="hover:bg-zinc-900/40 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-zinc-200">
                          <div>
                            <span className="block font-semibold text-zinc-100">{task.title}</span>
                            <span className="text-[11px] text-zinc-400 line-clamp-1">
                              {task.description}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-zinc-300">
                          {task.project?.name || "General"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar
                              src={task.assignee?.avatar_url}
                              name={task.assignee?.full_name || "Unassigned"}
                              size="xs"
                            />
                            <span className="text-zinc-300">
                              {task.assignee?.full_name || "Unassigned"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="priority" priority={task.priority} />
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="status" status={task.status} />
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={overdue ? "text-rose-400 font-semibold" : "text-zinc-400"}
                          >
                            {formatDate(task.deadline)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {canModify && (
                              <button
                                onClick={() => setEditingTask(task)}
                                className="p-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {(isAdmin || isProjectLead) && (
                              <button
                                onClick={() => setDeletingTaskId(task.id)}
                                className="p-1.5 rounded text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
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
      />

      <ConfirmDialog
        isOpen={deletingTaskId !== null}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task?"
        message="Are you sure you want to permanently delete this task deliverable?"
      />
    </div>
  );
}
