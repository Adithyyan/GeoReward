# Refer & Win • Location Verification Application

A complete fintech/referral web application inspired by Google Pay and Cash App. To prevent referral fraud, users must provide their friend's Name, Mobile Number, and allow browser GPS location access (Latitude, Longitude, Accuracy) before claiming the ₹100 reward. An administrative portal with JWT authentication allows admins to view captured referrals with masked phone numbers (`98765*****`) and verify device coordinates on Google Maps.

---

## 📁 Project Structure

```text
Location Finder/
├── package.json               # Root monorepo orchestrator
├── README.md                  # Comprehensive setup & API documentation
├── server/                    # Node.js + Express.js Backend
│   ├── .env.local             # Local environment variables
│   ├── package.json           # Server dependencies & scripts
│   ├── schema.sql             # PostgreSQL schema definition
│   └── src/
│       ├── index.js           # Express app entry point & CORS configuration
│       ├── config/
│       │   └── db.js          # Neon Serverless PostgreSQL connection pool
│       ├── controllers/
│       │   ├── adminController.js     # Admin login & profile handler
│       │   └── referralController.js  # Referral verification & list handler
│       ├── middleware/
│       │   └── authMiddleware.js      # JWT authentication middleware
│       ├── models/
│       │   ├── adminModel.js          # Raw SQL queries for admins
│       │   └── referralModel.js       # Raw SQL queries for referrals
│       ├── routes/
│       │   ├── adminRoutes.js         # /api/admin endpoints
│       │   ├── referralRoutes.js      # /api/referrals endpoints
│       │   └── index.js               # Central router mounting /api
│       └── scripts/
│           └── seedAdmin.js           # Automated schema & admin seeder
└── web/                       # Vue 3 (Composition API) + Tailwind CSS Frontend
    ├── .env.local             # Web environment variables
    ├── index.html             # Vite HTML template
    ├── package.json           # Web dependencies & scripts
    ├── postcss.config.js      # PostCSS configuration
    ├── tailwind.config.js     # Tailwind CSS theme & animation configuration
    ├── vite.config.js         # Vite bundler configuration
    └── src/
        ├── main.js            # Vue entry point & plugins
        ├── App.vue            # Root component with navigation & transitions
        ├── style.css          # Tailwind directives & glassmorphism classes
        ├── router/
        │   └── index.js       # Vue Router configuration
        ├── components/
        │   ├── Navbar.vue     # Fintech top navigation bar
        │   └── Toast.vue      # Animated notifications
        ├── views/
        │   ├── Home.vue       # Fintech mobile dashboard & location verification
        │   └── Admin.vue      # Glassmorphism login & masked referral table
        └── services/
            └── api.js         # Axios HTTP client with JWT interceptor
```

---

## 🛠️ Tech Stack

- **Frontend:** Vue 3 (`<script setup>` Composition API), Vite, Tailwind CSS, Vue Router, Axios, `@vueuse/motion`, and `lucide-vue-next`.
- **Backend:** Node.js, Express.js (ES6 syntax).
- **Database:** PostgreSQL (Neon Serverless) via `'pg'` connection pool with raw SQL parameterized queries.
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) and `bcryptjs` for admin access.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
Run the install command from root:
```bash
npm run install:all
```
*Or install individually:*
```bash
cd server && npm install
cd ../web && npm install
```

---

### 2. Configure Environment Variables

#### Backend (`server/.env.local`)
Create or edit `server/.env.local` with your Neon PostgreSQL connection string:
```ini
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://neondb_owner:npg_... (Leave as placeholder or paste Neon connection)
JWT_ACCESS_SECRET=development_jwt_access_secret_super_secure_random_key_64_bytes_long_
JWT_REFRESH_SECRET=development_jwt_refresh_secret_super_secure_random_key_64_bytes_long_
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

#### Frontend (`web/.env.local`)
```ini
VITE_API_URL=http://localhost:3001/api
```

---

### 3. Initialize Database & Seed Default Admin

Run the automated seeder script:
```bash
npm run db:init
```
*(or from `/server`: `npm run db:init`)*

This script applies `schema.sql` to create `referrals` and `admins` tables, then seeds a default administrator:
- **Email:** `admin@example.com`
- **Password:** `Admin@123`

---

### 4. Run the Development Servers

Open two terminals:

**Terminal 1 (Backend API):**
```bash
npm run server
# API will run at http://localhost:3001
```

**Terminal 2 (Frontend Vue App):**
```bash
npm run web
# Web app will run at http://localhost:5173
```

---

## 📡 API Reference

### Public Endpoints
- **`GET /api/health`**
  - Health check & uptime info.
- **`POST /api/referrals`**
  - **Body:** `{ "name": "Jane Doe", "mobile": "9876543210", "latitude": 28.6139, "longitude": 77.2090, "accuracy": 15.2 }`
  - Validates input, saves to PostgreSQL, returns `201 Created` with message `"Bonus will be credited shortly!"`.
- **`POST /api/admin/login`**
  - **Body:** `{ "email": "admin@example.com", "password": "Admin@123" }`
  - Validates credentials, returns JWT token.

### Protected Endpoints (Requires `Authorization: Bearer <token>`)
- **`GET /api/referrals`**
  - Retrieves all captured referrals ordered by newest first.
- **`GET /api/admin/me`**
  - Returns authenticated admin profile.

---

## 📱 Mobile App UI Highlights

- **Fintech Aesthetic:** Mobile-viewport constrained design (`max-w-md mx-auto`), vibrant emerald/teal gradients, glowing cards, and micro-interactions.
- **Header:** User Avatar, "Hi, User!" greeting, Level badge, and unread notification bell.
- **Hero Card:** Shows "Total Rewards: ₹500" with a "Claim Now" trigger.
- **Referral Verification Flow:** When clicking the glowing "Verify & Claim ₹100" button:
  - Validates Name and Mobile (10-15 digits).
  - Fetches GPS coordinates via `navigator.geolocation.getCurrentPosition`.
  - Displays spinner with *"Verifying location eligibility to prevent fraud..."*.
  - On success, sends data to `POST /api/referrals` and displays toast *"Bonus will be credited shortly!"*.
  - If location access is blocked or times out, displays error toast: *"Location access is required to verify your referral and prevent fraud. Please enable location services."*
- **Admin Panel:** Glassmorphism card for login, and an anti-fraud dashboard with masked phone numbers (`98765*****`), GPS accuracy badges, and instant Google Maps links.
