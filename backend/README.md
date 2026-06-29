# Product Review Hub — Backend

REST API backend for the Product Review Hub platform. Built with FastAPI, SQLAlchemy 2.x (async), PostgreSQL, and fastapi-users for authentication.

## Tech Stack

| Component | Technology |
|---|---|
| Framework | FastAPI |
| ORM | SQLAlchemy 2.x (async) |
| Database | PostgreSQL (asyncpg) |
| Migrations | Alembic |
| Auth | fastapi-users (JWT) |
| Package Manager | uv |
| Python | 3.12 |

## Prerequisites

- Python 3.12+
- PostgreSQL (or a Supabase project)
- [uv](https://docs.astral.sh/uv/) package manager

## Setup

### 1. Clone and install dependencies

```bash
cd backend
uv venv
uv pip install -e ".[dev]"
```

Or use the lockfile:

```bash
uv sync
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/product_review_hub
ACCESS_SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_SECONDS=3600
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=["http://localhost:3000"]
```

> **Note:** The `DATABASE_URL` must use the `postgresql+asyncpg://` scheme for async PostgreSQL support.

### 3. Run database migrations

```bash
alembic upgrade head
```

This creates the `user`, `product`, and `review` tables.

### 4. Seed sample data (optional)

```bash
python scripts/seed_products.py
```

Fetches 25 sample products from [dummyjson.com](https://dummyjson.com).

### 5. Start the development server

```bash
uvicorn app.main:app --reload
```

The API is available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

## Running Tests

Tests use an in-memory SQLite database — no PostgreSQL instance required.

```bash
pytest
```

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app factory, middleware, router mounting
│   ├── config.py            # Settings via pydantic-settings
│   ├── database.py          # Async engine, session factory, Base
│   ├── models.py            # ORM models: User, Product, Review
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── dependencies.py      # Auth guards and dependency injection
│   ├── users.py             # fastapi-users integration (auth, JWT, UserManager)
│   ├── utils.py             # Route ID generation utility
│   └── routers/
│       ├── products.py      # Public product endpoints
│       ├── reviews.py       # Authenticated review endpoints
│       └── admin.py         # Admin-only endpoints
├── alembic/                 # Database migrations
│   └── versions/            # Migration history
├── scripts/
│   └── seed_products.py     # Product seeding script
├── tests/
│   ├── conftest.py          # Test fixtures (in-memory SQLite)
│   ├── test_products.py     # Product endpoint tests
│   ├── test_reviews.py      # Review endpoint tests
│   └── test_admin.py        # Admin endpoint tests
├── alembic.ini              # Alembic configuration
├── pyproject.toml           # Project metadata and dependencies
└── .env.example             # Environment variable template
```

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/jwt/login` | Public | Login, returns JWT token |
| `GET` | `/api/users/me` | JWT | Get current user profile |
| `PATCH` | `/api/users/me` | JWT | Update current user |
| `DELETE` | `/api/users/me` | JWT | Delete current user |

### Products (Public)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/products/` | Public | List products (paginated, searchable) |
| `GET` | `/api/products/{id}` | Public | Get product detail with reviews |

**Query parameters:**
- `search` — filter by title (case-insensitive)
- `min_rating` / `max_rating` — filter by average rating (0–5)
- `page` (default: 1), `page_size` (default: 10, max: 100)

### Reviews (Authenticated)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/reviews/` | JWT | Create a review |
| `GET` | `/api/reviews/me` | JWT | Get current user's reviews |
| `PUT` | `/api/reviews/{id}` | JWT | Update own review |
| `DELETE` | `/api/reviews/{id}` | JWT | Delete own review |

Reviews require a rating of 1–5. Users can only modify their own reviews.

### Admin (Superuser Only)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/products` | Admin | List all products |
| `POST` | `/api/admin/products` | Admin | Create a product |
| `DELETE` | `/api/admin/products/{id}` | Admin | Delete a product (cascades reviews) |
| `GET` | `/api/admin/reviews` | Admin | List all reviews |
| `DELETE` | `/api/admin/reviews/{id}` | Admin | Delete any review |

Admin access requires `is_superuser=True` on the user account.

## Authentication

1. Register via `POST /api/auth/register` with `email`, `password`, and `name`.
2. Login via `POST /api/auth/jwt/login` (form-encoded: `username` = email, `password`).
3. Include the returned token as `Authorization: Bearer <token>` on protected routes.

**Password rules:** min 8 chars, at least one uppercase letter, one special character, must not contain your email.

## Database Schema

- **user** — `id` (UUID), `email`, `hashed_password`, `name`, `is_superuser`, `is_active`, `is_verified`
- **product** — `id` (int), `title`, `description`, `image_url`, `created_at`
- **review** — `id` (int), `product_id` (FK), `user_id` (FK), `rating` (1–5), `comment`, `created_at`

Deleting a product cascades to remove all its reviews.
