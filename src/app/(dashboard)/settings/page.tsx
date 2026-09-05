"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useClubData } from "@/context/ClubDataContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  Settings,
  ShieldCheck,
  Check,
  X,
  RotateCcw,
  Sparkles,
  Database,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const { role, isAdmin } = useAuth();
  const { resetToDefaultData } = useClubData();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleResetConfirm = () => {
    resetToDefaultData();
    setIsResetConfirmOpen(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3500);
  };

  const permissionsMatrix = [
    {
      feature: "View Projects & Teams",
      admin: true,
      lead: true,
      member: true,
      notes: "Full visibility across university club workspace",
    },
    {
      feature: "Create & Delete Projects",
      admin: true,
      lead: false,
      member: false,
      notes: "Restricted to Club President & Executive Admins",
    },
    {
      feature: "Create & Assign Tasks",
      admin: true,
      lead: true,
      member: false,
      notes: "Project Leads can assign tasks in their projects",
    },
    {
      feature: "Update Own Task Status",
      admin: true,
      lead: true,
      member: true,
      notes: "All assignees can mark tasks In Progress or Completed",
    },
    {
      feature: "Create & Manage Squads",
      admin: true,
      lead: false,
      member: false,
      notes: "Executive level squad allocation",
    },
    {
      feature: "Promote / Change Member Roles",
      admin: true,
      lead: false,
      member: false,
      notes: "Granular Role-Based Access Control",
    },
    {
      feature: "System Analytics & Audit Logs",
      admin: true,
      lead: true,
      member: true,
      notes: "Recharts velocity charts and audit history",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-white">Club Settings</h1>
          <Badge variant="role" role={role} />
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Review club workspace configuration, permission matrices, and system utilities.
        </p>
      </div>

      {resetDone && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>TechVerse Club sample data reset successfully!</span>
        </div>
      )}

      {/* Club Overview Card */}
      <Card className="p-6">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <CardTitle className="text-base font-semibold text-white">
              Club Workspace Info
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">
              Organization Name
            </span>
            <p className="font-bold text-zinc-100 text-sm mt-0.5">TechVerse Club</p>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">
              Tagline
            </span>
            <p className="font-medium text-zinc-200 text-xs mt-0.5">
              "Where clubs turn ideas into progress."
            </p>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">
              Database & Security
            </span>
            <p className="font-medium text-zinc-300 text-xs mt-0.5">
              Supabase PostgreSQL + Row Level Security (RLS)
            </p>
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase font-semibold">
              Current Academic Term
            </span>
            <p className="font-medium text-zinc-300 text-xs mt-0.5">Fall 2026</p>
          </div>
        </CardContent>
      </Card>

      {/* Role-Based Access Control Permissions Matrix */}
      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold text-white">
              Role-Based Access Control (RBAC) Matrix
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Enforced through both Next.js UI authorization checks and Supabase Row Level Security (RLS) policies.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/80 text-zinc-400 uppercase tracking-wider font-semibold text-[10px] border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3">Platform Capability</th>
                <th className="px-4 py-3 text-center">Admin</th>
                <th className="px-4 py-3 text-center">Project Lead</th>
                <th className="px-4 py-3 text-center">Member</th>
                <th className="px-4 py-3">Security Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-zinc-200">
                    {item.feature}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.admin ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-zinc-600 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.lead ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-zinc-600 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.member ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-zinc-600 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-[11px]">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* System Evaluation Utility */}
      <Card className="p-6 border-zinc-800 bg-[#0e131f]/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">
                Reset Demo / Evaluation Data
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              Restore the original TechVerse Club seed dataset (projects, squads, tasks, notifications, and activity logs).
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsResetConfirmOpen(true)}
            className="gap-1.5 shrink-0 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetConfirm}
        title="Reset Sample Data?"
        message="This will reload the official seed projects, teams, tasks, and members for TechVerse Club."
        variant="primary"
        confirmText="Reset to Defaults"
      />
    </div>
  );
}
