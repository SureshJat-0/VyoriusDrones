# WebSocket Kanban Board

Real-time Kanban board built with React + Socket.IO.

## Demo Features

- Create tasks with title, priority, category, and optional attachment.
- Move tasks across **To Do**, **In Progress**, and **Done** using drag-and-drop.
- Delete tasks from the board.
- Sync board updates across connected clients in real time via WebSockets.
- Preview image attachments in cards and open non-image files (e.g. PDF) via link.
- Test coverage using Vitest (unit/integration) and Playwright (E2E).

## Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS v4
- `@dnd-kit/core` + `@dnd-kit/sortable`
- `socket.io-client`
- Vitest + React Testing Library
- Playwright

### Backend
- Node.js + Express
- Socket.IO
- In-memory task store

## Project Structure

```text
.
├── backend
│   ├── package.json
│   └── server.js
├── frontend
│   ├── package.json
│   ├── playwright.config.js
│   └── src
│       ├── components
│       ├── tests
│       │   ├── unit
│       │   ├── integration
│       │   └── e2e
│       └── utils
└── README.md
```

## WebSocket Events

| Event | Direction | Purpose |
|------|-----------|---------|
| `sync:tasks` | server → client | Send all existing tasks on connect |
| `task:create` | client → server | Create a new task |
| `task:created` | server → clients | Broadcast created task |
| `task:delete` | client → server | Delete a task by id |
| `task:deleted` | server → clients | Broadcast deleted task id |
| `task:move` | client → server | Move task to another status |
| `task:moved` | server → clients | Broadcast moved task |
| `task:update` | client → server | Update task fields |
| `task:updated` | server → clients | Broadcast updated task |

## Local Setup

### Prerequisites
- Node.js 18+
- npm

### 1) Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2) (Optional) Backend environment

Create `backend/.env`:

```env
PORT=8000
```

### 3) Run backend

```bash
cd backend
npm run dev
```

### 4) Run frontend

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:3000` and connects to backend on `http://localhost:8000`.

## Testing

Run from `frontend` directory:

```bash
# Unit + integration tests
npm test

# E2E tests (Playwright)
npm run test:e2e
```

> Keep backend running while executing tests that rely on WebSocket behavior.

## Scripts

### Backend (`backend/package.json`)
- `npm run dev` – start server with nodemon
- `npm start` – start server with node

### Frontend (`frontend/package.json`)
- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview production build
- `npm run lint` – run ESLint
- `npm test` – run Vitest suite
- `npm run test:e2e` – run Playwright E2E tests

## Notes / Limitations

- Task data is currently stored in memory on the backend (resets on server restart).
- File uploads are handled on the client side for preview/link behavior.
- No authentication/authorization is included in this assignment scope.

## Author

Submitted by **Suresh Jat** as an internship assignment for Vyorius Drones Private Limited.
