"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useClubData } from "@/context/ClubDataContext";
import { Project, ProjectStatus } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { formatDate } from "@/lib/utils";
import {
  FolderKanban,
  Plus,
  Search,
  SlidersHorizontal,
  Calendar,
  CheckSquare,
  Edit2,
  Trash2,
  Users2,
} from "lucide-react";

export default function ProjectsPage() {
  const { role, isAdmin, isProjectLead, user } = useAuth();
  const { projects, deleteProject } = useClubData();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [leadFilter, setLeadFilter] = useState<string>("ALL");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
      const matchesLead = leadFilter === "ALL" || p.lead_id === leadFilter;

      return matchesSearch && matchesStatus && matchesLead;
    });
  }, [projects, searchQuery, statusFilter, leadFilter]);

  const handleDeleteConfirm = async () => {
    if (deletingProjectId) {
      await deleteProject(deletingProjectId);
      setDeletingProjectId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">Projects</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-medium">
              {projects.length} Total
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage university club initiatives, track milestones, and assign student project leads.
          </p>
        </div>

        {isAdmin && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-1.5 shadow-md shadow-indigo-600/20 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Project</span>
          </Button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Planning">Planning</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 text-zinc-500 text-xs">
          No projects found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const canEdit = isAdmin || (isProjectLead && project.lead_id === user?.id);

            return (
              <Card
                key={project.id}
                hover
                className="flex flex-col justify-between p-5 glow-card"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Link
                      href={`/projects/${project.id}`}
                      className="font-semibold text-sm sm:text-base text-zinc-100 hover:text-indigo-400 transition-colors line-clamp-1"
                    >
                      {project.name}
                    </Link>
                    <Badge variant="status" status={project.status} />
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>

                <div>
                  {/* Progress Indicator */}
                  <div className="space-y-1.5 pt-3 border-t border-zinc-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 text-[11px]">Completion</span>
                      <span className="font-semibold text-zinc-200 text-xs">
                        {project.progress || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          (project.progress || 0) === 100
                            ? "bg-emerald-500"
                            : (project.progress || 0) > 40
                            ? "bg-indigo-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Project Lead & Tasks Meta */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-800/60 text-xs text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={project.lead?.avatar_url}
                        name={project.lead?.full_name || "Unassigned"}
                        size="xs"
                      />
                      <span className="text-[11px] text-zinc-300 truncate max-w-[100px]">
                        {project.lead?.full_name || "No lead"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px]">
                      <CheckSquare className="w-3.5 h-3.5 text-zinc-500" />
                      <span>
                        {project.completed_tasks_count || 0}/{project.tasks_count || 0} tasks
                      </span>
                    </div>
                  </div>

                  {/* Footer Dates & Actions */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-800/60 text-[11px]">
                    <div className="flex items-center gap-1 text-zinc-500">
                      <Calendar className="w-3 h-3" />
                      <span>Due {formatDate(project.deadline)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {canEdit && (
                        <button
                          onClick={() => setEditingProject(project)}
                          className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                          title="Edit project"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          onClick={() => setDeletingProjectId(project.id)}
                          className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <Link
                        href={`/projects/${project.id}`}
                        className="px-2 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 font-medium text-[11px] ml-1 transition-colors"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <ProjectModal
        isOpen={isCreateModalOpen || editingProject !== null}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingProject(null);
        }}
        projectToEdit={editingProject}
      />

      <ConfirmDialog
        isOpen={deletingProjectId !== null}
        onClose={() => setDeletingProjectId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project?"
        message="This action will permanently delete this project and unbind all its associated tasks and squads."
      />
    </div>
  );
}
