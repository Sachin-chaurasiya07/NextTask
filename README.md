# NexTask — Full Stack Kanban Project Manager

A production-ready full-stack task management application built to showcase modern full-stack development skills.

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Tailwind CSS (custom design system)
- Redux Toolkit (global state)
- React Router v6 (navigation)
- Axios (HTTP + JWT interceptors)
- @hello-pangea/dnd (drag & drop)
- Vite (build tool)
- Lucide React (icons)

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs (password hashing)
- RESTful API design

## Features

- JWT-secured authentication (register / login)
- Full CRUD task management
- Drag-and-drop Kanban board (Todo → In Progress → Done)
- Priority levels (Low / Medium / High) with color coding
- Due date tracking with overdue detection
- Analytics dashboard (completion rate, priority breakdown)
- Fully responsive design

## Project Structure

```
nexttask/
├── backend/
│   ├── middleware/auth.js      # JWT verification middleware
│   ├── models/
│   │   ├── User.js             # User schema with bcrypt
│   │   └── Task.js             # Task schema
│   ├── routes/
│   │   ├── auth.js             # Register, Login, Me
│   │   └── tasks.js            # CRUD endpoints
│   ├── server.js               # Express + MongoDB entry
│   └── .env.example
└── frontend/
    └── src/
        ├── api/axios.ts        # Axios instance + interceptors
        ├── components/         # Reusable UI components
        ├── pages/              # Route-level pages
        ├── store/              # Redux slices
        └── types/index.ts      # TypeScript interfaces
```


## Local Development

### 1. Clone & setup backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET
npm run dev
```

### 2. Setup frontend

```bash
cd frontend
npm install
# Create .env file:
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm run dev
```

Frontend runs on `http://localhost:3000`
Backend runs on `http://localhost:5000`

---

## Deployment

### Step 1 — MongoDB Atlas (Database)

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free cluster
2. Add a database user (username + password)
3. Whitelist IP: `0.0.0.0/0` (allow all for deployment)
4. Get connection string: `mongodb+srv://<user>:<pass>@cluster.mongodb.net/nexttask`

### Step 2 — Backend on Render

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add Environment Variables:
   ```
   MONGO_URI=your_atlas_connection_string
   JWT_SECRET=any_long_random_string
   CLIENT_URL=https://your-frontend.vercel.app
   PORT=10000
   ```
7. Deploy → copy the service URL (e.g. `https://nexttask-api.onrender.com`)

### Step 3 — Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add Environment Variable:
   ```
   VITE_API_URL=https://nexttask-api.onrender.com/api
   ```
5. Deploy — done!

---

## Environment Variables Reference

**Backend `.env`**
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=supersecretkey
CLIENT_URL=http://localhost:3000
```

**Frontend `.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

---

Built by **Sachin Chaurasiya** | [GitHub](https://github.com/Sachin-chaurasiya07)
