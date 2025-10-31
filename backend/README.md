# SlotSwapper Backend

Express.js REST API for the SlotSwapper application.

## Overview

This is the backend service that handles all the business logic for SlotSwapper, including user authentication, event management, and the core swap request system.

## Tech Stack

- Node.js + Express.js
- MongoDB (with native driver)
- JWT for authentication
- bcryptjs for password hashing

## Getting Started

### Install Dependencies

```bash
npm install
```

### Configure Environment

Copy `.env.example` to `.env` and update with your settings:

```bash
cp .env.example .env
```

Required environment variables:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing (use a strong random string)
- `PORT` - Server port (default: 5000)

### Run the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server runs on `http://localhost:5000`

## API Documentation

### Auth Endpoints

**POST** `/api/auth/signup`
- Register a new user
- Body: `{ name, email, password }`
- Returns: `{ token, user: { id, name, email } }`

**POST** `/api/auth/login`
- Login existing user
- Body: `{ email, password }`
- Returns: `{ token, user: { id, name, email } }`

### Event Endpoints (Protected)

All event endpoints require JWT token in Authorization header.

**GET** `/api/events`
- Get current user's events
- Returns: Array of event objects

**POST** `/api/events`
- Create new event
- Body: `{ title, startTime, endTime }`
- Returns: Created event object

**PATCH** `/api/events/:id`
- Update event status (BUSY/SWAPPABLE)
- Body: `{ status }`
- Returns: Success message

### Swap Endpoints (Protected)

**GET** `/api/swappable-slots`
- Get all swappable slots from other users
- Returns: Array of swappable events with owner info

**POST** `/api/swap-request`
- Request to swap slots
- Body: `{ mySlotId, theirSlotId }`
- Returns: Created swap request

**GET** `/api/swap-requests`
- Get user's swap requests (sent and received)
- Returns: Array of swap requests with details

**POST** `/api/swap-response/:requestId`
- Accept or reject a swap request
- Body: `{ response: "ACCEPTED" | "REJECTED" }`
- Returns: Success message

### Utility

**GET** `/health`
- Health check endpoint
- Returns: `{ status: "ok", message: "Server is running" }`

## Project Structure

```
src/
├── config/
│   └── database.js          # MongoDB connection setup
├── controllers/
│   ├── authController.js    # signup, login logic
│   ├── eventController.js   # event CRUD operations
│   └── swapController.js    # swap request/response logic
├── middleware/
│   └── auth.js              # JWT verification middleware
├── routes/
│   ├── authRoutes.js        # /api/auth routes
│   ├── eventRoutes.js       # /api/events routes
│   └── swapRoutes.js        # /api/swap routes
├── utils/
│   └── auth.js              # JWT & bcrypt utilities
└── server.js                # Express app setup
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Events Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: Users),
  title: String,
  startTime: Date,
  endTime: Date,
  status: String (BUSY | SWAPPABLE | SWAP_PENDING),
  createdAt: Date
}
```

### SwapRequests Collection
```javascript
{
  _id: ObjectId,
  requesterUserId: ObjectId (ref: Users),
  requesterSlotId: ObjectId (ref: Events),
  targetUserId: ObjectId (ref: Users),
  targetSlotId: ObjectId (ref: Events),
  status: String (PENDING | ACCEPTED | REJECTED),
  createdAt: Date
}
```
