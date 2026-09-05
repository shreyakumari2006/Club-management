"use client";

import React, { useState, useEffect } from "react";
import { Project, ProjectStatus } from "@/types";
import { Dialog } from "@/components/ui/Dialog";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useClubData } from "@/context/ClubDataContext";

export interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

export function ProjectModal({
  isOpen,
  onClose,
  projectToEdit,
}: ProjectModalProps) {
  const { members, createProject, updateProject } = useClubData();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("Planning");
  const [leadId, setLeadId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setDescription(projectToEdit.description || "");
      setStatus(projectToEdit.status);
      setLeadId(projectToEdit.lead_id || "");
      setStartDate(projectToEdit.start_date || "");
      setDeadline(projectToEdit.deadline || "");
    } else {
      setName("");
      setDescription("");
      setStatus("Planning");
      setLeadId(members.find((m) => m.role === "PROJECT_LEAD")?.id || "");
      setStartDate(new Date().toISOString().split("T")[0]);
      setDeadline("");
    }
  }, [projectToEdit, isOpen, members]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      if (projectToEdit) {
        await updateProject(projectToEdit.id, {
          name,
          description,
          status,
          lead_id: leadId || undefined,
          start_date: startDate,
          deadline: deadline || undefined,
        });
      } else {
        await createProject({
          name,
          description,
          status,
          lead_id: leadId || undefined,
          start_date: startDate,
          deadline: deadline || undefined,
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
      title={projectToEdit ? "Edit Project" : "Create New Project"}
      description="Define the scope, assigned Project Lead, and milestone deadlines."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Club Website Revamp"
          required
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the goals, deliverables, and student impact..."
          rows={3}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">
              Project Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full rounded-lg bg-zinc-900/80 border border-zinc-700/80 px-3.5 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
            >
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">
              Project Lead
            </label>
            <select
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="w-full rounded-lg bg-zinc-900/80 border border-zinc-700/80 px-3.5 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">No Lead Assigned</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name} ({m.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="Target Deadline"
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
            {projectToEdit ? "Save Changes" : "Create Project"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
