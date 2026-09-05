"use client";

import React, { useState, useEffect } from "react";
import { Team } from "@/types";
import { Dialog } from "@/components/ui/Dialog";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useClubData } from "@/context/ClubDataContext";

export interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamToEdit?: Team | null;
}

export function TeamModal({ isOpen, onClose, teamToEdit }: TeamModalProps) {
  const { projects, members, createTeam, updateTeam } = useClubData();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [leadId, setLeadId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (teamToEdit) {
      setName(teamToEdit.name);
      setDescription(teamToEdit.description || "");
      setProjectId(teamToEdit.project_id || "");
      setLeadId(teamToEdit.lead_id || "");
    } else {
      setName("");
      setDescription("");
      setProjectId(projects[0]?.id || "");
      setLeadId("");
    }
  }, [teamToEdit, isOpen, projects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      if (teamToEdit) {
        await updateTeam(teamToEdit.id, {
          name,
          description,
          project_id: projectId || undefined,
          lead_id: leadId || undefined,
        });
      } else {
        await createTeam({
          name,
          description,
          project_id: projectId || undefined,
          lead_id: leadId || undefined,
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
      title={teamToEdit ? "Edit Team" : "Create New Team"}
      description="Group club members into specialized squads assigned to projects."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Team Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Web Development Team"
          required
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Explain the team's responsibilities and technical focus..."
          rows={3}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">
              Assigned Project
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full rounded-lg bg-zinc-900/80 border border-zinc-700/80 px-3.5 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">No Project Assigned</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">
              Team Lead
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

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {teamToEdit ? "Save Changes" : "Create Team"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
