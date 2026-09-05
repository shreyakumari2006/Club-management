-- ==============================================================================
-- ClubFlow: Seed Data for "TechVerse Club"
-- ==============================================================================

-- 1. PROFILES SEED (Demo UUIDs)
-- In a real Supabase setup, these map to auth.users. 
-- The client also bundles built-in local state synchronization so the app works seamlessly both online and offline.

INSERT INTO public.profiles (id, email, full_name, role, department, year, bio, avatar_url)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'admin@clubflow.org', 'Alex Rivera', 'ADMIN', 'Computer Science & Engineering', 'Senior', 'President of TechVerse Club. Passionate about distributed systems, UI engineering, and mentoring.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
    ('22222222-2222-2222-2222-222222222222', 'sarah@clubflow.org', 'Sarah Chen', 'PROJECT_LEAD', 'Software Engineering', 'Junior', 'Tech Lead for Club Website & Hackathon. Loves Next.js, TypeScript, and developer experience.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'),
    ('33333333-3333-3333-3333-333333333333', 'marcus@clubflow.org', 'Marcus Vance', 'PROJECT_LEAD', 'Artificial Intelligence', 'Senior', 'AI Workshop Coordinator & Lead Researcher. Specializes in LLM agents and computer vision.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
    ('44444444-4444-4444-4444-444444444444', 'liam@clubflow.org', 'Liam Davis', 'MEMBER', 'Computer Science', 'Sophomore', 'Frontend contributor on Club Website Revamp. Excited about Tailwind CSS and responsive design.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'),
    ('55555555-5555-5555-5555-555555555555', 'maya@clubflow.org', 'Maya Patel', 'MEMBER', 'UI/UX Design', 'Junior', 'Lead Designer for Hackathon 2026 and brand assets. Passionate about micro-interactions and Figma.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'),
    ('66666666-6666-6666-6666-666666666666', 'chloe@clubflow.org', 'Chloe Kim', 'MEMBER', 'Data Science', 'Sophomore', 'Data analyst & AI workshop co-facilitator. Working on dataset pipelines and workshop notebooks.', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80'),
    ('77777777-7777-7777-7777-777777777777', 'jordan@clubflow.org', 'Jordan Lee', 'MEMBER', 'Information Systems', 'Freshman', 'Events coordinator & logistics lead for TechVerse Hackathon 2026.', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO UPDATE 
SET email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;

-- 2. PROJECTS SEED
INSERT INTO public.projects (id, name, description, status, lead_id, start_date, deadline, created_by)
VALUES
    ('a1111111-1111-1111-1111-111111111111', 'Club Website Revamp', 'Redesigning the TechVerse public website and internal portal with modern Next.js 14 architecture, interactive event schedules, and automated member onboarding.', 'Active', '22222222-2222-2222-2222-222222222222', '2026-08-01', '2026-09-25', '11111111-1111-1111-1111-111111111111'),
    ('a2222222-2222-2222-2222-222222222222', 'AI Workshop Series 2026', 'A 4-week hands-on deep dive into modern LLM application development, RAG pipelines, and edge deployment for 250+ campus students.', 'Active', '33333333-3333-3333-3333-333333333333', '2026-08-15', '2026-10-10', '11111111-1111-1111-1111-111111111111'),
    ('a3333333-3333-3333-3333-333333333333', 'TechVerse Hackathon 2026', 'Annual 36-hour flagship inter-collegiate hackathon with 600+ participants, industry sponsors, and $15,000 prize pool.', 'Planning', '22222222-2222-2222-2222-222222222222', '2026-09-01', '2026-11-20', '11111111-1111-1111-1111-111111111111'),
    ('a4444444-4444-4444-4444-444444444444', 'Annual Recruitment Drive', 'Fall semester member orientation, interview rounds, skills assessment workshops, and team allocations.', 'Completed', '11111111-1111-1111-1111-111111111111', '2026-07-15', '2026-08-28', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- 3. TEAMS SEED
INSERT INTO public.teams (id, name, description, project_id, lead_id)
VALUES
    ('b1111111-1111-1111-1111-111111111111', 'Web Development Team', 'Engineers building full-stack applications, API integrations, and the club portal.', 'a1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'),
    ('b2222222-2222-2222-2222-222222222222', 'AI & Research Team', 'Researchers and ML practitioners crafting notebooks, datasets, and workshops.', 'a2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333'),
    ('b3333333-3333-3333-3333-333333333333', 'Design & Branding Team', 'Product designers, UI/UX creators, and brand identity managers.', 'a3333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555'),
    ('b4444444-4444-4444-4444-444444444444', 'Events & Logistics Team', 'Organizers managing venue booking, catering, sponsor communication, and attendee ops.', 'a3333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777')
ON CONFLICT (id) DO NOTHING;

-- 4. TEAM MEMBERS SEED
INSERT INTO public.team_members (team_id, user_id)
VALUES
    ('b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'), -- Sarah (Lead)
    ('b1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444'), -- Liam
    ('b2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333'), -- Marcus (Lead)
    ('b2222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666'), -- Chloe
    ('b3333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555'), -- Maya (Lead)
    ('b3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444'), -- Liam
    ('b4444444-4444-4444-4444-444444444444', '77777777-7777-7777-7777-777777777777'), -- Jordan
    ('b4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111')  -- Alex
ON CONFLICT DO NOTHING;

-- 5. TASKS SEED
INSERT INTO public.tasks (id, title, description, project_id, assignee_id, priority, status, deadline, created_by)
VALUES
    -- Project: Club Website Revamp
    ('c1111111-1111-1111-1111-111111111111', 'Implement Responsive Auth Flow & Role Guard', 'Build Supabase authentication forms, JWT cookie middleware, and role switcher for demo evaluation.', 'a1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Urgent', 'Completed', NOW() + INTERVAL '2 days', '22222222-2222-2222-2222-222222222222'),
    ('c2222222-2222-2222-2222-222222222222', 'Design Interactive Kanban Board Component', 'Create drag/status switch columns for To Do, In Progress, and Completed with overdue badges.', 'a1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'High', 'In Progress', NOW() + INTERVAL '4 days', '22222222-2222-2222-2222-222222222222'),
    ('c3333333-3333-3333-3333-333333333333', 'Build Realtime Notifications Bell Popover', 'Implement live unread counter badge, category icons, and mark-as-read handlers.', 'a1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Medium', 'In Progress', NOW() + INTERVAL '5 days', '11111111-1111-1111-1111-111111111111'),
    ('c4444444-4444-4444-4444-444444444444', 'Configure Production SEO & OpenGraph Meta', 'Add dynamic title templates, sitemap.xml generation, and social preview cards.', 'a1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Low', 'To Do', NOW() + INTERVAL '10 days', '22222222-2222-2222-2222-222222222222'),

    -- Project: AI Workshop Series 2026
    ('c5555555-5555-5555-5555-555555555555', 'Prepare Kaggle / Colab Starter Notebooks', 'Draft structured Jupyter notebooks with LangChain, embeddings, and vector database examples.', 'a2222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', 'High', 'Completed', NOW() + INTERVAL '1 day', '33333333-3333-3333-3333-333333333333'),
    ('c6666666-6666-6666-6666-666666666666', 'Record Promotional Teaser Video & Slides', 'Produce 60-second teaser showcasing workshop hands-on projects and certificate rewards.', 'a2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Medium', 'In Progress', NOW() + INTERVAL '3 days', '33333333-3333-3333-3333-333333333333'),
    ('c7777777-7777-7777-7777-777777777777', 'Benchmark Free Tier GPU Quotas for Attendees', 'Test Google Colab T4 and Kaggle P100 limits for 250 concurrent student runs.', 'a2222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', 'Urgent', 'To Do', NOW() + INTERVAL '6 days', '33333333-3333-3333-3333-333333333333'),

    -- Project: TechVerse Hackathon 2026
    ('c8888888-8888-8888-8888-888888888888', 'Finalize Hackathon Sponsor Deck & Tiers', 'Design 8-page sponsor prospectus including Platinum ($5k), Gold ($2.5k), and Silver ($1k) tiers.', 'a3333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'High', 'In Progress', NOW() + INTERVAL '7 days', '11111111-1111-1111-1111-111111111111'),
    ('c9999999-9999-9999-9999-999999999999', 'Book Campus Auditorium & Networking Lounge', 'Submit room reservation request to university facilities committee and confirm A/V gear.', 'a3333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', 'Urgent', 'In Progress', NOW() + INTERVAL '2 days', '22222222-2222-2222-2222-222222222222'),
    ('caaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Launch Registration Portal & Devpost Page', 'Connect custom domain, setup registration ticket limit, and configure Discord webhook.', 'a3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Medium', 'To Do', NOW() + INTERVAL '14 days', '11111111-1111-1111-1111-111111111111'),

    -- Project: Annual Recruitment Drive
    ('cbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Conduct Final Round Interviews for Web & AI', 'Evaluate 45 shortlisted candidates across technical and cultural fit interviews.', 'a4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'High', 'Completed', NOW() - INTERVAL '5 days', '11111111-1111-1111-1111-111111111111'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Send Welcome Orientation Packets & Discord Roles', 'Onboard 18 accepted new members and assign them to respective sub-teams.', 'a4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Medium', 'Completed', NOW() - INTERVAL '2 days', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- 6. NOTIFICATIONS SEED
INSERT INTO public.notifications (id, user_id, title, message, type, link, is_read, created_at)
VALUES
    ('d1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'New Task Assigned', 'Sarah Chen assigned you "Design Interactive Kanban Board Component".', 'TASK_ASSIGNED', '/tasks', false, NOW() - INTERVAL '2 hours'),
    ('d2222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'Deadline Approaching', 'Task "Implement Responsive Auth Flow" is due in 48 hours.', 'DEADLINE_APPROACHING', '/tasks', false, NOW() - INTERVAL '5 hours'),
    ('d3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Project Milestone Reached', 'Club Website Revamp reached 75% completion milestone.', 'PROJECT_UPDATE', '/projects/a1111111-1111-1111-1111-111111111111', false, NOW() - INTERVAL '1 day'),
    ('d4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'New Team Formed', 'Design & Branding Team created and assigned to Hackathon 2026.', 'TEAM_ADDED', '/teams', true, NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- 7. ACTIVITY LOGS SEED
INSERT INTO public.activity_logs (user_id, project_id, action, entity_type, entity_id, metadata, created_at)
VALUES
    ('44444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111', 'completed task "Implement Responsive Auth Flow & Role Guard"', 'TASK', 'c1111111-1111-1111-1111-111111111111', '{"status": "Completed"}'::jsonb, NOW() - INTERVAL '1 hour'),
    ('22222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'created task "Design Interactive Kanban Board Component"', 'TASK', 'c2222222-2222-2222-2222-222222222222', '{"priority": "High"}'::jsonb, NOW() - INTERVAL '4 hours'),
    ('33333333-3333-3333-3333-333333333333', 'a2222222-2222-2222-2222-222222222222', 'updated project deadline to Oct 10, 2026', 'PROJECT', 'a2222222-2222-2222-2222-222222222222', '{"deadline": "2026-10-10"}'::jsonb, NOW() - INTERVAL '1 day'),
    ('11111111-1111-1111-1111-111111111111', 'a3333333-3333-3333-3333-333333333333', 'created project "TechVerse Hackathon 2026"', 'PROJECT', 'a3333333-3333-3333-3333-333333333333', '{"lead": "Sarah Chen"}'::jsonb, NOW() - INTERVAL '3 days');
