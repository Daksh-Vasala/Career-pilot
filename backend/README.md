# Backend API

Base URL: `http://localhost:3000/api/v1` (or `PORT` from env)

Auth: JWT is stored in a `token` cookie. Public routes: `/auth/register`, `/auth/login`. All others require a valid session cookie.

## Endpoints

### Auth

- `POST /auth/register` — body: `{ firstName, lastName, email, password }`
- `POST /auth/login` — body: `{ email, password }`
- `GET /auth/me` — current user
- `POST /auth/logout` — sign out

### Jobs

- `GET /jobs`
- `POST /jobs` — body: `{ companyName, jobTitle, jobUrl?, location?, employmentType?, salary?, description? }`
- `GET /jobs/:id`
- `PATCH /jobs/:id`
- `DELETE /jobs/:id`

### Applications

- `GET /applications`
- `POST /applications` — body: `{ jobId, status?, appliedAt?, notes?, recruiterName?, recruiterEmail? }`
- `GET /applications/:id`
- `PATCH /applications/:id`
- `DELETE /applications/:id`

### Profile

- `GET /profiles`
- `PATCH /profiles` — update profile fields

### Resumes

- `GET /resumes`
- `POST /resumes` — `multipart/form-data` with `file` and `title`
- `GET /resumes/:id`
- `PATCH /resumes/:id`
- `DELETE /resumes/:id`

### Interviews

- `GET /interviews`
- `POST /interviews` — body: `{ applicationId, status?, interviewType?, scheduledAt?, interviewerName?, meetingLink?, notes?, feedback? }`
- `GET /interviews/:id`
- `PATCH /interviews/:id`
- `DELETE /interviews/:id`

### AI

- `POST /ai/resume-analysis` — body: `{ resumeId, jobDescription? }`
- `GET /ai/resume-analysis/:id`
- `GET /ai/resume-analysis?resumeId=<id>`

### Dashboard

- `GET /dashboard/summary`

### Notes

- Responses are JSON.
- Validation errors return `400`.
- Unauthorized requests return `401`.
