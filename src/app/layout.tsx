import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ClubDataProvider } from "@/context/ClubDataContext";

export const metadata: Metadata = {
  title: "ClubFlow — Role-Based Club Management SaaS",
  description: "Where university clubs turn ideas into progress. Modern role-based management for members, projects, teams, tasks, and analytics.",
  keywords: ["university club management", "role-based access control", "kanban board", "project management SaaS"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090b10] text-zinc-100 flex flex-col antialiased">
        <AuthProvider>
          <ClubDataProvider>{children}</ClubDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
