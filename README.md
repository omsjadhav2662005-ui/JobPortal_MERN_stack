# 🧳 JobPortal — MERN Stack

A full-stack Job Portal web application built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js). The platform supports two user roles — **Job Seekers** and **Employers** — with features like job listings, applications, company profiles, real-time messaging, connection networking, and notifications.

> 🎓 Final Year Project · Built with MERN Stack

---

## 🚀 Features

### 👤 Authentication & Roles
- Register and login with JWT-based authentication
- Two roles: **Job Seeker** and **Employer**
- Route protection based on role (`PrivateRoute`, `EmployerRoute`)
- Change password functionality
- Rate limiting on login/register (20 requests per 15 min)

### 🧑‍💼 Job Seeker
- Browse, search, and filter job listings
- View detailed job descriptions (requirements, responsibilities, skills, salary, deadline)
- Apply for jobs with resume upload
- Track and withdraw applications from the dashboard
- Save jobs for later
- View similar/recommended jobs

### 🏢 Employer
- Post new job listings with full details (category, experience level, type, salary range, deadline)
- Manage posted jobs (edit / delete)
- Review applications and update their status
- Company profile management

### 👥 Network
- Browse other users on the Network page
- Send and respond to connection requests
- Remove existing connections

### 💬 Messaging (Inbox)
- Real-time-style conversations between connected users
- Create or retrieve existing conversations
- Send messages and mark them as read

### 🔔 Notifications
- In-app notification bell
- Notifications for connections, applications, messages, and jobs
- Mark individual notifications as read

### 🏙️ Company Profiles
- Browse all companies
- View company detail page with their posted jobs and info
- Employers can update their company profile

### 🛡️ Security
- Helmet for HTTP security headers
- `express-mongo-sanitize` for NoSQL injection protection
- `bcryptjs` for password hashing (salt rounds: 12)
- JWT for stateless session management
- CORS restricted to frontend origin

---

## 🛠️ Tech Stack

### Backend
| Package                  | Purpose                          |
|--------------------------|----------------------------------|
| Node.js + Express.js     | Server & REST API                |
| MongoDB + Mongoose       | Database & ODM                   |
| bcryptjs                 | Password hashing                 |
| jsonwebtoken             | JWT authentication               |
| multer                   | File uploads (resume, images)    |
| helmet                   | HTTP security headers            |
| express-rate-limit       | Rate limiting                    |
| express-mongo-sanitize   | NoSQL injection prevention       |
| dotenv                   | Environment variable management  |
| cors                     | Cross-Origin Resource Sharing    |
| nodemon *(dev)*          | Auto-restart on file changes     |

### Frontend
| Package                      | Purpose                        |
|------------------------------|--------------------------------|
| React 18 + Vite              | UI framework & build tool      |
| React Router DOM v6          | Client-side routing            |
| Axios                        | HTTP requests to backend API   |
| Tailwind CSS                 | Utility-first CSS styling      |
| Font Awesome                 | Icons                          |
| React Context API            | Auth state & global data state |

---

## 📁 Project Structure

```
jobportal-complete/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        # Register, login, profile, change password
│   │   ├── userController.js        # Profile update, connections, notifications
│   │   ├── jobController.js         # CRUD jobs, similar jobs
│   │   ├── applicationController.js # Apply, withdraw, status update
│   │   ├── companyController.js     # List, view, update companies
│   │   ├── conversationController.js# Messaging & inbox
│   │   └── uploadController.js      # File upload handling
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT protect middleware
│   │   └── errorMiddleware.js       # Global error handler
│   ├── models/
│   │   ├── User.js                  # User schema (seeker/employer/admin)
│   │   ├── Job.js                   # Job schema with text index
│   │   ├── Application.js           # Application schema
│   │   ├── Company.js               # Company schema
│   │   └── Conversation.js          # Messages schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── conversationRoutes.js
│   │   └── uploadRoutes.js
│   ├── utils/
│   │   ├── fileUpload.js            # Multer config
│   │   └── generateToken.js         # JWT token generator
│   ├── seeder.js                    # DB seed / destroy script
│   ├── server.js                    # App entry point
│   └── .env                         # Environment variables
│
└── frontend/
    ├── public/
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── JobCard.jsx
        │   ├── UserCard.jsx
        │   ├── CompanyCard.jsx
        │   ├── NotificationBell.jsx
        │   ├── ConversationItem.jsx
        │   ├── ApplicationItem.jsx
        │   ├── SocialLinks.jsx
        │   ├── RecommendedJob.jsx
        │   ├── Modal.jsx
        │   └── Modals/
        │       ├── ChatModal.jsx
        │       ├── EntryModal.jsx
        │       ├── HeadlineModal.jsx
        │       ├── ReviewModal.jsx
        │       ├── SkillModal.jsx
        │       ├── SocialModal.jsx
        │       └── CertModal.jsx
        ├── context/
        │   ├── AuthContext.jsx      # Auth state (user, login, logout)
        │   └── DataContext.jsx      # Global data (jobs, users, etc.)
        ├── hooks/
        │   └── useLocalStorage.js
        ├── pages/
        │   ├── Home.jsx             # Job listings & search
        │   ├── JobDetail.jsx        # Single job page + apply
        │   ├── Dashboard.jsx        # User dashboard (applications, saved jobs)
        │   ├── PostJob.jsx          # Employer: post/edit job
        │   ├── Companies.jsx        # Browse companies
        │   ├── CompanyDetail.jsx    # Company profile + jobs
        │   ├── Network.jsx          # Browse & connect with users
        │   ├── Inbox.jsx            # Messaging/conversations
        │   ├── SignIn.jsx
        │   └── SignUp.jsx
        ├── utils/
        │   ├── constants.js         # Enums: job types, categories, etc.
        │   └── helpers.js           # Utility functions
        ├── api.js                   # Axios instance config
        ├── App.jsx                  # Root component with routes
        └── main.jsx                 # React entry point
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MongoDB](https://www.mongodb.com/) (local) or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) URI
- npm

---

### 1. Clone the Repository

```bash
git clone https://github.com/omsjadhav2662005-ui/JobPortal_mern_stack.git
cd JobPortal_mern_stack
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jobportal2
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend:

```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Backend runs at: `http://localhost:5000`

---

### 3. Seed the Database (Optional)

```bash
# Import sample data
npm run data:import

# Destroy all data
npm run data:destroy
```

---

### 4. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint           | Auth     | Description                |
|--------|--------------------|----------|----------------------------|
| POST   | `/register`        | Public   | Register a new user        |
| POST   | `/login`           | Public   | Login and get JWT token    |
| GET    | `/profile`         | 🔒 JWT  | Get logged-in user profile |
| PUT    | `/change-password` | 🔒 JWT  | Change password            |

### Users — `/api/users`
| Method | Endpoint                       | Auth    | Description                    |
|--------|--------------------------------|---------|--------------------------------|
| GET    | `/`                            | Public  | Get all users (Network page)   |
| GET    | `/:id`                         | 🔒 JWT | Get user by ID                 |
| PUT    | `/profile`                     | 🔒 JWT | Update user profile            |
| POST   | `/:id/connect`                 | 🔒 JWT | Send connection request        |
| PUT    | `/connections/:fromId/respond` | 🔒 JWT | Accept / reject connection     |
| DELETE | `/connections/:id`             | 🔒 JWT | Remove connection              |
| POST   | `/notification`                | 🔒 JWT | Add a notification             |
| PUT    | `/notification/:id/read`       | 🔒 JWT | Mark notification as read      |

### Jobs — `/api/jobs`
| Method | Endpoint       | Auth    | Description                 |
|--------|----------------|---------|-----------------------------|
| GET    | `/`            | Public  | Get all jobs (with filters) |
| POST   | `/`            | 🔒 JWT | Post a new job              |
| GET    | `/myjobs`      | 🔒 JWT | Get employer's posted jobs  |
| GET    | `/:id`         | Public  | Get a single job            |
| GET    | `/:id/similar` | Public  | Get similar jobs            |
| PUT    | `/:id`         | 🔒 JWT | Update a job                |
| DELETE | `/:id`         | 🔒 JWT | Delete a job                |

### Applications — `/api/applications`
| Method | Endpoint        | Auth    | Description                     |
|--------|-----------------|---------|---------------------------------|
| POST   | `/`             | 🔒 JWT | Apply to a job                  |
| GET    | `/my`           | 🔒 JWT | Get current user's applications |
| GET    | `/job/:jobId`   | 🔒 JWT | Get applications for a job      |
| PUT    | `/:id/status`   | 🔒 JWT | Update application status       |
| DELETE | `/:id`          | 🔒 JWT | Withdraw application            |

### Companies — `/api/companies`
| Method | Endpoint | Auth    | Description            |
|--------|----------|---------|------------------------|
| GET    | `/`      | Public  | Get all companies      |
| GET    | `/:name` | Public  | Get company by name    |
| PUT    | `/:name` | 🔒 JWT | Update company profile |

### Conversations / Inbox — `/api/conversations`
| Method | Endpoint        | Auth    | Description                  |
|--------|-----------------|---------|------------------------------|
| GET    | `/`             | 🔒 JWT | Get all conversations        |
| POST   | `/`             | 🔒 JWT | Get or create a conversation |
| POST   | `/:id/messages` | 🔒 JWT | Send a message               |
| PUT    | `/:id/read`     | 🔒 JWT | Mark messages as read        |

### Upload — `/api/upload`
| Method | Endpoint | Auth    | Description               |
|--------|----------|---------|---------------------------|
| POST   | `/`      | 🔒 JWT | Upload file (resume/image)|

---

## 🌍 Environment Variables

| Variable       | Description                              | Default                                |
|----------------|------------------------------------------|----------------------------------------|
| `PORT`         | Backend server port                      | `5000`                                 |
| `MONGO_URI`    | MongoDB connection string                | `mongodb://localhost:27017/jobportal2` |
| `JWT_SECRET`   | Secret key for signing JWT tokens        | *(set a strong random string)*         |
| `FRONTEND_URL` | Allowed CORS origin                      | `http://localhost:5173`                |
| `NODE_ENV`     | Environment (`development`/`production`) | `development`                          |

---

## 🗂️ Pages & Routes (Frontend)

| Path             | Page           | Access           |
|------------------|----------------|------------------|
| `/`              | Home           | Public           |
| `/job/:id`       | Job Detail     | Public           |
| `/companies`     | Companies      | Public           |
| `/company/:name` | Company Detail | Public           |
| `/network`       | Network        | Public           |
| `/signin`        | Sign In        | Public           |
| `/signup`        | Sign Up        | Public           |
| `/dashboard`     | Dashboard      | 🔒 Logged in    |
| `/inbox`         | Inbox          | 🔒 Logged in    |
| `/postjob`       | Post Job       | 🔒 Employer only|

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Oms Jadhav**  
GitHub: [@omsjadhav2662005-ui](https://github.com/omsjadhav2662005-ui)

---

> Built with ❤️ using the MERN Stack · Final Year Project © 2025
