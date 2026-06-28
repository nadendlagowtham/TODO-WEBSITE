# TaskSpace — Full-Stack Todo Management Application

TaskSpace is a premium, production-quality Todo Management SaaS application built using the MERN stack (MongoDB, Express.js, React, Node.js) with styling based on a modern, high-utility *Kinetic Mono-Minimalism* design system.

## Key Features

### Backend (Node.js & Express)
- **Database Storage**: MongoDB (Mongoose schemas for Users and Todos).
- **Authentication**: JWT verification middleware with bcryptjs password hashing.
- **REST APIs**: Complete CRUD routes with query-based server-side search, sorting, and category/status/priority filters.
- **Access Control**: Strict ownership checks; users can only interact with their own todos.
- **Error Handling**: Global middleware to standardize API exception payloads in JSON.

### Frontend (React & Tailwind CSS)
- **Multi-page Navigation**: React Router v6 layout routes separating public (AuthLayout) and protected (MainLayout) environments.
- **SaaS UI Styling**: Elegant light-theme visuals, Geist & Inter fonts, custom 18px checkbox inputs, low-saturation status badges, and subtle micro-animations.
- **Form Handling**: Form validation and error checks using `react-hook-form`.
- **Axios HTTP Client**: Base configuration with automatic JWT injection and automatic logout on 401 errors.
- **Premium UX Components**: Zero-dependency animated toast notifications, animated skeleton screens during loading, and clear search empty-state boards.

---

## Workspace Folder Structure

```
Todo/
├── backend/
│   ├── config/db.js           # Database initialization
│   ├── controllers/           # Auth and Todo controller logic
│   ├── middleware/            # JWT validation and error handlers
│   ├── models/                # User and Todo Mongoose models
│   ├── routes/                # Express routing definitions
│   ├── utils/generateToken.js # Signing JWT utility
│   ├── .env                   # Configuration parameters
│   ├── package.json           # Backend dependency configurations
│   └── server.js              # Express app bootstrap
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable inputs, cards, check boxes, modals, skeletons
│   │   ├── context/           # Global authentication and toast context providers
│   │   ├── layouts/           # AuthLayout and MainLayout route structures
│   │   ├── pages/             # Login, Register, Dashboard, Details, and 404 Pages
│   │   ├── services/          # Axios client, auth, and todo endpoint actions
│   │   ├── utils/helpers.js   # Style color mapping helpers
│   │   ├── App.jsx            # Main Router setup
│   │   ├── index.css          # Tailwind CSS and scrollbar declarations
│   │   └── main.jsx           # App mounting bootstrap
│   ├── tailwind.config.js     # Tailwind styling extensions
│   ├── postcss.config.js      # CSS compiler setups
│   ├── vite.config.js         # Port configuration (3000) and proxy rules
│   └── package.json           # Frontend dependency configurations
└── README.md                  # This file
```

---

## Setup & Running the Application

Ensure you have [Node.js](https://nodejs.org/) (v18+) and [MongoDB](https://www.mongodb.com/) running locally (port 27017).

### 1. Launch the Backend Server
1. Navigate to the `backend/` folder:
   ```bash
   cd backend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Boot up the server in development mode (starts on Port 3001):
   ```bash
   npm run dev
   ```

### 2. Launch the Frontend Development Server
1. Navigate to the `frontend/` folder in a new terminal window:
   ```bash
   cd frontend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Boot up the dev server (starts on Port 3000):
   ```bash
   npm run dev
   ```
4. Open your browser and go to `http://localhost:3000`.

---

## API Documentation

All todo endpoints require a JWT bearer token attached to the `Authorization` header (`Bearer <token>`).

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/api/auth/register` | Create a new user account | No |
| POST | `/api/auth/login` | Authenticate user & retrieve JWT token | No |
| GET | `/api/auth/profile` | Retrieve profile of active user | Yes |
| GET | `/api/todos` | Fetch all user-owned todos (supports search, sort, and filters) | Yes |
| GET | `/api/todos/:id` | Fetch specific todo details | Yes |
| POST | `/api/todos` | Create a new todo | Yes |
| PUT | `/api/todos/:id` | Update specific todo details | Yes |
| DELETE | `/api/todos/:id` | Delete a todo | Yes |
| GET | `/health` | Server status diagnostic health check | No |