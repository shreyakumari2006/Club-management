export type UserRole = "ADMIN" | "PROJECT_LEAD" | "MEMBER";

export type ProjectStatus = "Planning" | "Active" | "On Hold" | "Completed";

export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";

export type TaskStatus = "To Do" | "In Progress" | "Completed";

export type NotificationType =
  | "TASK_ASSIGNED"
  | "DEADLINE_APPROACHING"
  | "PROJECT_UPDATE"
  | "TEAM_ADDED"
  | "SYSTEM";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  department?: string;
  year?: string;
  bio?: string;
  created_at: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  lead_id?: string;
  lead?: Profile;
  start_date?: string;
  deadline?: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
  // Computed / joined fields
  tasks_count?: number;
  completed_tasks_count?: number;
  progress?: number;
  teams?: Team[];
}

export interface Team {
  id: string;
  name: string;
  description: string;
  project_id?: string;
  project?: Project;
  lead_id?: string;
  lead?: Profile;
  created_at: string;
  updated_at?: string;
  members?: Profile[];
  members_count?: number;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  joined_at: string;
  user?: Profile;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  project_id: string;
  project?: Project;
  assignee_id?: string;
  assignee?: Profile;
  priority: TaskPriority;
  status: TaskStatus;
  deadline?: string;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id?: string;
  user?: Profile;
  project_id?: string;
  project?: Project;
  action: string;
  entity_type: "PROJECT" | "TASK" | "TEAM" | "MEMBER";
  entity_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface DashboardStats {
  totalMembers: number;
  activeProjects: number;
  totalTeams: number;
  pendingTasks: number;
  completedTasks: number;
  overallProgress: number;
  overdueTasks: number;
  myActiveTasks: number;
  myCompletedTasks: number;
  myAssignedProjects: number;
}
