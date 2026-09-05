"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UserRole } from "@/types";
import { ShieldCheck, UserCheck, User, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("Computer Science");
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const res = await signup({
      email,
      password,
      full_name: fullName,
      role,
      department,
    });

    setIsLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in my-6">
      <Card className="border-zinc-700/80 bg-[#0e131f]/90 shadow-2xl p-6 sm:p-8">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl font-bold text-white">Join ClubFlow</CardTitle>
          <CardDescription>
            Create your university club account and set up your role
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Liam Davis"
              required
            />

            <Input
              label="University Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@university.edu"
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Department / Major"
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Computer Science & Eng"
              required
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

            {/* Role Selection */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-medium text-zinc-300">
                Requested Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("ADMIN")}
                  className={`p-2 rounded-lg text-xs font-medium flex flex-col items-center gap-1 border transition-all ${
                    role === "ADMIN"
                      ? "bg-rose-500/15 border-rose-500/40 text-rose-300"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("PROJECT_LEAD")}
                  className={`p-2 rounded-lg text-xs font-medium flex flex-col items-center gap-1 border transition-all ${
                    role === "PROJECT_LEAD"
                      ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-300"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-indigo-400" />
                  <span>Lead</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("MEMBER")}
                  className={`p-2 rounded-lg text-xs font-medium flex flex-col items-center gap-1 border transition-all ${
                    role === "MEMBER"
                      ? "bg-zinc-700 border-zinc-500 text-white"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <User className="w-4 h-4 text-zinc-300" />
                  <span>Member</span>
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-10 mt-3"
              isLoading={isLoading}
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          <div className="text-center text-xs text-zinc-400">
            Already registered?{" "}
            <Link
              href="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
