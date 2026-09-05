"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import {
  Project,
  Team,
  Task,
  Profile,
  Notification,
  ActivityLog,
  DashboardStats,
  TaskStatus,
  ProjectStatus,
  TaskPriority,
} from "@/types";
import {
  DEMO_USERS,
  INITIAL_PROJECTS,
  INITIAL_TEAMS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_TASKS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY,
} from "@/lib/constants";
import { useAuth } from "./AuthContext";
import { createClient } from "@/lib/supabase/client";

interface ClubDataContextType {
  projects: Project[];
  teams: Team[];
  tasks: Task[];
  members: Profile[];
  notifications: Notification[];
  activities: ActivityLog[];
  stats: DashboardStats;
  unreadNotificationsCount: number;

  // Actions
  createProject: (data: Omit<Project, "id" | "created_at">) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  createTeam: (data: Omit<Team, "id" | "created_at">) => Promise<Team>;
  updateTeam: (id: string, data: Partial<Team>) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  addMemberToTeam: (teamId: string, userId: string) => Promise<void>;
  removeMemberFromTeam: (teamId: string, userId: string) => Promise<void>;

  createTask: (data: Omit<Task, "id" | "created_at">) => Promise<Task>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  updateMemberRole: (userId: string, role: "ADMIN" | "PROJECT_LEAD" | "MEMBER") => Promise<void>;
  deleteMember: (userId: string) => Promise<void>;

  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  addActivity: (action: string, entityType: "PROJECT" | "TASK" | "TEAM" | "MEMBER", entityId?: string, projectId?: string) => void;
  resetToDefaultData: () => void;
  refetchData: () => Promise<void>;
}

const ClubDataContext = createContext<ClubDataContextType | undefined>(undefined);

export function ClubDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [teamMembers, setTeamMembers] = useState<{ team_id: string; user_id: string }[]>(INITIAL_TEAM_MEMBERS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [members, setMembers] = useState<Profile[]>(Object.values(DEMO_USERS));
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activities, setActivities] = useState<ActivityLog[]>(INITIAL_ACTIVITY);

  // Load from local storage or Supabase
  const loadData = useCallback(async () => {
    try {
      // 1. Try local storage cache first for instant UI response
      const storedProjects = localStorage.getItem("clubflow_projects");
      const storedTeams = localStorage.getItem("clubflow_teams");
      const storedTeamMembers = localStorage.getItem("clubflow_team_members");
      const storedTasks = localStorage.getItem("clubflow_tasks");
      const storedMembers = localStorage.getItem("clubflow_members");
      const storedNotifications = localStorage.getItem("clubflow_notifications");
      const storedActivities = localStorage.getItem("clubflow_activities");

      if (storedProjects) setProjects(JSON.parse(storedProjects));
      if (storedTeams) setTeams(JSON.parse(storedTeams));
      if (storedTeamMembers) setTeamMembers(JSON.parse(storedTeamMembers));
      if (storedTasks) setTasks(JSON.parse(storedTasks));
      if (storedMembers) setMembers(JSON.parse(storedMembers));
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
      if (storedActivities) setActivities(JSON.parse(storedActivities));

      // 2. Fetch from Supabase if connected
      const { data: dbProjects } = await supabase.from("projects").select("*");
      if (dbProjects && dbProjects.length > 0) {
        setProjects(dbProjects);
        localStorage.setItem("clubflow_projects", JSON.stringify(dbProjects));
      }

      const { data: dbTeams } = await supabase.from("teams").select("*");
      if (dbTeams && dbTeams.length > 0) {
        setTeams(dbTeams);
        localStorage.setItem("clubflow_teams", JSON.stringify(dbTeams));
      }

      const { data: dbTeamMembers } = await supabase.from("team_members").select("*");
      if (dbTeamMembers && dbTeamMembers.length > 0) {
        setTeamMembers(dbTeamMembers);
        localStorage.setItem("clubflow_team_members", JSON.stringify(dbTeamMembers));
      }

      const { data: dbTasks } = await supabase.from("tasks").select("*");
      if (dbTasks && dbTasks.length > 0) {
        setTasks(dbTasks);
        localStorage.setItem("clubflow_tasks", JSON.stringify(dbTasks));
      }

      const { data: dbProfiles } = await supabase.from("profiles").select("*");
      if (dbProfiles && dbProfiles.length > 0) {
        setMembers(dbProfiles);
        localStorage.setItem("clubflow_members", JSON.stringify(dbProfiles));
      }
    } catch {
      // Fallback to initial seeds
    }
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save changes to localStorage whenever state updates
  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem("clubflow_projects", JSON.stringify(newProjects));
  };

  const saveTeams = (newTeams: Team[]) => {
    setTeams(newTeams);
    localStorage.setItem("clubflow_teams", JSON.stringify(newTeams));
  };

  const saveTeamMembers = (newTeamMembers: { team_id: string; user_id: string }[]) => {
    setTeamMembers(newTeamMembers);
    localStorage.setItem("clubflow_team_members", JSON.stringify(newTeamMembers));
  };

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem("clubflow_tasks", JSON.stringify(newTasks));
  };

  const saveMembers = (newMembers: Profile[]) => {
    setMembers(newMembers);
    localStorage.setItem("clubflow_members", JSON.stringify(newMembers));
  };

  const saveNotifications = (newNotifications: Notification[]) => {
    setNotifications(newNotifications);
    localStorage.setItem("clubflow_notifications", JSON.stringify(newNotifications));
  };

  const saveActivities = (newActivities: ActivityLog[]) => {
    setActivities(newActivities);
    localStorage.setItem("clubflow_activities", JSON.stringify(newActivities));
  };

  const addActivity = (
    action: string,
    entityType: "PROJECT" | "TASK" | "TEAM" | "MEMBER",
    entityId?: string,
    projectId?: string
  ) => {
    const newActivity: ActivityLog = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      user_id: user?.id,
      user: user || undefined,
      project_id: projectId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      created_at: new Date().toISOString(),
    };
    saveActivities([newActivity, ...activities]);
    try {
      supabase.from("activity_logs").insert({
        user_id: user?.id,
        project_id: projectId,
        action,
        entity_type: entityType,
        entity_id: entityId,
      });
    } catch {
      // Offline fallback
    }
  };

  // Enriched Projects with Lead, Teams, and Task Progress calculations
  const enrichedProjects = useMemo(() => {
    return projects.map((p) => {
      const projectTasks = tasks.filter((t) => t.project_id === p.id);
      const completedTasks = projectTasks.filter((t) => t.status === "Completed");
      const progress =
        projectTasks.length === 0
          ? 0
          : Math.round((completedTasks.length / projectTasks.length) * 100);

      const lead = members.find((m) => m.id === p.lead_id);
      const projectTeams = teams.filter((tm) => tm.project_id === p.id);

      return {
        ...p,
        lead,
        progress,
        tasks_count: projectTasks.length,
        completed_tasks_count: completedTasks.length,
        teams: projectTeams,
      };
    });
  }, [projects, tasks, members, teams]);

  // Enriched Teams with Lead and Members
  const enrichedTeams = useMemo(() => {
    return teams.map((tm) => {
      const teamUserIds = teamMembers
        .filter((rel) => rel.team_id === tm.id)
        .map((rel) => rel.user_id);
      const teamMemberList = members.filter((m) => teamUserIds.includes(m.id));
      const lead = members.find((m) => m.id === tm.lead_id);
      const project = projects.find((p) => p.id === tm.project_id);

      return {
        ...tm,
        lead,
        project,
        members: teamMemberList,
        members_count: teamMemberList.length,
      };
    });
  }, [teams, teamMembers, members, projects]);

  // Enriched Tasks with Project and Assignee
  const enrichedTasks = useMemo(() => {
    return tasks.map((t) => {
      const project = projects.find((p) => p.id === t.project_id);
      const assignee = members.find((m) => m.id === t.assignee_id);
      return {
        ...t,
        project,
        assignee,
      };
    });
  }, [tasks, projects, members]);

  // Enriched Activities with User and Project
  const enrichedActivities = useMemo(() => {
    return activities.map((a) => {
      const actUser = members.find((m) => m.id === a.user_id);
      const project = projects.find((p) => p.id === a.project_id);
      return {
        ...a,
        user: actUser || a.user,
        project,
      };
    });
  }, [activities, members, projects]);

  // Dashboard Stats
  const stats: DashboardStats = useMemo(() => {
    const totalMembers = members.length;
    const activeProjects = projects.filter((p) => p.status === "Active").length;
    const totalTeams = teams.length;
    const pendingTasks = tasks.filter((t) => t.status !== "Completed").length;
    const completedTasks = tasks.filter((t) => t.status === "Completed").length;

    const overallProgress =
      tasks.length === 0
        ? 0
        : Math.round((completedTasks / tasks.length) * 100);

    const now = new Date().getTime();
    const overdueTasks = tasks.filter(
      (t) =>
        t.status !== "Completed" &&
        t.deadline &&
        new Date(t.deadline).getTime() < now
    ).length;

    const myTasks = user ? tasks.filter((t) => t.assignee_id === user.id) : [];
    const myActiveTasks = myTasks.filter((t) => t.status !== "Completed").length;
    const myCompletedTasks = myTasks.filter((t) => t.status === "Completed").length;

    const myAssignedProjects = user
      ? projects.filter(
          (p) =>
            p.lead_id === user.id ||
            teams.some(
              (tm) =>
                tm.project_id === p.id &&
                teamMembers.some((rel) => rel.team_id === tm.id && rel.user_id === user.id)
            )
        ).length
      : 0;

    return {
      totalMembers,
      activeProjects,
      totalTeams,
      pendingTasks,
      completedTasks,
      overallProgress,
      overdueTasks,
      myActiveTasks,
      myCompletedTasks,
      myAssignedProjects,
    };
  }, [members, projects, teams, tasks, teamMembers, user]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.is_read).length;
  }, [notifications]);

  // Action Implementations
  const createProject = async (data: Omit<Project, "id" | "created_at">): Promise<Project> => {
    const newProject: Project = {
      ...data,
      id: `proj_${Date.now()}`,
      created_at: new Date().toISOString(),
      created_by: user?.id,
    };
    const updated = [newProject, ...projects];
    saveProjects(updated);
    addActivity(`created project "${data.name}"`, "PROJECT", newProject.id, newProject.id);

    try {
      await supabase.from("projects").insert({
        name: data.name,
        description: data.description,
        status: data.status,
        lead_id: data.lead_id,
        start_date: data.start_date,
        deadline: data.deadline,
        created_by: user?.id,
      });
    } catch {
      // Offline fallback
    }

    return newProject;
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    const updated = projects.map((p) =>
      p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p
    );
    saveProjects(updated);
    addActivity(`updated project details`, "PROJECT", id, id);

    try {
      await supabase.from("projects").update(data).eq("id", id);
    } catch {
      // Offline fallback
    }
  };

  const deleteProject = async (id: string) => {
    const target = projects.find((p) => p.id === id);
    const updated = projects.filter((p) => p.id !== id);
    saveProjects(updated);
    const remainingTasks = tasks.filter((t) => t.project_id !== id);
    saveTasks(remainingTasks);
    const unboundTeams = teams.map((tm) =>
      tm.project_id === id ? { ...tm, project_id: undefined } : tm
    );
    saveTeams(unboundTeams);
    addActivity(`deleted project "${target?.name || id}"`, "PROJECT", id);

    try {
      await supabase.from("projects").delete().eq("id", id);
    } catch {
      // Offline fallback
    }
  };

  const createTeam = async (data: Omit<Team, "id" | "created_at">): Promise<Team> => {
    const newTeam: Team = {
      ...data,
      id: `team_${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [newTeam, ...teams];
    saveTeams(updated);
    if (data.lead_id) {
      saveTeamMembers([...teamMembers, { team_id: newTeam.id, user_id: data.lead_id }]);
    }
    addActivity(`created team "${data.name}"`, "TEAM", newTeam.id, data.project_id);

    try {
      await supabase.from("teams").insert({
        name: data.name,
        description: data.description,
        project_id: data.project_id,
        lead_id: data.lead_id,
      });
    } catch {
      // Offline fallback
    }

    return newTeam;
  };

  const updateTeam = async (id: string, data: Partial<Team>) => {
    const updated = teams.map((tm) =>
      tm.id === id ? { ...tm, ...data, updated_at: new Date().toISOString() } : tm
    );
    saveTeams(updated);
    addActivity(`updated team details`, "TEAM", id, data.project_id);

    try {
      await supabase.from("teams").update(data).eq("id", id);
    } catch {
      // Offline fallback
    }
  };

  const deleteTeam = async (id: string) => {
    const target = teams.find((tm) => tm.id === id);
    saveTeams(teams.filter((tm) => tm.id !== id));
    saveTeamMembers(teamMembers.filter((rel) => rel.team_id !== id));
    addActivity(`deleted team "${target?.name || id}"`, "TEAM", id);

    try {
      await supabase.from("teams").delete().eq("id", id);
    } catch {
      // Offline fallback
    }
  };

  const addMemberToTeam = async (teamId: string, userId: string) => {
    if (!teamMembers.some((rel) => rel.team_id === teamId && rel.user_id === userId)) {
      const updated = [...teamMembers, { team_id: teamId, user_id: userId }];
      saveTeamMembers(updated);
      const team = teams.find((t) => t.id === teamId);
      const member = members.find((m) => m.id === userId);
      addActivity(`added ${member?.full_name || "member"} to team "${team?.name}"`, "TEAM", teamId, team?.project_id);
      
      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        user_id: userId,
        title: "Added to Team",
        message: `You were added to ${team?.name || "a new team"}.`,
        type: "TEAM_ADDED",
        link: "/teams",
        is_read: false,
        created_at: new Date().toISOString(),
      };
      saveNotifications([newNotif, ...notifications]);

      try {
        await supabase.from("team_members").insert({ team_id: teamId, user_id: userId });
      } catch {
        // Offline fallback
      }
    }
  };

  const removeMemberFromTeam = async (teamId: string, userId: string) => {
    const updated = teamMembers.filter(
      (rel) => !(rel.team_id === teamId && rel.user_id === userId)
    );
    saveTeamMembers(updated);

    try {
      await supabase.from("team_members").delete().match({ team_id: teamId, user_id: userId });
    } catch {
      // Offline fallback
    }
  };

  const createTask = async (data: Omit<Task, "id" | "created_at">): Promise<Task> => {
    const newTask: Task = {
      ...data,
      id: `task_${Date.now()}`,
      created_at: new Date().toISOString(),
      created_by: user?.id,
    };
    const updated = [newTask, ...tasks];
    saveTasks(updated);
    addActivity(`created task "${data.title}"`, "TASK", newTask.id, data.project_id);

    if (data.assignee_id && data.assignee_id !== user?.id) {
      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        user_id: data.assignee_id,
        title: "New Task Assigned",
        message: `${user?.full_name || "A lead"} assigned you "${data.title}".`,
        type: "TASK_ASSIGNED",
        link: "/tasks",
        is_read: false,
        created_at: new Date().toISOString(),
      };
      saveNotifications([newNotif, ...notifications]);
    }

    try {
      await supabase.from("tasks").insert({
        title: data.title,
        description: data.description,
        project_id: data.project_id,
        assignee_id: data.assignee_id,
        priority: data.priority,
        status: data.status,
        deadline: data.deadline,
        created_by: user?.id,
      });
    } catch {
      // Offline fallback
    }

    return newTask;
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, ...data, updated_at: new Date().toISOString() } : t
    );
    saveTasks(updated);
    addActivity(`updated task "${data.title || "details"}"`, "TASK", id, data.project_id);

    try {
      await supabase.from("tasks").update(data).eq("id", id);
    } catch {
      // Offline fallback
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    const target = tasks.find((t) => t.id === id);
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, status, updated_at: new Date().toISOString() } : t
    );
    saveTasks(updated);
    addActivity(
      `changed status of "${target?.title || "task"}" to ${status}`,
      "TASK",
      id,
      target?.project_id
    );

    try {
      await supabase.from("tasks").update({ status }).eq("id", id);
    } catch {
      // Offline fallback
    }
  };

  const deleteTask = async (id: string) => {
    const target = tasks.find((t) => t.id === id);
    saveTasks(tasks.filter((t) => t.id !== id));
    addActivity(`deleted task "${target?.title || id}"`, "TASK", id, target?.project_id);

    try {
      await supabase.from("tasks").delete().eq("id", id);
    } catch {
      // Offline fallback
    }
  };

  const updateMemberRole = async (userId: string, role: "ADMIN" | "PROJECT_LEAD" | "MEMBER") => {
    const updated = members.map((m) => (m.id === userId ? { ...m, role } : m));
    saveMembers(updated);
    const target = members.find((m) => m.id === userId);
    addActivity(`changed role of ${target?.full_name || "member"} to ${role}`, "MEMBER", userId);

    try {
      await supabase.from("profiles").update({ role }).eq("id", userId);
    } catch {
      // Offline fallback
    }
  };

  const deleteMember = async (userId: string) => {
    const target = members.find((m) => m.id === userId);
    saveMembers(members.filter((m) => m.id !== userId));
    saveTeamMembers(teamMembers.filter((rel) => rel.user_id !== userId));
    addActivity(`removed member ${target?.full_name || userId} from club`, "MEMBER", userId);

    try {
      await supabase.from("profiles").delete().eq("id", userId);
    } catch {
      // Offline fallback
    }
  };

  const markNotificationAsRead = async (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n));
    saveNotifications(updated);

    try {
      await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    } catch {
      // Offline fallback
    }
  };

  const markAllNotificationsAsRead = async () => {
    const updated = notifications.map((n) => ({ ...n, is_read: true }));
    saveNotifications(updated);

    try {
      if (user?.id) {
        await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id);
      }
    } catch {
      // Offline fallback
    }
  };

  const resetToDefaultData = () => {
    saveProjects(INITIAL_PROJECTS);
    saveTeams(INITIAL_TEAMS);
    saveTeamMembers(INITIAL_TEAM_MEMBERS);
    saveTasks(INITIAL_TASKS);
    saveMembers(Object.values(DEMO_USERS));
    saveNotifications(INITIAL_NOTIFICATIONS);
    saveActivities(INITIAL_ACTIVITY);
  };

  return (
    <ClubDataContext.Provider
      value={{
        projects: enrichedProjects,
        teams: enrichedTeams,
        tasks: enrichedTasks,
        members,
        notifications,
        activities: enrichedActivities,
        stats,
        unreadNotificationsCount,
        createProject,
        updateProject,
        deleteProject,
        createTeam,
        updateTeam,
        deleteTeam,
        addMemberToTeam,
        removeMemberFromTeam,
        createTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        updateMemberRole,
        deleteMember,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addActivity,
        resetToDefaultData,
        refetchData: loadData,
      }}
    >
      {children}
    </ClubDataContext.Provider>
  );
}

export function useClubData() {
  const context = useContext(ClubDataContext);
  if (!context) {
    throw new Error("useClubData must be used within a ClubDataProvider");
  }
  return context;
}
