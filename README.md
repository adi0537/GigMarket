# GigMarket - Freelance Marketplace

A mini-freelance marketplace platform where Clients can post jobs (Gigs) and freelancers can apply for them (Bids).

## Features

### Core Features
- **User Authentication**: Secure JWT-based auth with HttpOnly cookies
- **Distinct Role-based Modes**: Fluidly switch between Client Mode (posting jobs) and Freelancer Mode (bidding on jobs) via seamless dashboards and distinct views.
- **Gig Management**: Full CRUD for job listings
- **Search & Filter**: Search gigs by title with status filtering, smartly hiding your own gigs when browsing as a freelancer.
- **Bidding System**: Submit proposals with message and price. Bidding restricted intelligently based on user role and state.
- **Hiring Logic**: Atomic hiring with automatic bid status updates

### Bonus Features
- **Real-Time Order & Negotiation Pipeline**: Live, persistent chat (MongoDB + Socket.io) allowing direct communication between clients and freelancers on specific gigs.
- **Transactional Integrity**: MongoDB transactions prevent race conditions when hiring
- **Real-time Updates**: Socket.io notifications for instant updates when hired, rejected, or receiving new bids.

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose ODM
- JWT Authentication with HttpOnly Cookies
- Socket.io for real-time communication
- MongoDB Transactions for atomic operations

### Frontend
- React.js (with Vite)
- Redux Toolkit for State Management
- Tailwind CSS for styling
- Socket.io Client for real-time updates
- React Router for navigation

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & set HttpOnly Cookie |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/gigs` | Fetch all open gigs (with search query) |
| GET | `/api/gigs/:id` | Get single gig |
| GET | `/api/gigs/my-gigs` | Get user's posted gigs |
| POST | `/api/gigs` | Create a new job post |
| PUT | `/api/gigs/:id` | Update a gig |
| DELETE | `/api/gigs/:id` | Delete a gig |
| POST | `/api/bids` | Submit a bid for a gig |
| GET | `/api/bids/:gigId` | Get all bids for a gig (Owner only) |
| GET | `/api/bids/my-bids` | Get user's submitted bids |
| PATCH | `/api/bids/:bidId/hire` | Hire a freelancer (Atomic) |

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed)
}
```

### Gig
```javascript
{
  title: String,
  description: String,
  budget: Number,
  ownerId: ObjectId (ref: User),
  status: 'open' | 'assigned',
  hiredFreelancerId: ObjectId (ref: User)
}
```

### Bid
```javascript
{
  gigId: ObjectId (ref: Gig),
  freelancerId: ObjectId (ref: User),
  message: String,
  price: Number,
  status: 'pending' | 'hired' | 'rejected'
}
```

## Hiring Logic (Race Condition Prevention)

The hiring system uses MongoDB transactions to ensure atomic operations:

1. When "Hire" is clicked, a transaction begins
2. The system verifies the gig is still "open" 
3. Uses optimistic locking with `findOneAndUpdate` checking status
4. Updates gig status to "assigned"
5. Sets winning bid status to "hired"
6. Rejects all other bids for that gig
7. Commits transaction (or rolls back on failure)

This prevents race conditions where two admins might try to hire different freelancers simultaneously.

## Real-time Notifications

Socket.io provides instant notifications:

- **When Hired**: Freelancer receives instant "You have been hired!" notification
- **When Rejected**: Freelancers notified when their bids are rejected
- **New Bids**: Gig owners notified when new bids are submitted
- **Gig Updates**: All users see real-time gig status changes

## Project Structure

```
gigmarket-assignment/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bidController.js
│   │   └── gigController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Bid.js
│   │   ├── Gig.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bidRoutes.js
│   │   └── gigRoutes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

