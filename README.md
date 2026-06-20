# 🎯 QuizMaster — Online Quiz Application

A production-ready full-stack Online Quiz Application built with the MERN Stack. Features role-based access, timed quizzes, analytics dashboards, and a responsive modern UI with dark/light mode.

---

## ✨ Features

### Student/User
- Register and login with JWT authentication
- Browse and search quizzes by category, difficulty, or title
- Attempt timed quizzes with real-time countdown
- One question at a time with free navigation
- Question palette showing answered/unanswered at a glance
- Auto-submit when timer expires
- Instant results with score, grade, and detailed answer review
- Explanations for each question after submission
- Full quiz history with pagination
- Profile page with personal stats

### Admin
- Secure admin dashboard with analytics charts
- Create, edit, publish/unpublish, and delete quizzes
- Full question management with inline modal (add/edit/delete questions)
- View and search all registered users
- Activate/deactivate user accounts
- Analytics: attempts over time, score distribution, category breakdown, top quizzes

### Quiz Engine
- 7 categories: Programming, JavaScript, React, Node.js, Database, Aptitude, General Knowledge
- Configurable timer, passing marks, negative marking
- Optional question and option randomization
- Auto-calculated total marks based on questions

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Redux Toolkit, React Router 6, Axios |
| Styling | Custom CSS design system, React Icons |
| Charts | Chart.js + react-chartjs-2 |
| Notifications | React Toastify |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Deployment | Docker + Docker Compose |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+ (local or Atlas)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repo-url>
cd quiz-app
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your values
npm install
npm run seed      # Seed sample data
npm run dev       # Start development server
```

### 3. Frontend Setup
```bash
cd ../frontend
cp .env.example .env
npm install
npm start
```

### 4. Access the app
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## 🐳 Docker Deployment

```bash
# From project root
docker-compose up -d

# Seed the database
docker exec quizapp-backend node seed.js
```

---

## 🔑 Demo Credentials

After seeding:

| Role | Email | Password |
|---|---|---|
| Admin | admin@quizapp.com | admin123 |
| User | alice@example.com | password123 |
| User | bob@example.com | password123 |

---

## 📁 Project Structure

```
quiz-app/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── seed.js          # Sample data seeder
│   └── server.js        # Entry point
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── admin/   # Admin-specific components
│       │   ├── common/  # Navbar, shared UI
│       │   └── quiz/    # Quiz card, etc.
│       ├── pages/
│       │   ├── admin/   # Admin pages
│       │   └── ...      # User pages
│       ├── store/
│       │   └── slices/  # Redux slices
│       └── utils/       # API client, helpers
│
└── docker-compose.yml
```

---

## 📡 API Reference

### Authentication
```
POST   /api/auth/register       Register new user
POST   /api/auth/login          Login user
GET    /api/auth/profile        Get current user profile (protected)
PUT    /api/auth/profile        Update profile (protected)
```

### Quizzes
```
GET    /api/quizzes             List published quizzes (paginated, filterable)
GET    /api/quizzes/:id         Get quiz details
GET    /api/quizzes/:id/attempt Get quiz for attempt (protected, hides answers)
GET    /api/quizzes/admin/all   List all quizzes (admin)
POST   /api/quizzes             Create quiz (admin)
PUT    /api/quizzes/:id         Update quiz (admin)
DELETE /api/quizzes/:id         Delete quiz + questions (admin)
```

### Questions
```
GET    /api/questions/quiz/:id  Get questions for quiz (admin)
POST   /api/questions           Add question (admin)
PUT    /api/questions/:id       Update question (admin)
DELETE /api/questions/:id       Delete question (admin)
```

### Results
```
POST   /api/results             Submit quiz attempt (protected)
GET    /api/results/user/:id    Get user's results (protected)
GET    /api/results/:id         Get single result with answers (protected)
GET    /api/results/quiz/:id    Get all results for quiz (admin)
```

### Admin
```
GET    /api/admin/analytics     Dashboard analytics (admin)
GET    /api/admin/users         List users (admin)
PUT    /api/admin/users/:id/toggle  Toggle user active status (admin)
```

---

## ☁️ Production Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy /build to Vercel
```

### Backend → Render
1. Connect your GitHub repo
2. Set environment variables from `.env.example`
3. Build command: `npm install`
4. Start command: `node server.js`

### Database → MongoDB Atlas
1. Create a free cluster at mongodb.com/atlas
2. Get your connection string
3. Set `MONGO_URI` in your backend environment variables

---

## 🔒 Security Features

- Passwords hashed with bcryptjs (12 salt rounds)
- JWT tokens with configurable expiry
- Role-based access control (user/admin)
- Input validation with express-validator
- Correct answers never sent to client during quiz attempt
- Admin routes protected with double middleware (protect + adminOnly)

---

## 📄 License

MIT License — free to use and modify.
