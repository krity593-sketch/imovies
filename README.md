# 🎬 IMovies - Movie Ticket Booking Made Simple

A production-ready Full-Stack MERN (MongoDB, Express.js, React.js, Node.js) web application that brings a modern, seamless cinema booking experience to users and powerful administrative analytics to theater operators.

---

## 🌟 Key Features

### 🍿 Indian & Bollywood Cinema Experience
- **Top Bollywood & Pan-India Blockbusters**: Features *Jawan, Stree 2: Sarkate Ka Aatank, Kalki 2898 AD, Animal, Bhool Bhulaiyaa 3, 12th Fail, Fighter, RRR, Singham Again*, and Hollywood crossover hits in Hindi & regional languages.
- **Top Indian Multiplex Network**: Screening across 8 major Indian cities: **Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, and Ahmedabad** (PVR INOX, Cinepolis, Prasads IMAX, AMB Cinemas, SPI Sathyam).
- **Interactive Cinema Seat Map**: Realistic seat grid (VIP Recliner ₹550, Premium ₹350, Regular ₹220) with live 5-minute reservation timer and collision prevention.
- **Indian Payment Gateway Simulator**: Instant payments via **UPI (Google Pay, PhonePe, Paytm, BHIM)**, Net Banking across top Indian banks (SBI, HDFC, ICICI, Axis), and Credit/Debit cards with standard cinema GST.
- **Digital E-Tickets with QR Code**: Boarding-pass style ticket with verified scannable QR verification code and print-to-PDF support.
- **My Bookings Dashboard**: Review active and past cinema bookings with 1-click ticket cancellation and seat release.

### 🛡️ Administrative Console
- **Box Office Telemetry**: Live KPI cards for Total Gross Revenue, Tickets Issued, Active Catalog, and Registered Users.
- **Top Grossing Visualizer**: Visual ranking progress bars displaying best-performing movie titles.
- **Master Bookings Directory**: Full-text search and status filtering (`All`, `CONFIRMED`, `CANCELLED`) for all customer reservations.

### 🔐 Security & Architecture
- **JWT (JSON Web Token)** based stateless authentication.
- **Password encryption** using salted bcrypt hashes.
- **Role-Based Access Control (RBAC)** guarding admin and user endpoints.
- **RESTful API** with clean MVC separation and centralized error handling middleware.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Axios, React Router v6 |
| **Backend** | Node.js, Express.js, REST API, Morgan HTTP Logger |
| **Database** | MongoDB, Mongoose ODM |
| **Security** | JSON Web Token (JWT), Bcrypt.js, CORS |

---

## 🚀 Quick Start Guide

### Prerequisites
1. **Node.js**: v16.0.0 or higher ([Download Node.js](https://nodejs.org))
2. **MongoDB**: Local MongoDB community server running on port `27017` or a MongoDB Atlas URI ([Download MongoDB](https://www.mongodb.com/try/download/community))

---

### Step 1: Backend Setup

1. Open your terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Ensure `.env` is configured (default points to local MongoDB):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/imovies
   JWT_SECRET=imovies_jwt_super_secret_key_change_in_production_123456
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```

4. Seed the database with movies, theaters, users, and shows:
   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   *The server will start at `http://localhost:5000`.*

---

### Step 2: Frontend Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client app will launch at `http://localhost:5173`.*

---

## 🔑 Pre-Configured Demo Accounts

| Role | Email | Password | Privileges |
|---|---|---|---|
| **Administrator** | `admin@imovies.com` | `admin123` | Full Admin Console, Analytics, All Bookings |
| **Standard User** | `john@example.com` | `user123` | Movie Browsing, Seat Booking, E-Tickets |

> *Tip: You can use the "Demo Admin" or "Demo User" one-click autofill buttons on the Login page.*

---

## 📁 Project Structure

```
imovies/
├── client/                     # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, Footer, MovieCard, Toast, QRCodeView, etc.)
│   │   ├── context/            # AuthContext (JWT & User state management)
│   │   ├── pages/              # Route Views (HomePage, MoviesPage, SeatBookingPage, AdminPage, etc.)
│   │   ├── services/           # Axios REST API client modules
│   │   ├── App.jsx             # Main Router & Route definitions
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind directives & Cinema styling
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── server/                     # Backend Application (Node + Express + MongoDB)
    ├── config/                 # Database connection (Mongoose)
    ├── controllers/            # Controller logic (Auth, Movies, Theaters, Shows, Bookings, Admin)
    ├── middleware/             # JWT Auth guard & error handling
    ├── models/                 # Mongoose Data Schemas (User, Movie, Theater, Show, Booking)
    ├── routes/                 # Express API routes
    ├── seed/                   # Database seeder script
    ├── server.js               # Entry point
    └── package.json
```

---

## 📡 API Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT | Public |
| `GET` | `/api/auth/me` | Fetch active user profile | Private |
| `GET` | `/api/movies` | Get movie catalog with filters | Public |
| `GET` | `/api/movies/featured` | Fetch top hero banner movies | Public |
| `GET` | `/api/movies/:id` | Get movie details & show dates | Public |
| `GET` | `/api/theaters` | List theaters and cities | Public |
| `GET` | `/api/shows` | Get screening times & dates | Public |
| `GET` | `/api/shows/:id` | Get show details with seat layout | Public |
| `POST` | `/api/bookings` | Reserve seats & generate booking | Private |
| `GET` | `/api/bookings/my-bookings` | Retrieve user booking history | Private |
| `PUT` | `/api/bookings/:id/cancel` | Cancel booking & release seats | Private |
| `GET` | `/api/admin/stats` | High-level telemetry & metrics | Admin Only |
| `GET` | `/api/admin/bookings` | View and filter all reservations | Admin Only |

---

## 📜 License
MIT License. Built for academic & portfolio demonstration.
