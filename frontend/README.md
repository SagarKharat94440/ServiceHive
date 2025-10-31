# SlotSwapper Frontend

React-based UI for the SlotSwapper application.

## Overview

The frontend is a single-page application built with React and Vite. It provides an intuitive interface for users to manage their calendar slots and interact with the swap system.

## Tech Stack

- React 18 (with hooks)
- Vite (build tool)
- React Router v6 (routing)
- Axios (HTTP client)
- Tailwind CSS (styling)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Configure Environment

The `.env` file is already set up to connect to the local backend:

```
VITE_API_URL=http://localhost:5000/api
```

Change this if your backend runs on a different port or domain.

### Run Development Server

```bash
npm run dev
```

App runs on `http://localhost:3000`

### Build for Production

```bash
npm run build    # Creates optimized build in dist/
npm run preview  # Preview the production build
```

## Project Structure

```
src/
├── components/
│   ├── Loading.jsx          # Loading spinner component
│   └── Navbar.jsx           # Navigation bar
├── pages/
│   ├── Home.jsx             # Landing/welcome page
│   ├── Login.jsx            # Login form
│   ├── Signup.jsx           # Registration form
│   ├── Dashboard.jsx        # User's calendar/events
│   ├── Marketplace.jsx      # Browse swappable slots
│   └── Requests.jsx         # Manage swap requests
├── services/
│   └── api.js               # Axios setup + API calls
├── App.jsx                  # Main app + routing
├── main.jsx                 # React entry point
└── index.css                # Global styles
```

## Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Landing page | No |
| `/login` | Login form | No |
| `/signup` | Registration form | No |
| `/dashboard` | User's events/calendar | Yes |
| `/marketplace` | Browse available slots | Yes |
| `/requests` | Swap requests (in/out) | Yes |

Protected routes automatically redirect to `/login` if user is not authenticated.

## Key Features

### Authentication Flow
- JWT tokens stored in localStorage
- Automatic token injection in API requests
- Auto-logout when token expires (401 response)
- Protected route redirects

### State Management
- Component-level state with React hooks
- No external state management library (kept it simple)
- Real-time UI updates after API operations

### API Service Layer
The `services/api.js` file handles all HTTP requests:
- Axios instance with base URL configuration
- Request interceptor: adds JWT token to headers
- Response interceptor: handles 401 errors
- Organized by feature (auth, events, swaps)

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Works on desktop, tablet, and mobile devices
