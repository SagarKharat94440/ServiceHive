# SlotSwapper - ServiceHive Full Stack Challenge

> A peer-to-peer time-slot scheduling application where users can swap calendar slots with each other.

## What is SlotSwapper?

Ever had a meeting scheduled at an inconvenient time and wished you could trade it with someone else's slot? That's exactly what SlotSwapper does!

Users can:
- Mark their busy calendar slots as "swappable"
- Browse other users' swappable slots
- Request to swap their slot with someone else's
- Accept or reject incoming swap requests
- Have their calendars automatically updated when swaps are accepted

## Project Structure

```
SlotSwapper/
├── backend/          # Express.js API
├── frontend/         # React SPA
└── README.md         # You are here
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or pnpm

### Setup Instructions

1. **Backend Setup**
```bash
cd backend
npm install
# Create .env file and add your MongoDB connection string
cp .env.example .env
npm run dev
```

2. **Frontend Setup** (open new terminal)
```bash
cd frontend
npm install
npm run dev
```

The app will be running at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### MongoDB Setup

You'll need a MongoDB database. Two options:

**Local MongoDB**: Use connection string `mongodb://localhost:27017/slotswapper`

**MongoDB Atlas** (recommended for quick setup):
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/slotswapper
   ```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user (returns JWT) |

### Events
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/events` | Get user's events | Yes |
| POST | `/api/events` | Create new event | Yes |
| PATCH | `/api/events/:id` | Update event status | Yes |

### Swap System
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/swappable-slots` | Get all available swappable slots | Yes |
| POST | `/api/swap-request` | Request a swap | Yes |
| GET | `/api/swap-requests` | Get user's swap requests | Yes |
| POST | `/api/swap-response/:requestId` | Accept/reject swap | Yes |


## Tech Stack

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling

**Backend:**
- Node.js with Express
- MongoDB for database
- JWT for authentication
- bcryptjs for password hashing

## Design Decisions

### Why separate frontend and backend?
- Independent scaling and deployment
- Clear separation of concerns
- Easier to maintain and test

### Why MongoDB?
- Flexible schema for rapid development
- Easy to set up locally or in the cloud
- Good fit for this type of application data

### Authentication Flow
- JWT tokens stored in localStorage
- Tokens sent via Authorization header
- Automatic logout on token expiration

### Swap Logic Implementation
The swap system has three states for events:
- `BUSY` - Regular event, not available for swapping
- `SWAPPABLE` - Available for others to request
- `SWAP_PENDING` - Currently involved in a pending swap request

When a swap is accepted, the system performs an atomic transaction:
1. Validates both slots are still valid
2. Swaps the ownership of the events
3. Updates both events back to BUSY status
4. Marks the swap request as ACCEPTED

## Challenges Faced

1. **Atomic Swap Operations**: Ensuring that the swap transaction doesn't leave the database in an inconsistent state if something fails midway.

2. **State Management**: Keeping the frontend in sync when swaps are accepted/rejected without requiring manual refresh.

3. **JWT Security**: Balancing between token expiration time (user convenience) and security.



---

Built for ServiceHive Full Stack Intern Challenge
