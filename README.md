# ClubFlow — Role-Based University Club Management SaaS

> **"Where university clubs turn ideas into progress."**

ClubFlow is a modern, production-grade SaaS-style web platform engineered for university organizations, student councils, and tech clubs to manage members, projects, specialized squads, tasks, deadlines, notifications, and analytics with end-to-end Role-Based Access Control (RBAC).

---

## 🌟 Key Highlights & Features

- **Role-Adaptive Experience:** Custom tailored dashboards and capability matrices for **Admin**, **Project Lead**, and **Member** personas.
- **Project Lifecycle Management:** Track initiatives from planning to completion with real-time milestone progress tracking.
- **Specialized Squads (Teams):** Group members into departmental teams (Web, AI, Design, Logistics) linked directly to projects.
- **Interactive Kanban & List Tasks:** Switchable Kanban board (`TO DO`, `IN PROGRESS`, `COMPLETED`) and tabular list with priority tags, overdue indicators, and 1-click status transitions.
- **Deep Velocity Analytics:** Visual analytics powered by Recharts (Milestone Completion %, Task Status Funnels, Priority Breakdown, and Squad Workloads).
- **In-App Notification Center:** Real-time alerts for task assignments, milestone deadlines, and squad changes.
- **Live Audit Activity Feed:** Chronological audit trail tracking all actions and project updates across the club.
- **Global `Cmd+K` Quick Search:** Instant spotlight modal searching projects, deliverables, and club members.
- **Modern Linear/Vercel Aesthetic:** Sleek dark mode design system, subtle borders, glowing accent tokens, and accessible dialogs.

---

## 👥 Role Permissions Matrix

| Platform Capability | Admin | Project Lead | Member |
| :--- | :---: | :---: | :---: |
| **View Club Projects & Squads** | ✅ Full Access | ✅ Assigned Projects | ✅ Assigned Projects |
| **Create & Delete Projects** | ✅ Yes | ❌ No | ❌ No |
| **Edit Project Metadata** | ✅ Any Project | ✅ Assigned Only | ❌ No |
| **Create & Manage Teams** | ✅ Yes | ❌ No | ❌ No |
| **Create & Assign Tasks** | ✅ Any Project | ✅ Assigned Projects | ❌ No |
| **Update Own Task Status** | ✅ Yes | ✅ Yes | ✅ Yes (Assigned tasks) |
| **Manage Members & Roles** | ✅ Yes | ❌ No | ❌ No |
| **Club-wide Analytics & Audit** | ✅ Full Visibility | ✅ Project/Squad Metrics | ✅ Personal Velocity |
| **System Settings & Reset** | ✅ Full Access | ❌ Read Only | ❌ Read Only |

---

## 🛠️ Technology Stack

- **Frontend Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Components & Client Boundaries)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Type Safety)
- **Styling & Design System:** [Tailwind CSS](https://tailwindcss.com/) + CSS Variables
- **Icons:** [Lucide React](https://lucide.dev/)
- **Data Visualization:** [Recharts](https://recharts.org/)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL Database, Supabase Auth, Row Level Security)
- **Authentication:** Supabase Auth (JWT session persistence & cookie middleware)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 🏛️ Application Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           ClubFlow Client                               │
│  Next.js 14+ (App Router) + TypeScript + Tailwind CSS + Lucide Icons    │
│  Role-Guarded Application Shell (Sidebar, TopNav, Breadcrumbs, Modals)  │
└──────────────────┬───────────────────────────────────────┬──────────────┘
                   │                                       │
         Client SDK / REST Calls                  Supabase Realtime / Auth
                   │                                       │
┌──────────────────▼───────────────────────────────────────▼──────────────┐
│                            Supabase BaaS                                │
│  ┌───────────────────────┐   ┌────────────────────────────────────────┐  │
│  │     Supabase Auth     │   │     PostgreSQL + Row Level Security     │  │
│  │ (Session, JWT, Roles) │   │ (Profiles, Projects, Teams, Tasks, etc)│  │
│  └───────────────────────┘   └────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Automated Triggers: Profile Sync, Task Activity, Notifications  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema & Relationships

The database is built on PostgreSQL inside Supabase with UUID primary keys, cascade rules, and check constraints:

```
profiles (1:1 with auth.users)
   ├── projects (1:N via lead_id / created_by)
   ├── teams (1:N via lead_id)
   ├── team_members (N:M link table)
   ├── tasks (1:N via assignee_id / created_by)
   └── notifications (1:N via user_id)

projects
   ├── teams (1:N via project_id)
   └── tasks (1:N via project_id)

teams
   └── team_members (1:N via team_id)
```

### Key Tables:
1. `profiles`: Extended user metadata (Full Name, Role, Department, Academic Year, Bio, Avatar).
2. `projects`: Initiatives with start date, deadline, assigned lead, status (`Planning`, `Active`, `On Hold`, `Completed`).
3. `teams`: Sub-teams (Web Team, AI Team, Design Team, Events Team) linked to projects.
4. `team_members`: Composite many-to-many junction table.
5. `tasks`: Deliverables with priorities (`Low`, `Medium`, `High`, `Urgent`), statuses (`To Do`, `In Progress`, `Completed`), assignees, and deadlines.
6. `notifications`: In-app notification alerts with read/unread flags and target URLs.
7. `activity_logs`: Immutable chronological audit feed with JSONB metadata.

---

## 🔒 Row Level Security (RLS) Policies

All 7 tables have Row Level Security enabled:

- **`profiles`:**
  - `SELECT`: Publicly viewable by authenticated users.
  - `UPDATE`: `auth.uid() = id OR public.is_admin()`.
- **`projects`:**
  - `SELECT`: Viewable by authenticated users.
  - `INSERT / DELETE`: Admin only (`public.is_admin()`).
  - `UPDATE`: Admin or assigned lead (`public.is_admin() OR lead_id = auth.uid()`).
- **`tasks`:**
  - `SELECT`: Viewable by authenticated users.
  - `INSERT / DELETE`: Admin or assigned lead (`public.is_admin() OR public.is_project_lead(project_id)`).
  - `UPDATE`: Admin, project lead, or task assignee (`auth.uid() = assignee_id`).
- **`notifications`:**
  - `SELECT / UPDATE`: Strict user isolation (`user_id = auth.uid()`).

---

## 🚀 Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/shreyakumari2006/Club-management.git
cd Club-management
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

*(Note: ClubFlow includes built-in offline synchronization, so you can explore the full application immediately even before configuring cloud keys).*

### 4. Apply Database Migrations (Supabase)
In your Supabase SQL Editor, execute:
1. `supabase/migrations/001_initial_schema.sql` (Creates schema, triggers & RLS policies)
2. `supabase/seed.sql` (Loads realistic TechVerse Club sample data)

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied) in your browser.

---

## 🧪 3-Minute Interactive Demo Walkthrough

ClubFlow provides a **Quick Role Switcher** at the bottom of the sidebar for instant role evaluation:

1. **Step 1: Admin Experience (`Alex Rivera`)**
   - View top-level club statistics, active project progress bars, and recent activity logs.
   - Navigate to `/projects`, click **"Create Project"**, and define a new initiative.
   - Navigate to `/teams`, create a squad, and assign members.
2. **Step 2: Project Lead Experience (`Sarah Chen`)**
   - Click **"Lead"** in the sidebar role switcher.
   - Observe the dashboard adapting to **"My Projects"** and lead-specific deliverables.
   - Open `/tasks`, create a task, and assign it to a team member with a target deadline.
3. **Step 3: Member Experience (`Liam Davis`)**
   - Click **"Member"** in the sidebar role switcher.
   - View **"My Assigned Tasks"** and upcoming deadlines.
   - Switch task status from `To Do` to `In Progress` to `Completed` and watch personal/project progress recalculate in real-time.
4. **Step 4: Analytics & Notifications**
   - Open `/analytics` to inspect the Recharts completion rate, status funnel, and squad workload charts.
   - Check the top navigation notification bell to view unread alerts.

---

## 📁 Project Structure

```
Club-management/
├── supabase/
│   ├── migrations/001_initial_schema.sql  # Database schema & RLS policies
│   └── seed.sql                           # TechVerse Club seed dataset
├── src/
│   ├── app/
│   │   ├── (auth)/login & signup/         # Auth pages with 1-click test fill
│   │   ├── (dashboard)/                   # Authenticated routes
│   │   │   ├── dashboard/                 # Role-adaptive Dashboard
│   │   │   ├── projects/                  # Catalog & [id] detail page
│   │   │   ├── tasks/                     # Kanban board & list view
│   │   │   ├── teams/                     # Squad & squad member allocation
│   │   │   ├── members/                   # Directory & role promotion dialog
│   │   │   ├── analytics/                 # Recharts data visualizations
│   │   │   ├── notifications/             # Notification center
│   │   │   ├── settings/                  # RBAC matrix & data reset
│   │   │   └── profile/                   # Personal profile editor
│   │   ├── globals.css                    # Tailwind tokens & dark SaaS theme
│   │   ├── layout.tsx                     # Root layout & providers
│   │   └── page.tsx                       # SaaS Landing page
│   ├── components/
│   │   ├── ui/                            # Button, Badge, Card, Avatar, Dialog, Skeleton, etc.
│   │   ├── layout/                        # Sidebar, TopNav, MobileNav
│   │   ├── dashboard/                     # StatCard, ActivityFeed, UpcomingDeadlines
│   │   ├── projects/                      # ProjectModal, ProjectCard
│   │   ├── tasks/                         # TaskModal, PriorityBadge
│   │   ├── teams/                         # TeamModal, SquadCard
│   │   └── members/                       # RoleModal, MemberTable
│   ├── context/                           # AuthContext, ClubDataContext
│   ├── lib/                               # Supabase client/server/middleware, utils, constants
│   ├── middleware.ts                      # Route protection & session refresh
│   └── types/                             # TypeScript domain models
└── README.md
```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
