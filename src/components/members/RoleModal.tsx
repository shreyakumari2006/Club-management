"use client";

import React, { useState, useEffect } from "react";
import { Profile, UserRole } from "@/types";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useClubData } from "@/context/ClubDataContext";
import { ShieldCheck, UserCheck, User } from "lucide-react";

export interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Profile | null;
}

export function RoleModal({ isOpen, onClose, member }: RoleModalProps) {
  const { updateMemberRole } = useClubData();
  const [selectedRole, setSelectedRole] = useState<UserRole>("MEMBER");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (member) {
      setSelectedRole(member.role);
    }
  }, [member, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    setIsSubmitting(true);
    try {
      await updateMemberRole(member.id, selectedRole);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Member Role"
      description={`Update role permissions for ${member?.full_name || "member"}.`}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setSelectedRole("ADMIN")}
            className={`w-full p-3 rounded-lg text-left border transition-all flex items-start gap-3 ${
              selectedRole === "ADMIN"
                ? "bg-rose-500/15 border-rose-500/40 text-rose-300 ring-1 ring-rose-500/30"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-white">Admin</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Full authority over members, projects, teams, tasks, and system settings.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("PROJECT_LEAD")}
            className={`w-full p-3 rounded-lg text-left border transition-all flex items-start gap-3 ${
              selectedRole === "PROJECT_LEAD"
                ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300 ring-1 ring-indigo-500/30"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <UserCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-white">Project Lead</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Can create and assign tasks, manage deadlines, and lead assigned projects.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("MEMBER")}
            className={`w-full p-3 rounded-lg text-left border transition-all flex items-start gap-3 ${
              selectedRole === "MEMBER"
                ? "bg-zinc-800 border-zinc-600 text-white ring-1 ring-zinc-500/30"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <User className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-white">Member</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Can view assigned deliverables, teams, and update own task status.
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Update Role
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
