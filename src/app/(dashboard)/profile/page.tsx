"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useClubData } from "@/context/ClubDataContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate } from "@/lib/utils";
import { User, Mail, Shield, Building, Calendar, CheckSquare, Save } from "lucide-react";

export default function ProfilePage() {
  const { user, role, updateProfile } = useAuth();
  const { tasks, projects } = useClubData();

  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setDepartment(user.department || "");
      setYear(user.year || "Junior");
      setBio(user.bio || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateProfile({
        full_name: fullName,
        department,
        year,
        bio,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const userTasks = tasks.filter((t) => t.assignee_id === user?.id);
  const userCompletedTasks = userTasks.filter((t) => t.status === "Completed");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-2xl font-bold tracking-tight text-white">My Profile</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage your personal university club details and view your contribution stats.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Summary Card */}
        <Card className="p-6 text-center flex flex-col items-center space-y-4">
          <Avatar
            src={user?.avatar_url}
            name={user?.full_name}
            size="xl"
            className="ring-4 ring-indigo-500/20 shadow-lg"
          />

          <div>
            <h2 className="text-base font-bold text-white">{user?.full_name}</h2>
            <p className="text-xs text-zinc-400 mt-0.5">{user?.email}</p>
            <div className="mt-2">
              <Badge variant="role" role={role} />
            </div>
          </div>

          <div className="w-full pt-4 border-t border-zinc-800/80 space-y-2 text-left text-xs">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-zinc-500" />
                <span>Department</span>
              </span>
              <span className="text-zinc-200 font-medium">{user?.department || "General"}</span>
            </div>

            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>Joined</span>
              </span>
              <span className="text-zinc-200 font-medium">{formatDate(user?.created_at)}</span>
            </div>
          </div>

          {/* Mini contribution stats */}
          <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80 text-center">
            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
              <span className="block text-zinc-500 text-[10px]">Assigned Tasks</span>
              <span className="font-bold text-zinc-200 text-sm">{userTasks.length}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
              <span className="block text-zinc-500 text-[10px]">Completed</span>
              <span className="font-bold text-emerald-400 text-sm">
                {userCompletedTasks.length}
              </span>
            </div>
          </div>
        </Card>

        {/* Right 2 Columns: Edit Profile Form */}
        <Card className="lg:col-span-2 p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-white">
              Edit Personal Details
            </CardTitle>
          </CardHeader>

          <CardContent>
            {saveSuccess && (
              <div className="p-3 mb-4 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs">
                Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <Input
                label="University Email (Read-only)"
                value={user?.email || ""}
                disabled
                className="opacity-70 bg-zinc-950"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Department / Faculty"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science"
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-zinc-300">
                    Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3.5 py-2 text-sm text-zinc-100 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
              </div>

              <Textarea
                label="Bio & Responsibilities"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your interests, skills, or club focus..."
                rows={3}
              />

              <div className="flex items-center justify-end pt-4 border-t border-zinc-800">
                <Button type="submit" variant="primary" isLoading={isSaving} className="gap-1.5">
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
