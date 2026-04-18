# ShambaRecords — Smart Season Field Monitoring System

A full-stack web application that helps coordinators and field agents track crop progress across multiple fields during a growing season.

---

## Live Demo

- **Frontend:** https://smart-season-field-monitoring-syste-ruby.vercel.app
- **Backend API:** https://smart-season-field-monitoring-syste-indol.vercel.app

### Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Field Agent | `john` | `pass123` |
| Field Agent | `mary` | `pass123` |
| Field Agent | `james` | `pass123` |

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- A PostgreSQL database (the project uses [Neon](https://neon.tech) serverless Postgres)

### 1. Clone the repository

```bash
git clone https://github.com/abrakingoo/smart_season_field_monitoring_system.git
cd smart_season_field_monitoring_system
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
DATABASE_URL=your_postgresql_connection_string
```

Run the database seed to create tables and insert initial data:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Project Structure

```
smart_season_field_monitoring_system/
├── backend/
│   ├── config/         # DB connection, schema, seed script
│   ├── controllers/    # Route handlers
│   ├── middleware/     # JWT auth, role guard
│   ├── models/         # PostgreSQL query functions
│   ├── routes/         # Express routers
│   └── server.js       # Entry point
└── frontend/
    └── src/
        ├── components/ # Reusable UI components
        ├── context/    # Global state (AppContext)
        ├── hooks/      # useFields hook
        ├── pages/      # AdminDashboard, Dashboard, LoginPage
        └── services/   # Axios API instance
```

---

## Field Stages

Fields follow a simple lifecycle:

| Stage | Description |
|-------|-------------|
| Planted | Seeds have been sown |
| Growing | Crop is actively growing |
| Ready | Crop is ready for harvest |
| Harvested | Crop has been harvested |

---

## Field Status Logic

Each field has a computed status derived from its stage, notes, and last update time. Status is computed server-side in `backend/models/fieldModel.js` on every API response.

| Status | Condition |
|--------|-----------|
| **Completed** | Stage is `Harvested` |
| **At Risk** | Stage is not `Harvested` AND either: the field has not been updated in over 7 days (stale), or a note contains a risk keyword (`pest`, `disease`, `drought`, `flood`, `damage`, `wilt`, `rot`) |
| **Active** | All other fields |

---

## Design Decisions

### Authentication
JWT-based authentication. Tokens are stored in `localStorage` and attached to every API request via an Axios interceptor. A 401 response automatically redirects to the login page.

### Role Separation
- **Admin** routes (`/admin`) are protected by both the JWT middleware and a role guard that rejects non-admin tokens.
- **Agent** routes (`/dashboard`) are protected by JWT only — agents see only their assigned fields because the backend filters by `assigned_to = req.user.id`.

### Database
PostgreSQL (Neon serverless) with four tables: `users`, `fields`, `stage_history`, `field_notes`. All primary keys use UUID via `pgcrypto`'s `gen_random_uuid()`. Foreign keys cascade on delete to keep data consistent.

### Status Computation
Status is computed on the server when a field is fetched, not stored in the database. This ensures it always reflects the latest data without requiring a separate update step.

### State Management
A single `AppContext` holds all fields and agents state. All mutations (create, update, delete, assign, stage change, note) call the API and update the context optimistically, so the UI reflects changes immediately without a full refetch.

### Frontend Architecture
- Admin uses `AdminLayout` with a collapsible sidebar (Overview, Fields, Agents, Insights sections).
- Agents use `AgentLayout` with a sidebar showing their field counts and a Settings section for password changes.
- Both layouts share the same earthy, nature-inspired color palette.

---

## Assumptions

- Usernames are unique across the system.
- Only admins can create fields, register agents, and change agent usernames.
- Agents can only change their own password, not their username.
- A field can be unassigned (no agent) — it will still appear in the admin view.
- Stage history is append-only; stages can be set in any order by the agent (no enforced forward-only progression), giving agents flexibility to correct mistakes.
- The "stale" threshold for At Risk status is 7 days without any update (stage change or note).

---

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/login` | Public |

### Fields
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/fields` | All authenticated |
| GET | `/api/fields/:id` | All authenticated |
| POST | `/api/fields` | Admin |
| PUT | `/api/fields/:id` | Admin |
| DELETE | `/api/fields/:id` | Admin |
| PATCH | `/api/fields/:id/stage` | All authenticated |
| POST | `/api/fields/:id/notes` | All authenticated |
| PATCH | `/api/fields/:id/assign` | Admin |

### Users
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/users` | Admin |
| GET | `/api/users/agents` | Admin |
| POST | `/api/users` | Admin |
| PATCH | `/api/users/:id` | Admin |
| PATCH | `/api/users/me/password` | All authenticated |
