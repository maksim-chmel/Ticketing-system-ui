# Ticketing System — Admin Panel UI

React-based admin interface for the [Ticketing System backend](https://github.com/maksim-chmel/Ticketing-system-server-main). Provides ticket management, user administration, statistics dashboards, and broadcast messaging — all behind JWT authentication.

---

## Features

- **Login page** — authenticates against the backend, stores access token; refresh token handled automatically via HttpOnly cookie
- **Ticket management** — table view with search (by ID, name, phone), filter by status, inline status transitions, full comment modal on click
- **User list** — view all users, add/edit admin comments per user with inline editing
- **Statistics** — Pie chart (status distribution), Bar chart (tickets per day), Line chart (volume over time) — all powered by Recharts
- **Broadcast** — send a system-wide message to all users
- **Auto token refresh** — Axios interceptor catches 401 responses and silently rotates the token pair; redirects to login if refresh fails
- **Protected routes** — unauthenticated users are redirected to `/login`

---

## Tech Stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Routing | React Router v7 |
| HTTP | Axios (with interceptors) |
| Charts | Recharts |
| Styling | Plain CSS (no UI library) |
| Containerization | Docker + Nginx |

---

## Project Structure

```
src/
├── api.ts                        # API functions + shared types/enums
├── axiosInstance.ts              # Axios instance with auth interceptors
├── config.ts                     # Base URL config
├── App.tsx                       # Router setup
└── components/
    ├── LoginPage/                # Auth form
    ├── MainLayout/               # Shell with Navbar + Outlet
    ├── Navbar/                   # Navigation + logout
    ├── ProtectedRoute.tsx        # Auth guard
    ├── FeedbackTable/            # Ticket list, filters, status actions
    ├── UserList/                 # User table with inline comment editing
    ├── Statistic/                # Dashboard with three charts
    └── BroadcastForm/            # Broadcast message form
```

---

## Pages & Routes

| Route | Component | Auth |
|---|---|---|
| `/login` | LoginPage | Public |
| `/feedback` | FeedbackTable | Protected |
| `/stats` | StatisticsPage | Protected |
| `/users` | UserList | Protected |
| `/broadcast` | BroadcastForm | Protected |

---

## Ticket Lifecycle

Status transitions are enforced in the UI — only valid next states are shown as action buttons:

```
Open → InProgress → WaitingForReply → Closed
                 ↘                  ↘
               Rejected           Rejected
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Running instance of the [backend](https://github.com/maksim-chmel/Ticketing-system-server-main)

### Local development

```bash
npm install
npm start
```

The app runs at `http://localhost:3000`. Backend URL is configured in `src/config.ts`.

### Run with Docker

```bash
docker compose up --build
```

Served by Nginx on port 80 with SPA fallback (`try_files $uri /index.html`).

---

## Backend Repository

[Ticketing System — Admin Panel Backend](https://github.com/maksim-chmel/Ticketing-system-server-main) — ASP.NET Core 8, PostgreSQL, JWT auth, Prometheus metrics.
