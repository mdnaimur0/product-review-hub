# Product Review Hub — Frontend

A responsive product review platform built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, and shadcn/ui. Users can browse products, submit star ratings and reviews, manage their reviews from a dashboard, and admins can moderate products and reviews.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI Components | shadcn/ui (radix-nova style) |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Validation | Zod v4 |
| Toasts | Sonner |
| API Client | @hey-api/openapi-ts (auto-generated) |
| Testing | Vitest + Testing Library + MSW |
| Linting | ESLint (flat config) + Prettier |
| Package Manager | pnpm |

## Prerequisites

- Node.js 18.18+
- pnpm (package manager)
- The [backend API](../backend/README.md) running at `http://localhost:8000`

## Setup

### 1. Install dependencies

```bash
cd frontend
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` if your backend runs on a different URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 3. Start the development server

```bash
pnpm dev
```

The app is available at [http://localhost:3000](http://localhost:3000).

### 4. Regenerate the API client (optional)

If the backend's OpenAPI spec has changed, regenerate the TypeScript client:

```bash
pnpm generate-client
```

This fetches the schema from the backend and outputs types and SDK functions to `lib/api/`.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests once |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm format` | Format all files with Prettier |
| `pnpm generate-client` | Regenerate API client from backend OpenAPI spec |

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── actions.ts            # Server actions (register, login, logout)
│   │   ├── login/page.tsx        # Login page
│   │   └── register/page.tsx     # Register page
│   ├── dashboard/
│   │   ├── page.tsx              # User dashboard + admin panel
│   │   └── loading.tsx           # Dashboard skeleton loader
│   ├── products/[id]/
│   │   ├── page.tsx              # Product detail with reviews
│   │   └── loading.tsx           # Detail skeleton loader
│   ├── globals.css               # Tailwind + shadcn theme + animations
│   ├── layout.tsx                # Root layout (Geist + Inter fonts)
│   ├── not-found.tsx             # Custom 404 page
│   ├── page.tsx                  # Home page (product listing)
│   └── providers.tsx             # AuthProvider + Sonner Toaster
├── components/
│   ├── admin/                    # Admin CRUD components
│   ├── layout/                   # Navbar + Footer
│   ├── products/                 # ProductCard, ProductGrid
│   ├── reviews/                  # ReviewCard, ReviewForm, StarRating
│   ├── shared/                   # EmptyState, ErrorAlert
│   └── ui/                       # shadcn/ui primitives
├── hooks/                        # Custom React hooks
│   ├── useAuth.tsx               # Auth context + provider
│   ├── useProducts.ts            # Paginated product list
│   ├── useProduct.ts             # Single product detail
│   ├── useMyReviews.ts           # Current user's reviews
│   ├── useAdminProducts.ts       # Admin product CRUD
│   └── useAdminReviews.ts        # Admin review moderation
├── lib/
│   ├── api/                      # Auto-generated OpenAPI client
│   ├── api-config.ts             # Client config (base URL + cookie auth)
│   ├── schemas.ts                # Zod validation schemas
│   └── utils.ts                  # cn() helper + error utils
├── scripts/
│   └── generate-client.js        # API client generation script
├── tests/
│   ├── setup.ts                  # MSW server lifecycle
│   ├── mocks/handlers.ts         # Mock API handlers
│   └── components/               # Component unit tests
└── public/                       # Static assets
```

## Features

### Pages

| Route | Description |
|---|---|
| `/` | Product listing with search bar, min-rating filter, and pagination |
| `/products/[id]` | Product detail, average rating, review list, and review form |
| `/login` | Login with username + password |
| `/register` | Registration with name, email, and password |
| `/dashboard` | User's own reviews + admin panel (for superusers) |

### Core Functionality

- **Product browsing** — Paginated grid (12 per page) with search and rating filter
- **Star ratings** — Interactive 1–5 star input with hover preview
- **Review submission** — Authenticated users can rate and comment on products
- **JWT authentication** — Registration, login, logout via Server Actions with cookie-based token storage
- **User dashboard** — View and manage all your reviews
- **Admin panel** — Superusers can create/delete products and moderate/delete any review
- **Loading states** — Skeleton loaders for every page
- **Error handling** — Error alerts with retry and toast notifications
- **Responsive design** — Mobile-friendly with collapsible navigation
- **Dark mode** — CSS variable-based theme support

## Testing

Tests use Vitest with jsdom and MSW for API mocking.

```bash
pnpm test        # Run once
pnpm test:watch  # Watch mode
```

### Test coverage

- `ProductCard` — renders title, description, rating, review count, links
- `ReviewCard` — user name, avatar, comment, formatted date, stars
- `ReviewForm` — rating label, textarea, submit button, disabled state
- `ReviewList` — renders reviews and empty state
- `StarRating` — renders stars, fills correct count, onChange callback, readonly mode

## API Integration

The frontend consumes a FastAPI backend. The TypeScript API client is auto-generated from the backend's OpenAPI spec using `@hey-api/openapi-ts`.

### Key endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/products/` | Public | List products (paginated, searchable) |
| `GET` | `/api/products/{id}` | Public | Get product detail with reviews |
| `POST` | `/api/reviews/` | JWT | Create a review |
| `GET` | `/api/reviews/me` | JWT | Get current user's reviews |
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/jwt/login` | Public | Login, returns JWT |

Full API documentation is available at `http://localhost:8000/docs` when the backend is running.

## Linting & Formatting

```bash
pnpm lint     # ESLint (flat config with next/core-web-vitals + typescript)
pnpm format   # Prettier
```

## Deployment

The app is ready for deployment on [Vercel](https://vercel.com):

1. Push to a Git repository
2. Import the project on Vercel
3. Set the `NEXT_PUBLIC_API_BASE_URL` environment variable to your production backend URL
4. Deploy

Images are configured with `unoptimized: true` in `next.config.ts` for compatibility with non-Vercel environments.

## Related

- [Backend README](../backend/README.md) — FastAPI + PostgreSQL backend with full API docs
