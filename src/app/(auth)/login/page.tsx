"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, UserCheck, User, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import { DEMO_USERS } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@clubflow.org");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      router.push("/dashboard");
    }
  };

  const selectDemoRole = (roleKey: "admin" | "lead" | "member") => {
    const u = DEMO_USERS[roleKey];
    if (u) {
      setEmail(u.email);
      setPassword("password123");
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      <Card className="border-zinc-700/80 bg-[#0e131f]/90 shadow-2xl p-6 sm:p-8">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl font-bold text-white">Welcome back</CardTitle>
          <CardDescription>
            Sign in to access your ClubFlow workspace
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Demo Credentials Switcher */}
          <div className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-medium text-zinc-400">
              <span>Quick Demo Fill</span>
              <span className="text-[10px] text-amber-400 font-mono">1-Click Test</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => selectDemoRole("admin")}
                className={`px-2 py-1.5 rounded text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
                  email === DEMO_USERS.admin.email
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <ShieldCheck className="w-3 h-3 text-rose-400" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => selectDemoRole("lead")}
                className={`px-2 py-1.5 rounded text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
                  email === DEMO_USERS.lead.email
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <UserCheck className="w-3 h-3 text-indigo-400" />
                <span>Lead</span>
              </button>
              <button
                type="button"
                onClick={() => selectDemoRole("member")}
                className={`px-2 py-1.5 rounded text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
                  email === DEMO_USERS.member.email
                    ? "bg-zinc-700 text-zinc-200 border border-zinc-600 font-semibold"
                    : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <User className="w-3 h-3 text-zinc-400" />
                <span>Member</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="University Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@clubflow.org"
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              className="w-full h-10 mt-2"
              isLoading={isLoading}
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="text-center text-xs text-zinc-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Create club profile
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
