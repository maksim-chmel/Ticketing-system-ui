# Ticketing System — Admin Panel UI

React admin interface for managing support tickets. Part of a four-component platform — see [System Overview](#system-overview) below.

---

## System Overview

This project is one of four components that form a complete ticketing platform:

| Repository | Technology | Role |
|---|---|---|
| [ticketing-system-server](https://github.com/maksim-chmel/Ticketing-system-server) | ASP.NET Core 8 | REST API, business logic, database |
| **ticketing-system-ui** ← you are here | React 19 + TypeScript | Admin panel for coordinators |
| [feedback_bot](https://github.com/maksim-chmel/feedback_bot) | Node.js + TypeScript | Telegram bot for end users |
| [alarm_bot](https://github.com/maksim-chmel/alarm_bot) | Node.js + TypeScript | Telegram bot that notifies operators of new tickets |

```
User (Telegram)
     │ creates ticket via feedback_bot
     ▼
PostgreSQL ◄──────────────────────────────────────────────────
     │                                                        │
     ├── alarm_bot polls every 15s → notifies operator       │
     │                                                        │
     └── ticketing-system-server REST API ───────────────────┘
              │
              ▼
     ticketing-system-ui (this repo)
     Coordinators manage tickets, view stats, send broadcasts
```

---

## Features

- **Ticket management** — table with search, filter by status, inline status transitions
- **User list** — view all users, add/edit admin comments inline
- **Statistics dashboard** — Pie chart (status distribution), Bar + Line charts (volume over time)
- **Broadcast** — send a system-wide message to all users via Telegram
- **Auto token refresh** — Axios interceptor silently rotates the token pair on 401; redirects to login if refresh fails
- **Protected routes** — unauthenticated users redirected to `/login`

---

## Tech Stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Routing | React Router v7 |
| HTTP | Axios (with interceptors) |
| Charts | Recharts |
| Styling | Plain CSS |
| Containerization | Docker + Nginx |

---

## Project Structure

```
src/
├── api.ts                    # API functions + shared types/enums
├── axiosInstance.ts          # Axios instance with auth interceptors
├── config.ts                 # Base URL config
├── App.tsx                   # Router setup
└── components/
    ├── LoginPage/            # Auth form
    ├── MainLayout/           # Shell with Navbar + Outlet
    ├── Navbar/               # Navigation + logout
    ├── ProtectedRoute.tsx    # Auth guard
    ├── FeedbackTable/        # Ticket list, filters, status actions
    ├── UserList/             # User table with inline comment editing
    ├── Statistic/            # Dashboard charts
    └── BroadcastForm/        # Broadcast message form
```

---

## Ticket Lifecycle

Status transitions are enforced in the UI — only valid next states are shown:

```
Open → InProgress → WaitingForReply → Closed
                 ↘                  ↘
               Rejected           Rejected
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Running instance of [ticketing-system-server](https://github.com/maksim-chmel/Ticketing-system-server)

### Configuration

Set the backend URL in `src/config.ts`:

```typescript
const BASE_URL = "http://localhost:5101/api";
```

### Run locally

```bash
npm install
npm start
```

### Run with Docker

```bash
docker compose up --build
```

Served by Nginx on port 80 with SPA fallback.

## Backend Repository

[Ticketing System — Admin Panel Backend](https://github.com/maksim-chmel/Ticketing-system-server-main) — ASP.NET Core 8, PostgreSQL, JWT auth, Prometheus metrics.
