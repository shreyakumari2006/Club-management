"use client";

import React, { useState, useEffect } from "react";
import { Task, TaskPriority, TaskStatus } from "@/types";
import { Dialog } from "@/components/ui/Dialog";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useClubData } from "@/context/ClubDataContext";
import { useAuth } from "@/context/AuthContext";

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  defaultProjectId?: string;
}

export function TaskModal({
  isOpen,
  onClose,
  taskToEdit,
  defaultProjectId,
}: TaskModalProps) {
  const { projects, members, createTask, updateTask } = useClubData();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [status, setStatus] = useState<TaskStatus>("To Do");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setProjectId(taskToEdit.project_id);
      setAssigneeId(taskToEdit.assignee_id || "");
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setDeadline(
        taskToEdit.deadline ? new Date(taskToEdit.deadline).toISOString().split("T")[0] : ""
      );
    } else {
      setTitle("");
      setDescription("");
      setProjectId(defaultProjectId || (projects[0]?.id || ""));
      setAssigneeId(user?.id || "");
      setPriority("Medium");
      setStatus("To Do");
      // Default deadline: 7 days from now
      const d = new Date();
      d.setDate(d.getDate() + 7);
      setDeadline(d.toISOString().split("T")[0]);
    }
  }, [taskToEdit, defaultProjectId, isOpen, projects, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    setIsSubmitting(true);
    try {
      const deadlineIso = deadline ? new Date(deadline).toISOString() : undefined;

      if (taskToEdit) {
        await updateTask(taskToEdit.id, {
          title,
          description,
          project_id: projectId,
          assignee_id: assigneeId || undefined,
          priority,
          status,
          deadline: deadlineIso,
        });
      } else {
        await createTask({
          title,
          description,
          project_id: projectId,
          assignee_id: assigneeId || undefined,
          priority,
          status,
          deadline: deadlineIso,
        });
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? "Edit Task" : "Create New Task"}
      description="Assign actionable deliverables to team members with clear priorities and deadlines."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Design Interactive Kanban Board Component"
          required
        />

        <Textarea
          label="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Specify implementation requirements, acceptance criteria, or links..."
          rows={3}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">
              Project *
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full rounded-lg bg-zinc-900/80 border border-zinc-700/80 px-3.5 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
              required
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">
              Assignee
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full rounded-lg bg-zinc-900/80 border border-zinc-700/80 px-3.5 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full rounded-lg bg-zinc-900/80 border border-zinc-700/80 px-3 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full rounded-lg bg-zinc-900/80 border border-zinc-700/80 px-3 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <Input
            label="Due Date"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {taskToEdit ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
