# Libro de los Juegos

A medieval-themed web app for playing medieval table games online with friends. The project takes its name and inspiration from the 13th-century Spanish *Libro de los Juegos* (Book of Games), which documented popular table games of the period.

Create a free account, add friends, join lobbies, and play multiplayer games in real time.

## Features

- **User accounts** — Sign up, log in, and manage a profile with customizable icons and stats
- **Game lobby** — Create tables, invite friends, and start matches when the lobby owner is ready
- **Real-time play** — Live game state and lobby updates over Socket.IO
- **Friends & invites** — Send and accept friend requests and game invitations from the profile menu
- **Doblet** — Play the medieval backgammon variant *Doblet* (more games planned)
- **About & gallery** — Learn about the project’s medieval theme with an image slideshow

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React 19, React Router 7, Vite 7 |
| Real-time | Socket.IO client |
| Styling | CSS (custom medieval theme, Tangerine font) |
| UI | react-icons, react-spinners, react-toastify |
| Backend (separate repo) | Node.js, Express, MongoDB, Socket.IO — [libro-de-los-juegos-server](https://github.com/DanielRJilek/libro-de-los-juegos-server) |

Production API: `https://libro-de-los-juegos.onrender.com`

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm
- For local full-stack development: a running instance of [libro-de-los-juegos-server](https://github.com/DanielRJilek/libro-de-los-juegos-server) (default port `10000`) with MongoDB configured per that repo’s setup

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/DanielRJilek/libro-de-los-juegos.git
cd libro-de-los-juegos
npm install
```

### 2. Environment

Development uses `.env.development`:

```env
VITE_API_URL=http://localhost:10000
```

Production builds use `.env.production`, which points at the hosted API on Render. Override `VITE_API_URL` if you run the backend elsewhere.

### 3. Run the backend (local)

In a separate terminal, from the server repository:

```bash
cd ../libro-de-los-juegos-server   # or your clone path
npm install
npm start
```

The API should be available at `http://localhost:10000`.

### 4. Run the frontend

```bash
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

### Build for production

```bash
npm run build
npm run preview   # optional: serve the production build locally
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── components/     # Reusable UI (Board, Dice, Header, GameCard, etc.)
├── context/        # Auth and user state (JWT in localStorage)
├── hooks/          # Shared React hooks
├── routing/        # Route definitions and protected routes
├── views/          # Page-level screens (Welcome, Lobby, Doblet, Profile, …)
├── socket.js       # Socket.IO client and event name constants
├── App.jsx         # Router, providers, toasts, socket session
└── main.jsx        # Entry point
```

Protected routes (lobbies, gameplay, profile) require a valid access token.

## Routes (overview)

| Path | Description |
|------|-------------|
| `/` | Welcome / landing |
| `/games` | Game selection gallery |
| `/games/:title` | Lobby list for a game |
| `/games/:title/table/:instance` | Specific lobby |
| `/games/:title/table/:instance/play` | Active game (e.g. Doblet) |
| `/login`, `/signup` | Authentication |
| `/about` | About the project |
| `/music` | Music page |
| `/profile/:instance` | User profile (view / edit) |

## Related repositories

- **Frontend (this repo):** [DanielRJilek/libro-de-los-juegos](https://github.com/DanielRJilek/libro-de-los-juegos)
- **Backend API:** [DanielRJilek/libro-de-los-juegos-server](https://github.com/DanielRJilek/libro-de-los-juegos-server)
