# Ticketing System UI

Admin panel for coordinators in the Ticketing System platform. The application is built as a React SPA and works with the existing ASP.NET Core backend without changing its API contracts.

## Overview

This repository is the web interface for ticket processing, operator workflows, user notes, statistics and Telegram broadcast messages.

Platform components:

| Repository | Technology | Purpose |
| --- | --- | --- |
| [ticketing-system-server](https://github.com/maksim-chmel/Ticketing-system-server) | ASP.NET Core 8 | REST API, auth, business logic, database access |
| `ticketing-system-ui` | React 19 + TypeScript | Admin panel for coordinators |
| [feedback_bot](https://github.com/maksim-chmel/feedback_bot) | Node.js + TypeScript | Telegram entry point for end users |
| [alarm_bot](https://github.com/maksim-chmel/alarm_bot) | Node.js + TypeScript | Telegram notifications for operators |

High-level flow:

```text
Telegram user
   -> feedback_bot
   -> backend API
   -> PostgreSQL
   -> ticketing-system-ui

alarm_bot polls backend and notifies operators about new tickets.
```

## Main Features

- ticket list with search, status filters and inline status transitions
- user directory with editable internal comments
- statistics dashboard with charts based on backend aggregates
- broadcast form for sending messages to users
- protected routes and centralized auth state
- automatic access token refresh using the existing backend refresh endpoint
- standardized error handling with retry states and app-level error boundary

## Stack

| Area | Technology |
| --- | --- |
| UI | React 19 |
| Language | TypeScript |
| Routing | React Router DOM v7 |
| HTTP | Axios |
| Charts | Recharts |
| Styling | Plain CSS |
| Build | react-scripts |
| Containerization | Docker + Nginx |
| Tests | React Testing Library + Jest |

## Current Architecture

The project was recently refactored to reduce component complexity and keep the backend API unchanged.

Key layers:

```text
src/
├── api.ts                    # compatibility barrel, re-exports all API modules
├── services/api/             # domain API modules
│   ├── auth.ts
│   ├── feedback.ts
│   ├── users.ts
│   ├── statistics.ts
│   ├── broadcast.ts
│   ├── operator.ts
│   └── types.ts
├── hooks/                    # feature-level state and data loading hooks
│   ├── useFeedbackTable.ts
│   ├── useUserList.ts
│   ├── useStatisticsData.ts
│   └── useBroadcastForm.ts
├── auth/                     # auth context and auth tests
├── components/               # UI components and pages
└── axiosInstance.ts          # axios instance and refresh-token logic
```

The `src/api.ts` file still exists as a stable import point, so older imports continue to work.

## Authentication

The frontend keeps compatibility with the current backend auth API:

- `POST /Auth/login`
- `POST /Auth/refresh`

Frontend auth behavior:

- `AuthProvider` restores session on app bootstrap using the refresh endpoint
- protected routes wait for auth bootstrap before redirecting
- access token is attached through the shared axios instance
- failed refresh clears local auth state and redirects to `/login`

Important note:

- logout is still frontend-only unless the backend exposes a dedicated logout endpoint

## Ticket Lifecycle

Status transitions exposed by the UI:

```text
Open -> InProgress -> WaitingForReply -> Closed
             \                    \
              -> Rejected          -> Rejected
```

## Error Handling

The app now uses a shared error model:

- `AppNotice` for local success/error/info messages
- `PageState` for loading and retryable page-level states
- `AppErrorBoundary` for unexpected render failures
- `getErrorMessage()` to normalize backend error payloads

## Tests

Critical scenarios currently covered:

- auth login flow
- auth refresh bootstrap
- redirect to `/login` when auth restore fails
- ticket search
- ticket status transition
- retry after failed ticket load
- broadcast form submit and validation

Useful commands:

```bash
npm run test:once
npm run test:critical
```

If `node` is not installed locally, tests can also be run in Docker.

## Local Development

### Prerequisites

- Node.js 18+ or 20+
- npm
- running backend instance

### Configuration

Backend base URL is configured through `REACT_APP_API_URL`.

Example:

```bash
REACT_APP_API_URL=http://localhost:5101/api
```

You can place it in `.env`:

```bash
REACT_APP_API_URL=http://localhost:5101/api
```

Important:

- `.env` is intentionally not committed; keep your local secrets there.

Fallback value in code is:

```text
http://localhost:5101/api
```

### Install

```bash
npm install
```

### Start

```bash
npm start
```

### Build

```bash
npm run build
```

### Test

Run all tests once:

```bash
npm run test:once
```

Run only critical scenarios:

```bash
npm run test:critical
```

## Docker

Build and run the frontend:

```bash
docker compose up --build
```

The app is exposed on:

```text
http://localhost:3000
```

Stop containers:

```bash
docker compose down
```

## Notes

- `docker-compose.yml` currently still contains the old `version` field; Docker ignores it, but it can be removed later
- the project still uses `react-scripts`, so a future migration to Vite would be a reasonable technical improvement
- backend API contracts were intentionally preserved during refactoring

## Backend

Backend repository:

[Ticketing System Backend](https://github.com/maksim-chmel/Ticketing-system-server)
