# Product Review Hub

A full-stack product review platform where users can browse products, submit star ratings and reviews, and admins can manage the catalog. Built with Next.js, FastAPI, and PostgreSQL.

## Live URLs

| Service | URL |
|---|---|
| Frontend (Next.js) | https://product-review-hub-frontend.vercel.app |
| Backend API (FastAPI) | https://product-review-hub-backend.onrender.com |
| API Documentation (Swagger) | https://product-review-hub-backend.onrender.com/docs |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui |
| Backend | FastAPI, Python 3.12, SQLAlchemy 2.x (async), Alembic |
| Database | PostgreSQL (asyncpg) |
| Authentication | fastapi-users with JWT |
| Package Managers | pnpm (frontend), uv (backend) |

## Project Structure

```
product-review-hub/
├── frontend/                 # Next.js application
│   ├── app/                  # App Router pages
│   ├── components/           # React components (shadcn/ui + custom)
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # API client, utilities, schemas
│   └── tests/                # Vitest + MSW component tests
├── backend/                  # FastAPI application
│   ├── app/                  # Application code (models, routes, schemas)
│   │   ├── routers/          # API route handlers
│   │   ├── models.py         # SQLAlchemy ORM models
│   │   └── schemas.py        # Pydantic request/response schemas
│   ├── alembic/              # Database migrations
│   ├── scripts/              # Seed script
│   └── tests/                # Pytest async tests
└── README.md
```

## Getting Started

### Prerequisites

- **Python 3.12+**
- **Node.js 18.18+**
- **PostgreSQL** (local or hosted like Supabase)
- **uv** ([install](https://docs.astral.sh/uv/))
- **pnpm** ([install](https://pnpm.io/installation))

### 1. Clone the repository

```bash
git clone https://github.com/your-username/product-review-hub.git
cd product-review-hub
```

### 2. Backend setup

```bash
cd backend

# Create virtual environment and install dependencies
uv venv
uv sync

# Configure environment
cp .env.example .env
# Edit .env with your database URL and secret key

# Run database migrations
alembic upgrade head

# Seed sample products (optional)
python scripts/seed_products.py

# Start the server
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`. Interactive API docs at `http://localhost:8000/docs`.

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env if backend runs on a different URL

# Start the dev server
pnpm dev
```

Frontend runs at `http://localhost:3000`.

### 4. Create an admin user (optional)

Register a user, then promote it to superuser via the database:

```sql
UPDATE "user" SET is_superuser = true WHERE email = 'admin@example.com';
```

Admin users can add/remove products and moderate reviews.

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

## Database Schema

| Table | Key Columns |
|---|---|
| **user** | `id` (UUID), `email`, `hashed_password`, `name`, `is_superuser`, `is_active`, `is_verified` |
| **product** | `id` (int), `title`, `description`, `image_url`, `created_at` |
| **review** | `id` (int), `product_id` (FK), `user_id` (FK), `rating` (1–5), `comment`, `created_at` |

Deleting a product cascades to remove all its reviews.

### Migrations

```bash
cd backend
alembic upgrade head    # Apply all migrations
alembic current         # Check current revision
alembic downgrade -1    # Rollback one step
```

## API Endpoints

All endpoints are prefixed with `/api`. Full interactive docs at `/docs`.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/jwt/login` | Public | Login (returns JWT) |
| `POST` | `/api/auth/jwt/logout` | JWT | Logout |
| `GET` | `/api/users/me` | JWT | Get current user |

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/products/` | Public | List products (paginated, searchable, filterable) |
| `GET` | `/api/products/{id}` | Public | Get product detail with reviews |

### Reviews

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/reviews/` | JWT | Create a review |
| `GET` | `/api/reviews/me` | JWT | Get current user's reviews |
| `PUT` | `/api/reviews/{id}` | JWT | Update own review |
| `DELETE` | `/api/reviews/{id}` | JWT | Delete own review |

### Admin (Superuser Only)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/products` | Admin | List all products |
| `POST` | `/api/admin/products` | Admin | Create a product |
| `DELETE` | `/api/admin/products/{id}` | Admin | Delete a product |
| `GET` | `/api/admin/reviews` | Admin | List all reviews |
| `DELETE` | `/api/admin/reviews/{id}` | Admin | Delete any review |

## Testing

### Backend

Tests use an in-memory SQLite database — no PostgreSQL needed.

```bash
cd backend
pytest
```

### Frontend

```bash
cd frontend
pnpm test        # Run once
pnpm test:watch  # Watch mode
```

## Features

- **Product browsing** — Paginated grid with search and rating filter
- **Star ratings** — Interactive 1–5 star input with hover preview
- **Review system** — Authenticated users can rate and comment
- **JWT authentication** — Register, login, logout with cookie-based tokens
- **User dashboard** — View and manage all your reviews
- **Admin panel** — Create/delete products, moderate reviews
- **Responsive UI** — Mobile-friendly with skeleton loaders
- **Error handling** — Retry-capable error alerts and toast notifications

## License

MIT
