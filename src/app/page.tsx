"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Users2, CheckSquare, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#090b10] text-zinc-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-500/10 via-violet-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-5 max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">ClubFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-16 text-center z-10 flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Role-Based University Club Management</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.15]">
          Where university clubs turn{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
            ideas into progress.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mt-6 leading-relaxed">
          The all-in-one SaaS platform for university organizations to coordinate
          members, lead projects, assign tasks, manage teams, and track analytics with
          role-based access control.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 px-6">
              <span>Open Live App</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Explore Demo Accounts
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 text-left w-full">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold text-zinc-200">Role-Based Control</h3>
            <p className="text-[11px] text-zinc-400 mt-1">
              Custom dashboard experiences and strict database RLS policies for Admins, Project Leads, and Members.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold text-zinc-200">Kanban & Task Flow</h3>
            <p className="text-[11px] text-zinc-400 mt-1">
              Interactive Kanban boards, priority tagging, overdue trackers, and instant status updates.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-semibold text-zinc-200">Real-Time Analytics</h3>
            <p className="text-[11px] text-zinc-400 mt-1">
              Visual velocity, team load balancing, and project completion metrics powered by Recharts.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-800/80 text-center text-xs text-zinc-500">
        © 2026 ClubFlow. Built for university organizations & hackathons.
      </footer>
    </div>
  );
}
