# CareerPilot

CareerPilot is a full-stack career management platform for organizing applications, tracking interviews, and improving career decisions with AI.

## Live demo

[**Open CareerPilot →**](https://career-pilot-psi-two.vercel.app/)

**Demo account**

- **Email:** `test@test.com`
- **Password:** `test1234`

The demo account is intended for recruiters and reviewers to explore CareerPilot. Please do not enter personal or confidential information.

## Key features

- Dashboard
- AI resume analysis
- Job application tracking
- Interview tracking
- AI-assisted career roadmaps
- Authentication
- Profile management
- Dark mode

## Tech stack

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS

### Backend

- Express 5
- Node.js
- TypeScript
- Drizzle ORM
- PostgreSQL

### Database

- Neon PostgreSQL

### External services

- Google Gemini API
- Cloudinary
- Vercel (frontend deployment)
- Render (backend deployment)

## Local setup

1. Clone the repository and install dependencies in both app directories.

```bash
git clone https://github.com/Daksh-Vasala/CareerPilot.git
cd CareerPilot
cd frontend && npm install
cd ../backend && npm install
```

2. Create the required environment files in each app directory using the variable names listed below.

3. Run database migrations in `backend/`:

```bash
cd backend
npm run db:migrate
```

4. Start the apps locally.

```bash
cd frontend && npm run dev
cd backend && npm run dev
```

The frontend runs on `http://localhost:5000` and the backend runs on `http://localhost:3000` by default. AI resume analysis, resume upload, and email flows require the related external services to be configured (`GEMINI_API_KEY`, `CLOUDINARY_*`, and `RESEND_API_KEY`).

## Environment variables

Backend (`backend/.env`):

- `PORT`
- `DEBUG`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `RESEND_API_KEY`
- `FRONTEND_URL`

Frontend (`frontend/.env.local` or equivalent):

- `BACKEND_API_URL`
- `NEXT_PUBLIC_API_URL` (fallback used by the frontend helper when `BACKEND_API_URL` is not set)

## Author

- GitHub: [Daksh-Vasala](https://github.com/Daksh-Vasala)
- LinkedIn: [Daksh Vasala](https://www.linkedin.com/in/daksh-vasala/)
