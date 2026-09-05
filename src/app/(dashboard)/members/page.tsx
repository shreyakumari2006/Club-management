"use client";

import React, { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useClubData } from "@/context/ClubDataContext";
import { Profile, UserRole } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { RoleModal } from "@/components/members/RoleModal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { formatDate } from "@/lib/utils";
import {
  Users,
  Search,
  ShieldCheck,
  UserCheck,
  User,
  Shield,
  Trash2,
  Mail,
  GraduationCap,
} from "lucide-react";

export default function MembersPage() {
  const { isAdmin, user: currentUser } = useAuth();
  const { members, teams, deleteMember } = useClubData();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");

  const [editingRoleMember, setEditingRoleMember] = useState<Profile | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  // Filter members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const matchesSearch =
        m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.department?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "ALL" || m.role === roleFilter;
      const matchesDept = departmentFilter === "ALL" || m.department === departmentFilter;

      return matchesSearch && matchesRole && matchesDept;
    });
  }, [members, searchQuery, roleFilter, departmentFilter]);

  const departments = useMemo(() => {
    const list = members.map((m) => m.department).filter(Boolean);
    return Array.from(new Set(list));
  }, [members]);

  const handleDeleteConfirm = async () => {
    if (deletingMemberId) {
      await deleteMember(deletingMemberId);
      setDeletingMemberId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Members Directory
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-medium">
              {members.length} Club Members
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Browse all enrolled students, manage leadership roles, and view team squad allocations.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or dept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="ALL">All Roles</option>
          <option value="ADMIN">Admins</option>
          <option value="PROJECT_LEAD">Project Leads</option>
          <option value="MEMBER">General Members</option>
        </select>

        {/* Department Filter */}
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="ALL">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Members Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/80 text-zinc-400 uppercase tracking-wider font-semibold text-[10px] border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3">Member Profile</th>
                <th className="px-4 py-3">Assigned Role</th>
                <th className="px-4 py-3">Department & Year</th>
                <th className="px-4 py-3">Squads</th>
                <th className="px-4 py-3">Joined Date</th>
                {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-zinc-500">
                    No club members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const memberTeams = teams.filter((t) =>
                    t.members?.some((m) => m.id === member.id)
                  );

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-zinc-900/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={member.avatar_url}
                            name={member.full_name}
                            size="sm"
                          />
                          <div>
                            <span className="font-semibold text-zinc-100 block">
                              {member.full_name}
                            </span>
                            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-zinc-500" />
                              <span>{member.email}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <Badge variant="role" role={member.role} />
                      </td>

                      <td className="px-4 py-3 text-zinc-300">
                        <div>
                          <span>{member.department || "General"}</span>
                          {member.year && (
                            <span className="block text-[10px] text-zinc-500">
                              {member.year}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {memberTeams.length === 0 ? (
                            <span className="text-[11px] text-zinc-500 italic">None</span>
                          ) : (
                            memberTeams.map((t) => (
                              <span
                                key={t.id}
                                className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-medium"
                              >
                                {t.name}
                              </span>
                            ))
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-zinc-400">
                        {formatDate(member.created_at)}
                      </td>

                      {isAdmin && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingRoleMember(member)}
                              className="h-7 text-[11px] px-2 gap-1"
                            >
                              <Shield className="w-3 h-3 text-indigo-400" />
                              <span>Change Role</span>
                            </Button>

                            {member.id !== currentUser?.id && (
                              <button
                                onClick={() => setDeletingMemberId(member.id)}
                                className="p-1.5 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                title="Remove member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role Management Modal */}
      <RoleModal
        isOpen={editingRoleMember !== null}
        onClose={() => setEditingRoleMember(null)}
        member={editingRoleMember}
      />

      <ConfirmDialog
        isOpen={deletingMemberId !== null}
        onClose={() => setDeletingMemberId(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Member?"
        message="Are you sure you want to remove this student from TechVerse Club? They will be unassigned from all teams and tasks."
      />
    </div>
  );
}
