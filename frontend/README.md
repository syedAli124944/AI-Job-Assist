Act as a senior software Developer , look at this folder you will find .md file according to this divide into phases and start working on this it will help you when you divide your work into phases and useAct as a senior software Developer , look at this folder you will find .md file according to this divide into phases and start working on this it will help you when you divide your work into phases and use

DIVIDE IN PHASES THEN WORK IT WILL HELP YOU ALOT !!!!
-----------------PROMPT--------------------
Frontend Build Prompt — AI Job Search & Application Assistant
Use this prompt as-is with Claude Code, v0, Cursor, or any AI dev tool to scaffold the frontend. Backend is out of scope — build against mock/dummy data and typed API interfaces only.
Project brief
Build a modern, warm-minimal / boutique styled frontend for an AI Job Search & Application Assistant. The product should feel like a high-end concierge tool — calm, confident, uncluttered — not a generic SaaS dashboard.
Tech stack (required)

* Framework: React 18 + Vite (or Next.js 14 App Router if SSR/routing depth is needed)
* Language: TypeScript
* Styling: Tailwind CSS
* Component library: shadcn/ui (Radix primitives) — use for buttons, cards, dialogs, tabs, dropdowns, toasts, inputs
* Icons: lucide-react (outline style only, consistent stroke width)
* Animation / motion: Framer Motion (`motion/react`) for all transitions, page entrances, hover/tap states, and scroll-linked animation
* Scroll behavior: `react-intersection-observer` or Framer Motion's `useInView` for scroll-triggered reveals; Lenis (`@studio-freight/lenis`) for smooth/inertia scrolling on the landing page
* State management: Zustand (lightweight, for UI state) + TanStack Query (React Query) for async/data-fetching state (mocked)
* Forms: React Hook Form + Zod validation
* Routing: React Router v6 (or Next.js routing)
* Fonts: Google Fonts — `Fraunces` (serif, for headings/emphasis) + `Inter` (sans, for body/UI)
* Video/hero media: native `<video>` with poster fallback, lazy-loaded, muted/autoplay/loop for hero background

Design system — "Warm minimal / boutique"
Color palette

```
--sand:        #EDE6DA   (page background)
--cream:       #FAF6F0   (card background)
--charcoal:    #2B241E   (primary text)
--warm-gray:   #8A7F72   (secondary text)
--terracotta:  #B5654A   (primary accent / CTAs)
--terracotta-dark: #954F39 (hover state)
--deep-green:  #3C5B42   (secondary accent / success, match scores)
--border:      #E0D5C5   (hairline borders)

```

Typography

* Headings: `Fraunces`, weight 500–600, large confident sizes (h1: 48–64px, h2: 32–40px)
* Body/UI: `Inter`, weight 400–500, 15–16px, line-height 1.6
* Sentence case everywhere, no ALL CAPS except small eyebrow labels

Shape & elevation

* Border radius: 16–20px on cards, 12px on buttons/inputs
* Shadows: soft and minimal (`shadow-sm`/`shadow-md` only, no harsh drop shadows)
* No gradients except one subtle warm gradient allowed in the hero background only

Spacing

* Generous whitespace, 8px base spacing scale, section padding 96–140px vertical on desktop

Detailed page specifications
Build against these exact routes, components, and mock API contracts for each screen.
1. Auth screen — `/auth/login`, `/auth/register`, `/auth/forgot-password`

* Purpose: user entry point
* Features: login, sign up, JWT authentication, session management, forgot password
* Components: `LoginForm`, `RegisterForm`, `AuthLayout`, `ProtectedRoute`
* Output: user receives JWT token, redirected to onboarding

2. Onboarding — `/onboarding`

* Features: upload CV/resume, set preferences (location, job type, salary range, skills)
* Components: `ResumeUploader`, `SkillsSelector`, `PreferenceForm`
* API calls (mock): `POST /resume/upload`, `POST /profile/preferences`
* Output: user profile created, dashboard personalized

3. Dashboard — `/dashboard`

* Features: user statistics, recent applications, profile completion, recommended jobs
* Components: `StatsCards`, `RecentActivity`, `JobRecommendations`, `ProfileSummary`
* Output: quick overview of account activity

4. Job search — `/jobs`

* Features: search bar, filters (location, experience, salary, remote/on-site, job type), live results, pagination
* Components: `SearchBar`, `FilterPanel`, `JobCard`, `JobList`
* API calls (mock): `GET /jobs`, `GET /jobs/search`

5. Job detail view — `/jobs/:id`

* Features: job description, company details, match score, apply button
* Components: `JobDetails`, `MatchScore`, `CompanyInfo`, `ApplyButton`
* AI integration: resume ↔ job description matching algorithm
* Output: user evaluates suitability before applying

6. Cover letter editor — `/cover-letter/:jobId`

* Features: generate draft, edit content, save versions, approve final version
* Components: `Editor`, `AIAssistant`, `PreviewPanel`
* Workflow: Job + Resume → AI draft → user edit → approve

7. Application tracker — `/applications`

* Features: kanban board, status updates, drag and drop
* Statuses: Applied, Interview, Assessment, Offer, Rejected

8. Notifications — `/notifications`

* Features: interview reminders, follow-up reminders, application updates, email notifications
* Components: `NotificationList`, `ReminderSettings`, `NotificationBadge`

Shared UI layer (used across all screens)
Design system — reusable UI components in `components/ui/`: `Button`, `Input`, `Select`, `Modal`, `Card`, `Table`, `Avatar`, `Toast`
State management

* Zustand — global client state (UI state, selected filters, modal state)
* TanStack Query — server state / caching for: user, jobs, applications, notifications, settings

API client

* Axios — HTTP client, base URL `https://api.yourapp.com` (mock/env-swappable)
* JWT interceptor — attaches token to every outgoing request
* Refresh token interceptor — auto-refreshes session on a 401 response

Pages / screens to build
1. Animated welcome / landing page (priority)

* Hero section: full-viewport height, warm gradient or short looped background video (see "Hero video direction" below) with a subtle dark overlay for text contrast
* Left-to-right entrance animation: headline, subheadline, and CTA buttons should animate in staggered from left to right (e.g. `x: -40 → 0`, `opacity: 0 → 1`, staggerChildren ~0.15s) using Framer Motion on mount
* Primary CTA button ("Get started") + secondary ghost button ("See how it works"), both shadcn `Button` components styled with the terracotta accent
* Scroll-cue indicator (animated chevron or line) at bottom of hero
* Feature section: 3–4 cards (icon + short text) revealing on scroll with fade-up + slight left-to-right stagger as they enter viewport
* How it works section: horizontal step cards (Upload CV → Set preferences → Get matched → Apply) connected by an animated progress line that fills as user scrolls
* Social proof / stats strip: animated counting numbers (e.g. "10,000+ jobs matched") using a count-up-on-scroll effect
* Footer CTA: repeat primary CTA with a soft card background

2. Auth screens

* Login / Signup as shadcn `Card` centered on a soft sand background, minimal form fields, subtle entrance animation (fade + scale 0.98 → 1)

3. Onboarding flow

* Multi-step wizard (shadcn `Tabs` or custom stepper) — CV upload (drag & drop with animated dropzone), preferences form, review step
* Step transitions animate horizontally (slide left/right) like a native app

4. Dashboard

* Stat cards (Applied, In Review, Interviews, Offers) — animate numbers counting up on load
* Recent activity list + upcoming reminders card
* Sidebar or top nav using shadcn `NavigationMenu`

5. Job search

* Filter sidebar (role, location, experience) using shadcn `Select`/`Checkbox`
* Job result cards with match-score badge (deep green), hover lift animation (`scale: 1.02`, shadow increase)
* Skeleton loading states while "fetching" (shadcn `Skeleton`)

6. Job detail view

* Match score shown as an animated radial/progress ring
* Sticky "Apply" button on scroll

7. Cover letter editor

* Split view: AI-generated draft (editable textarea) + live preview card
* "Regenerate" button with a subtle loading spinner animation

8. Application tracker

* Kanban board (Applied / Interview / Offer / Rejected) with drag-and-drop (`@dnd-kit/core`)
* Cards animate position changes smoothly (`layout` prop in Framer Motion)

9. Notifications

* Dropdown panel (shadcn `Popover`) with list items, unread indicator dot, slide/fade-in animation

Motion design guidelines

* Use Framer Motion `AnimatePresence` for all route/page transitions (fade + slight vertical shift, 200–300ms)
* Stagger children animations for lists/grids (`staggerChildren: 0.08–0.15`)
* Hover states: subtle scale (1.02–1.03) and shadow increase on cards; color shift on buttons
* Respect `prefers-reduced-motion` — provide a reduced-motion fallback (instant appearance, no transforms)
* Easing: prefer `easeOut` for entrances, `easeInOut` for looping/ambient motion
* Keep animation durations short (150–400ms) except ambient/looping background effects

Hero video direction
Since this is a job-search / career product, the hero background video/loop should feel calm, aspirational, and professional — not stocky or corporate-cold. Suggested directions (source from a stock library like Pexels/Coverr, or generate abstract motion graphics):

* Soft, slow-motion footage of someone reviewing documents/laptop in warm natural light, shallow depth of field
* Abstract warm-toned motion graphics: slowly drifting soft shapes/particles in terracotta/sand tones (safer, no likeness/rights issues, easy to loop seamlessly)
* Alternative: a subtle animated SVG/Lottie illustration (floating cards, a CV transforming into a checkmark) instead of real video — lighter weight and fully on-brand
* Keep it muted, looping, under 8MB, with a static poster image fallback for slow connections and reduced-motion users

Scroll behavior

* Smooth inertia scrolling on the landing page only (Lenis), disabled on app/dashboard screens for standard native scroll feel
* Scroll-triggered reveals (fade-up, left-to-right stagger) for every section below the hero using `useInView`
* Sticky nav bar that shrinks/condenses after scrolling past hero (height + shadow transition)
* Parallax is optional and subtle only (max 10–20% offset) — never disorienting

Accessibility & responsiveness

* Fully responsive: mobile-first breakpoints, stepper/kanban collapse to vertical stacks on mobile
* All interactive elements keyboard-navigable, visible focus states in terracotta
* Color contrast meets WCAG AA against sand/cream backgrounds
* All animations wrapped to respect `prefers-reduced-motion`

Deliverable structure

```
/src
  /components/ui        → shadcn components
  /components/shared     → Navbar, Footer, StatCard, JobCard, etc.
  /features/landing
  /features/auth
  /features/onboarding
  /features/dashboard
  /features/job-search
  /features/job-detail
  /features/cover-letter
  /features/tracker
  /features/notifications
  /lib                   → utils, mock API (axios instance + JWT/refresh interceptors), zod schemas
  /store                 → zustand stores (ui state, filters, modals)
  /queries                → TanStack Query hooks (useJobs, useApplications, useNotifications, useUser, useSettings)
  /styles                → tailwind config, fonts

```

Route map

```
/auth/login  /auth/register  /auth/forgot-password
/onboarding
/dashboard
/jobs
/jobs/:id
/cover-letter/:jobId
/applications
/notifications

```

Build with clean, typed, componentized code. Use mock data/fixtures for all API-dependent content — no backend calls.