# Product Review Hub

A full-stack product review platform where users can browse products, submit star ratings and reviews, manage their own reviews, and admins can manage the catalog. Built with Next.js, FastAPI, and PostgreSQL.

**Live Demo:** [Frontend](https://product-review-hub-frontend.vercel.app) | [API](https://product-review-hub-backend.onrender.com) | [Swagger Docs](https://product-review-hub-backend.onrender.com/docs)

---

## What This Project Demonstrates

This project is designed to showcase full-stack engineering skills across the complete web development spectrum:

- **Frontend (Next.js 16):** App Router, TypeScript, server & client components, custom hooks, responsive design
- **Backend (FastAPI):** Async Python, SQLAlchemy 2.x, Alembic migrations, Pydantic validation, JWT auth
- **Database (PostgreSQL):** Relational schema design, indexed queries, cascade deletes
- **Testing:** Backend tests (pytest + async fixtures) and frontend tests (Vitest + MSW)
- **DevOps:** Dockerized PostgreSQL, environment configuration, CI-ready

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui |
| Backend | FastAPI, Python 3.12, SQLAlchemy 2.x (async), Alembic |
| Database | PostgreSQL (asyncpg driver) |
| Authentication | fastapi-users with JWT (cookie-based tokens) |
| Package Managers | pnpm (frontend), uv (backend) |

---

## Project Structure

```
product-review-hub/
├── frontend/                 # Next.js application
│   ├── app/                  # App Router pages (home, products/[id], dashboard)
│   ├── components/           # React components (shadcn/ui + custom)
│   ├── hooks/                # Custom React hooks (useAuth, useReviews)
│   ├── lib/                  # API client, utilities, schemas
│   └── tests/                # Vitest + MSW component tests
├── backend/                  # FastAPI application
│   ├── app/                  # Application code
│   │   ├── routers/          # API route handlers
│   │   ├── models.py         # SQLAlchemy ORM models (user, product, review)
│   │   ├── schemas.py        # Pydantic request/response schemas
│   │   └── auth.py           # JWT auth configuration
│   ├── alembic/              # Database migrations
│   ├── scripts/              # Seed script for sample data
│   └── tests/                # Pytest async tests
└── README.md
```

---

## Pages & Features

### Home Page
- **Product grid** with pagination — each card shows the product image, title, average rating (stars), and review count
- **Search bar** to find products by title/description
- **Rating filter** to narrow results by minimum rating
- **Skeleton loaders** while data is fetching
- **Error alerts with retry** on API failure

### Product Details Page
- Full product information with image and description
- Average rating summary
- All user reviews displayed chronologically
- **Review submission form** with fields for Name, Rating (1–5 with interactive star hover preview), and Comment
- After submitting, the review list **automatically refreshes** and the average rating **updates immediately**

### User Dashboard
- View all reviews submitted by the logged-in user
- Edit or delete your own reviews

### Admin Panel (Superuser Only)
- Create new products (title, description, image URL)
- Delete products (cascades to remove all associated reviews)
- Moderate and delete any inappropriate reviews

---

## Database Schema

| Table | Key Columns | Notes |
|---|---|---|
| **user** | `id` (UUID), `email`, `hashed_password`, `name`, `is_superuser`, `is_active`, `is_verified`, `created_at` | Extended beyond PRD spec with UUID PK, superuser roles, and verification flags |
| **product** | `id` (int), `title`, `description`, `image_url`, `created_at` | Cascade delete to reviews |
| **review** | `id` (int), `product_id` (FK), `user_id` (FK), `rating` (1–5), `comment`, `created_at` | Unique constraint on (product_id, user_id) — one review per product per user |

### Migrations

```bash
cd backend
alembic upgrade head
alembic current
alembic downgrade -1
```

---

## API Endpoints

All endpoints are prefixed with `/api`. Interactive docs at `/docs`.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user (name, email, password) |
| `POST` | `/api/auth/jwt/login` | Public | Login — returns cookie-based JWT |
| `POST` | `/api/auth/jwt/logout` | JWT | Logout |
| `GET` | `/api/users/me` | JWT | Get current user profile |

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/products/` | Public | List products (paginated, searchable by title, filterable by rating) |
| `GET` | `/api/products/{id}` | Public | Get product details with all reviews and user names |

### Reviews

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/reviews/` | JWT | Create a review (rating 1–5, comment) |
| `GET` | `/api/reviews/me` | JWT | Get current user's reviews (dashboard) |
| `PUT` | `/api/reviews/{id}` | JWT | Update own review |
| `DELETE` | `/api/reviews/{id}` | JWT | Delete own review |

### Admin (Superuser Only)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/products` | Admin | List all products |
| `POST` | `/api/admin/products` | Admin | Create a product |
| `DELETE` | `/api/admin/products/{id}` | Admin | Delete a product (cascades) |
| `GET` | `/api/admin/reviews` | Admin | List all reviews |
| `DELETE` | `/api/admin/reviews/{id}` | Admin | Delete any review |

---

## Getting Started

### Prerequisites

- **Python 3.12+**
- **Node.js 18.18+**
- **PostgreSQL** (local or hosted like Supabase)
- **uv** ([install](https://docs.astral.sh/uv/))
- **pnpm** ([install](https://pnpm.io/installation))

### 1. Clone

```bash
git clone https://github.com/mdnaimur0/product-review-hub.git
cd product-review-hub
```

### 2. Backend

```bash
cd backend
uv venv && uv sync
cp .env.example .env   # edit with your DB URL and secret key
alembic upgrade head
python scripts/seed_products.py   # seed 10 sample products (optional)
uvicorn app.main:app --reload
```

Backend → `http://localhost:8000` | API docs → `http://localhost:8000/docs`

### 3. Frontend

```bash
cd frontend
pnpm install
cp .env.example .env   # edit if backend runs elsewhere
pnpm dev
```

Frontend → `http://localhost:3000`

### 4. Admin User

Register via the UI, then promote:

```sql
UPDATE "user" SET is_superuser = true WHERE email = 'admin@example.com';
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/product_review_hub
ACCESS_SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_SECONDS=3600
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=["http://localhost:3000"]
```

### Frontend (`frontend/.env`)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

---

## Testing

### Backend (pytest + async fixtures)

Uses an in-memory SQLite database — no PostgreSQL needed.

```bash
cd backend
pytest
```

### Frontend (Vitest + MSW)

```bash
cd frontend
pnpm test          # run once
pnpm test:watch    # watch mode
```

---

## Improvements Beyond the Original Spec

The PRD requested a basic review platform. The following were built as enhancements:

| Area | PRD Required | What Was Built |
|---|---|---|
| Product listing | Basic list | Paginated grid with **search** and **rating filter** |
| Star rating | Static 1–5 input | **Interactive stars** with hover preview and click-to-rate |
| Authentication | Basic register/login | **Cookie-based JWT**, user roles (user/admin), verification flags |
| User management | Just `id`, `name`, `email` | **UUID primary keys**, `is_superuser`, `is_active`, `is_verified`, timestamps |
| Admin panel | Bonus — add/remove products | Full admin CRUD: create/delete products, **list & moderate all reviews** |
| User dashboard | Not mentioned | **"My Reviews" page** — edit/delete own reviews |
| Loading UX | "Proper loading handling" | **Skeleton loaders** on cards, product detail, and review lists |
| Error handling | "Proper error handling" | **Retry-capable error alerts** + **toast notifications** |
| Database | Basic tables | **Migrations (Alembic)**, **seed script**, cascade deletes, unique constraints |
| Package management | Not specified | **pnpm** (faster installs), **uv** (blazing-fast Python dependency management) |
| Async | Not specified | **Fully async** — asyncpg + async SQLAlchemy 2.x + async pytest fixtures |
| Tests | Not specified | **Backend:** pytest with async fixtures, isolated SQLite DB; **Frontend:** Vitest + **MSW** mock service worker |
| CI/CD | Not specified | Ready for Vercel (frontend) + Render (backend) deployment |

---

## License

MIT
