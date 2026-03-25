<img width="1517" height="467" alt="image" src="https://github.com/user-attachments/assets/0ea08b05-0922-4b48-b972-3959fa57de29" />


# Statify

An application that connects to the Spotify Web API to display your top artists, tracks, and genres across different time ranges and generates personalised track recommendations.

Built as a portfolio project to demonstrate OAuth 2.0 implementation, REST API design, and modern React architecture.

## ⚠️ A Note on Spotify API Deprecations
In November 2024, Spotify silently deprecated several of the most useful endpoints for projects like this one including Audio Features, Audio Analysis, Related Artists, and Recommendations. 
If you're exploring this project and want to extend it with audio analysis or mood features, the Spotify API is no longer the right tool for that. Some directions worth investigating:

- **ReccoBeats** : free audio feature extraction API; accepts audio file uploads and returns energy, valence, danceability, tempo etc. Works well if you can source audio files independently.
- **Last.fm API** : free, no audio features but rich metadata: play counts, tags, similar artists, artist bios. Good for social and discovery features.
- **AcousticBrainz** : officially discontinued but still queryable; uses MusicBrainz IDs rather than Spotify IDs so requires a lookup step.
Local audio analysis :libraries like essentia.js (WebAssembly port of a professional audio analysis library) can run in the browser or Node.js directly on audio files if you have access to them.

The architecture of this project (decoupled React frontend + Express REST API) is intentionally set up to make swapping or adding data sources straightforward.

## Features

- **Spotify OAuth 2.0 Authorization Code Flow** - secure login with token exchange handled entirely server-side
- **Session-based authentication** - access tokens stored in server-side sessions, never exposed to the browser
- **Automatic token refresh** - expired tokens are silently refreshed without interrupting the user
- **Dashboard** - top artists and tracks across three time ranges (4 weeks, 6 months, all time)
- **Genre insights** - top genres derived from listening history
- **Track recommendations** - Spotify-powered recommendations seeded from your liked tracks (deprecated)
- **Parallel API requests** - all Spotify calls on the dashboard run concurrently via `Promise.all`

<img width="1087" height="887" alt="image" src="https://github.com/user-attachments/assets/9c9291af-c121-42a0-af84-e704b2451f77" />


## Tech Stack

### Frontend
- **React 18** with Vite
- **React Router v6** - client-side routing with protected routes
- **CSS Modules** - scoped component styling, no CSS-in-JS dependency
- Custom design system with CSS variables

### Backend
- **Node.js** with **Express**
- **express-session** - server-side session management
- **dotenv** - environment variable management
- **node-fetch** - HTTP requests to the Spotify Web API
- RESTful API design with separated route and middleware layers


## Architecture

```
├── backend/                   # Express REST API
│   ├── server.js              # App entry point, middleware config
│   ├── middleware/
│   │   └── auth.js            # requireAuth middleware
│   └── routes/
│       ├── auth.js            # OAuth flow: /login /callback /logout /status /refresh
│       └── spotify.js         # Spotify data: /dashboard /recommendations
│
└── frontend/                  # React SPA (Vite)
    └── src/
        ├── App.jsx            # Router + auth guard
        ├── api/
        │   └── spotify.js     # All fetch calls, auto token refresh logic
        ├── pages/
        │   ├── Home.jsx
        │   ├── Dashboard.jsx
        │   └── Recommendations.jsx
        └── components/
            ├── Navbar.jsx
            ├── ArtistList.jsx
            ├── TrackTable.jsx
            └── TimeRangeTabs.jsx
```

The frontend and backend are fully decoupled. The React app communicates with the Express API exclusively through JSON - no server-side rendering. During development, Vite proxies `/auth` and `/api` requests to the backend so the entire session lives on one origin, avoiding cross-origin cookie issues.


## OAuth Flow

```
User clicks "Connect with Spotify"
        │
        ▼
GET /auth/login  ──► Redirects to accounts.spotify.com/authorize
                                    │
                                    ▼ (user approves)
GET /auth/callback?code=...  ──► Exchanges code for access + refresh tokens
                                 Stores tokens in server-side session
                                 Redirects browser to /dashboard
                                    │
                                    ▼
React calls GET /auth/status  ──► { authenticated: true }
React renders dashboard
```

The authorization code never touches the frontend. The client secret never leaves the server.

## Getting Started

### Prerequisites

- Node.js v18+
- A [Spotify Developer](https://developer.spotify.com/dashboard) account and app

### 1. Clone the repo

```bash
git clone https://github.com/KayeJD/statify.git
```

### 2. Configure the backend

Fill in your `.env`:

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
REDIRECT_URI=http://127.0.0.1:5173/auth/callback
FRONTEND_URL=http://127.0.0.1:5173
CLIENT_URL=http://127.0.0.1:5173
SESSION_SECRET=any-long-random-string
NODE_ENV=development
PORT=3000
```

### 3. Register the redirect URI

In your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard), add the redirect to your created app:

```
http://127.0.0.1:5173/auth/callback
```

> Spotify requires explicit IPv4/IPv6 loopback addresses - `localhost` is not permitted as a redirect URI.

### 4. Install dependencies and run

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
# Running at http://127.0.0.1:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
# Running at http://127.0.0.1:5173
```

Open `http://127.0.0.1:5173` in your browser.



## Security Notes

- Access tokens are stored in `httpOnly` server-side sessions (inaccessible to JavaScript)
- CORS is locked to the frontend origin only

