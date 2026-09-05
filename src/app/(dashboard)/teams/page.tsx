"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useClubData } from "@/context/ClubDataContext";
import { Team } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { TeamModal } from "@/components/teams/TeamModal";
import { Dialog } from "@/components/ui/Dialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  Users2,
  Plus,
  UserPlus,
  UserMinus,
  Edit2,
  Trash2,
  FolderKanban,
  ShieldCheck,
} from "lucide-react";

export default function TeamsPage() {
  const { isAdmin } = useAuth();
  const {
    teams,
    members,
    deleteTeam,
    addMemberToTeam,
    removeMemberFromTeam,
  } = useClubData();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);

  const [selectedTeamForAddMember, setSelectedTeamForAddMember] = useState<Team | null>(null);
  const [selectedMemberToAdd, setSelectedMemberToAdd] = useState("");

  const handleDeleteConfirm = async () => {
    if (deletingTeamId) {
      await deleteTeam(deletingTeamId);
      setDeletingTeamId(null);
    }
  };

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamForAddMember || !selectedMemberToAdd) return;
    await addMemberToTeam(selectedTeamForAddMember.id, selectedMemberToAdd);
    setSelectedTeamForAddMember(null);
    setSelectedMemberToAdd("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">Teams & Squads</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-medium">
              {teams.length} Squads
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Specialized squads collaborating across software development, AI, design, and events.
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
            <span>Create Squad</span>
          </Button>
        )}
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {teams.map((team) => (
          <Card key={team.id} className="p-5 flex flex-col justify-between glow-card">
            <div>
              {/* Top info */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-semibold text-base text-zinc-100">{team.name}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{team.description}</p>
                </div>
                <Badge variant="default">{team.members_count || 0} Members</Badge>
              </div>

              {/* Project association */}
              {team.project ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 my-3">
                  <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Project:</span>
                  <Link
                    href={`/projects/${team.project.id}`}
                    className="text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    {team.project.name}
                  </Link>
                </div>
              ) : (
                <span className="text-xs text-zinc-500 italic my-3 block">
                  No project assigned
                </span>
              )}

              {/* Lead Info */}
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 my-3 text-xs">
                <Avatar
                  src={team.lead?.avatar_url}
                  name={team.lead?.full_name || "Unassigned"}
                  size="xs"
                />
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-500 font-medium">Squad Lead</span>
                  <span className="text-xs font-semibold text-zinc-200">
                    {team.lead?.full_name || "No Lead Assigned"}
                  </span>
                </div>
              </div>

              {/* Team Members List */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium mb-1">
                  <span>Assigned Members</span>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setSelectedTeamForAddMember(team);
                        setSelectedMemberToAdd("");
                      }}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px]"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>Add Member</span>
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {team.members && team.members.length > 0 ? (
                    team.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/70 border border-zinc-800/60 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={member.avatar_url}
                            name={member.full_name}
                            size="xs"
                          />
                          <div>
                            <span className="font-medium text-zinc-200 block">
                              {member.full_name}
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              {member.department}
                            </span>
                          </div>
                        </div>

                        {isAdmin && (
                          <button
                            onClick={() => removeMemberFromTeam(team.id, member.id)}
                            className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                            title="Remove member from squad"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-500 py-2 text-center">
                      No members in this squad yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions for Admin */}
            {isAdmin && (
              <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-zinc-800/80">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingTeam(team)}
                  className="gap-1.5 h-8 text-xs"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Squad</span>
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeletingTeamId(team.id)}
                  className="gap-1.5 h-8 text-xs"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Modals */}
      <TeamModal
        isOpen={isCreateModalOpen || editingTeam !== null}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTeam(null);
        }}
        teamToEdit={editingTeam}
      />

      {/* Add Member Dialog */}
      <Dialog
        isOpen={selectedTeamForAddMember !== null}
        onClose={() => setSelectedTeamForAddMember(null)}
        title={`Add Member to ${selectedTeamForAddMember?.name}`}
        description="Select a club member to assign to this specialized team."
        maxWidth="sm"
      >
        <form onSubmit={handleAddMemberSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">
              Select Member
            </label>
            <select
              value={selectedMemberToAdd}
              onChange={(e) => setSelectedMemberToAdd(e.target.value)}
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
              required
            >
              <option value="">Choose a member...</option>
              {members
                .filter(
                  (m) =>
                    !selectedTeamForAddMember?.members?.some((tm) => tm.id === m.id)
                )
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.full_name} ({m.department || m.role})
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedTeamForAddMember(null)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add to Team
            </Button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog
        isOpen={deletingTeamId !== null}
        onClose={() => setDeletingTeamId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Team?"
        message="This action will permanently delete this team squad and unassign all its members."
      />
    </div>
  );
}
