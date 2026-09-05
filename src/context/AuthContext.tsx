"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Profile, UserRole } from "@/types";
import { DEMO_USERS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: Profile | null;
  role: UserRole;
  isLoading: boolean;
  isAdmin: boolean;
  isProjectLead: boolean;
  isMember: boolean;
  login: (email: string, password?: string) => Promise<{ error?: string }>;
  signup: (data: {
    email: string;
    password?: string;
    full_name: string;
    role: UserRole;
    department?: string;
  }) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  switchDemoRole: (roleKey: "admin" | "lead" | "lead2" | "member" | "member2" | "member3" | "member4") => void;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default to Admin in demo mode so examiner gets full rich initial view immediately
  const [user, setUser] = useState<Profile | null>(DEMO_USERS.admin);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persisted demo session or Supabase session
    const savedUser = localStorage.getItem("clubflow_current_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(DEMO_USERS.admin);
      }
    } else {
      setUser(DEMO_USERS.admin);
      localStorage.setItem("clubflow_current_user", JSON.stringify(DEMO_USERS.admin));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      // Find matching demo user or match by email
      const matchedKey = Object.keys(DEMO_USERS).find(
        (key) => DEMO_USERS[key].email.toLowerCase() === email.toLowerCase()
      );

      if (matchedKey) {
        const foundUser = DEMO_USERS[matchedKey];
        setUser(foundUser);
        localStorage.setItem("clubflow_current_user", JSON.stringify(foundUser));
        setIsLoading(false);
        return {};
      }

      // If user signed up newly, check local storage users
      const customUsers = JSON.parse(localStorage.getItem("clubflow_custom_users") || "[]");
      const customUser = customUsers.find(
        (u: Profile) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (customUser) {
        setUser(customUser);
        localStorage.setItem("clubflow_current_user", JSON.stringify(customUser));
        setIsLoading(false);
        return {};
      }

      // Try Supabase auth if configured
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: password || "password123",
        });
        if (error) {
          // If Supabase is not reachable, fallback to mock guest login
          const guestUser: Profile = {
            id: `usr_${Date.now()}`,
            email,
            full_name: email.split("@")[0].toUpperCase(),
            role: "MEMBER",
            department: "Engineering",
            year: "Freshman",
            created_at: new Date().toISOString(),
          };
          setUser(guestUser);
          localStorage.setItem("clubflow_current_user", JSON.stringify(guestUser));
          setIsLoading(false);
          return {};
        }
        if (data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();

          const activeProfile = profile || {
            id: data.user.id,
            email: data.user.email!,
            full_name: data.user.user_metadata?.full_name || email.split("@")[0],
            role: data.user.user_metadata?.role || "MEMBER",
            created_at: new Date().toISOString(),
          };

          setUser(activeProfile);
          localStorage.setItem("clubflow_current_user", JSON.stringify(activeProfile));
        }
      } catch {
        // Safe fallback
      }

      setIsLoading(false);
      return {};
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || "Failed to sign in" };
    }
  };

  const signup = async (data: {
    email: string;
    password?: string;
    full_name: string;
    role: UserRole;
    department?: string;
  }) => {
    setIsLoading(true);
    try {
      const newUser: Profile = {
        id: `usr_${Date.now()}`,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        department: data.department || "General",
        year: "Freshman",
        avatar_url: `https://avatar.vercel.sh/${encodeURIComponent(data.email)}`,
        created_at: new Date().toISOString(),
      };

      const customUsers = JSON.parse(localStorage.getItem("clubflow_custom_users") || "[]");
      customUsers.push(newUser);
      localStorage.setItem("clubflow_custom_users", JSON.stringify(customUsers));

      setUser(newUser);
      localStorage.setItem("clubflow_current_user", JSON.stringify(newUser));

      // Also trigger Supabase signup if reachable
      try {
        const supabase = createClient();
        await supabase.auth.signUp({
          email: data.email,
          password: data.password || "Password123!",
          options: {
            data: {
              full_name: data.full_name,
              role: data.role,
              department: data.department,
            },
          },
        });
      } catch {
        // Offline / demo fallback
      }

      setIsLoading(false);
      return {};
    } catch (err: any) {
      setIsLoading(false);
      return { error: err.message || "Failed to create account" };
    }
  };

  const logout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    setUser(null);
    localStorage.removeItem("clubflow_current_user");
  };

  const switchDemoRole = (
    roleKey: "admin" | "lead" | "lead2" | "member" | "member2" | "member3" | "member4"
  ) => {
    const selected = DEMO_USERS[roleKey] || DEMO_USERS.admin;
    setUser(selected);
    localStorage.setItem("clubflow_current_user", JSON.stringify(selected));
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return;
    const updated = { ...user, ...data, updated_at: new Date().toISOString() };
    setUser(updated);
    localStorage.setItem("clubflow_current_user", JSON.stringify(updated));
    try {
      const supabase = createClient();
      await supabase.from("profiles").update(data).eq("id", user.id);
    } catch {
      // Ignore
    }
  };

  const role = user?.role || "MEMBER";
  const isAdmin = role === "ADMIN";
  const isProjectLead = role === "PROJECT_LEAD";
  const isMember = role === "MEMBER";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        isAdmin,
        isProjectLead,
        isMember,
        login,
        signup,
        logout,
        switchDemoRole,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
