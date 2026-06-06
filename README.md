# ShopNext

A high-performance, fully server-rendered e-commerce frontend built with Next.js 16 App Router, TypeScript strict mode, Tailwind CSS v4, and shadcn/ui.

---

## Live Demo

> Deploy to Vercel — see [Deployment](#deployment) section below.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.7 (App Router, Turbopack) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 + shadcn/ui (@base-ui/react) |
| State | Zustand (cart + UI) · TanStack Query v5 (server cache) |
| Auth | JWT via HttpOnly cookies · Next.js Server Actions |
| Animations | GSAP (product card stagger entrance) |
| Testing | Jest + React Testing Library (13 tests) |
| API | DummyJSON (https://dummyjson.com) |

---

## Features

### Authentication
- **Login** — credentials posted as a Server Action; JWT stored in an `HttpOnly` cookie (XSS-safe); non-sensitive display data in a readable cookie for the UI
- **Registration** — full validated form, posts to `POST /users/add`, redirects to login on success
- **Route protection** — `proxy.ts` (Next.js Middleware) guards all routes; unauthenticated users redirect to `/login` with a `callbackUrl`

### Product Catalogue
- **SSR with streaming** — `ProductsSection` is an async Server Component inside a **keyed Suspense boundary**. Key changes on every filter change → React immediately shows the skeleton while the server re-fetches. No full page reload, URL stays in sync.
- **ISR caching** — `fetch()` with `next: { revalidate: 300 }` caches API responses for 5 minutes

### Filtering & Search (Right Sticky Sidebar)
- **Search** — debounced 500 ms; the URL push (and the server re-fetch) is debounced, not the input display value
- **Price range slider** — dual-thumb slider; position updates local state instantly for a smooth drag; URL updates 600 ms after the user stops dragging ("debounce the action, not the value")
- **Category** — loaded from `/products/categories`
- **Sort by** — price · rating · name · discount · stock
- **Sort order** — ascending / descending
- **Items per page** — 8 / 12 / 20 / 40
- **Clear all** — resets all filters at once

### Product Details
- SSR page with `generateMetadata` for per-product OG tags
- Zoomable image gallery with cursor-tracked zoom (`scale-150`, `transform-origin` follows mouse)
- Clickable thumbnail strip (up to 5 images)
- Add to Cart with 2-second confirmation feedback

### Shopping Cart
- Zustand store
- shadcn Sheet slide-over with cart items, quantity controls, and total
- Add · remove · update quantity · clear cart

### UX Polish
- Rose-600 primary colour (oklch)
- DM Sans Google font
- Dark mode ready
- Fully responsive — sidebar collapses to top on mobile
- 404 and error boundary pages
- GSAP staggered entrance animation on product cards

---

## Setup Instructions

### Prerequisites
- Node.js 20+
- npm 10+

### Install & Run

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd task

# 2. Install dependencies
npm install

# 3. Start the development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

### Run Tests

```bash
npm test
```

---

## Environment Variables

No `.env` file is required. DummyJSON is a public API with no API key. For production:

```env
NODE_ENV=production
```

---

## Test Credentials

| Username | Password |
|---|---|
| `emilys` | `emilyspass` |
| `michaelw` | `michaelwpass` |
| `sophiab` | `sophiabpass` |

> **Note on Registration:** The registration form calls `POST /users/add` and demonstrates the complete registration flow (validation → API call → redirect with success message). Because DummyJSON is a mock API, newly created users are not persisted and cannot be used to authenticate — use the credentials above to sign in after registering.

---

## API — Postman Collection

### Option 1 — Import the bundled collection file

A ready-to-use Postman collection is included in this repository:

```
postman_collection.json
```

**Steps to import:**
1. Open **Postman**
2. Click **Import** (top-left corner)
3. Drag-and-drop `postman_collection.json` or select it via the file picker
4. The collection **"ShopNext — DummyJSON API"** will appear in your sidebar
5. Run **Auth → Login** first — the built-in test script automatically saves the returned `accessToken` as the `{{TOKEN}}` collection variable
6. All subsequent authenticated requests use `Bearer {{TOKEN}}` automatically

### Option 2 — Import from the official DummyJSON docs

1. Visit [https://dummyjson.com/docs](https://dummyjson.com/docs)
2. Click the **Run in Postman** button to import the full official collection

### Endpoints Used by This App

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/auth/login` | Authenticate — returns `accessToken` JWT |
| `GET` | `/auth/me` | Verify token / fetch current user |
| `POST` | `/users/add` | Register new user (mock) |
| `GET` | `/products` | All products with pagination + sort |
| `GET` | `/products/search?q=` | Full-text search |
| `GET` | `/products/:id` | Single product detail |
| `GET` | `/products/category/:slug` | Products by category |
| `GET` | `/products/categories` | All available categories |

---

## Project Structure

```
src/
├── app/
│   ├── actions/auth.ts          # Server Actions: loginAction · registerAction · logoutAction
│   ├── login/page.tsx           # Login page (SSR, shows success banner after registration)
│   ├── register/page.tsx        # Registration page (SSR)
│   ├── products/
│   │   ├── page.tsx             # Products listing (SSR + keyed Suspense streaming)
│   │   └── [id]/page.tsx        # Product detail (SSR + generateMetadata for OG)
│   ├── layout.tsx               # Root layout (fonts, providers, Toaster)
│   ├── not-found.tsx            # 404 page
│   ├── error.tsx                # Error boundary page
│   └── globals.css              # Tailwind v4 theme + rose primary CSS variables
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx        # useActionState form — no JS required
│   │   └── RegisterForm.tsx     # useActionState form with full validation
│   ├── cart/
│   │   └── CartSheet.tsx        # shadcn Sheet cart slide-over
│   ├── layout/
│   │   ├── Navbar.tsx           # Sticky nav (cart badge, logout, hides search on /products)
│   │   └── MainLayout.tsx       # Container wrapper
│   ├── products/
│   │   ├── ProductCard.tsx      # Card with GSAP stagger animation
│   │   ├── ProductGrid.tsx      # Responsive grid
│   │   ├── ProductSidebar.tsx   # Right sticky sidebar — all filters + debounced search/price
│   │   ├── ProductsSection.tsx  # Async Server Component (fetch + price filter + render)
│   │   ├── ProductPagination.tsx# Pure server component — builds pagination hrefs
│   │   ├── ProductImageGallery.tsx # Zoom gallery with cursor tracking
│   │   └── AddToCartButton.tsx  # Cart CTA with confirmation state
│   └── ui/                      # shadcn/ui primitives (Button, Card, Slider, Sheet, …)
├── hooks/
│   ├── useDebounce.ts           # Generic debounce hook
│   └── useProducts.ts           # TanStack Query hooks (useProducts, useCategories)
├── lib/
│   ├── api.ts                   # All DummyJSON fetch wrappers
│   ├── auth.ts                  # Cookie helpers (getAuthToken, isAuthenticated)
│   └── utils.ts                 # cn() Tailwind merge utility
├── store/
│   ├── cartStore.ts             # Zustand: items, quantities, sheet open/close
│   └── uiStore.ts               # Zustand: mobile menu
├── types/
│   ├── auth.ts                  # LoginCredentials · AuthUser · RegisterInput · RegisteredUser
│   ├── product.ts               # Product · ProductsResponse · Category · ProductFilters
│   └── index.ts                 # Re-export barrel
├── __tests__/
│   ├── ProductCard.test.tsx     # 8 unit tests
│   └── useDebounce.test.ts      # 5 unit tests
└── proxy.ts                     # Next.js Middleware — JWT route guard
```

---

## Performance Highlights

| Technique | Benefit |
|---|---|
| Async Server Components + Suspense | Zero client JS for data fetching on the products page |
| Keyed Suspense boundary | Instant skeleton feedback on every filter change, no full reload |
| ISR cache (`revalidate: 300`) | Repeated navigations served from cache in < 1 ms |
| Debounced URL updates | No server request on every keystroke or slider tick |
| In-memory price filtering | Single `limit=200` fetch when price filter active — no N+1 requests |
| `next/image` with remote patterns | Automatic WebP conversion, lazy loading, size hints |

---

## Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel        # preview
vercel --prod # production
```

Or connect the GitHub repository at [vercel.com/new](https://vercel.com/new) for automatic CI/CD.

---

## Evaluation Checklist

| Requirement | Status |
|---|---|
| User Registration | ✅ Full form, server validation, `POST /users/add` |
| JWT Authentication | ✅ HttpOnly cookie, 1-hour expiry |
| Token / caching management | ✅ ISR revalidate + TanStack Query staleTime |
| Product list — image, title, price, responsive cards | ✅ |
| Search by title | ✅ Debounced, URL-synced |
| Category filter | ✅ Loaded from API |
| Product details page — image, title, description, price, category | ✅ SSR |
| Loading states | ✅ shadcn Skeleton via Suspense |
| Error handling | ✅ Error boundary + 404 page |
| Mobile + desktop responsive | ✅ |
| Component-based architecture | ✅ |
| Clean, readable code | ✅ TypeScript strict mode |
| **Bonus** — State management | ✅ Zustand |
| **Bonus** — Unit tests | ✅ 13 tests (Jest + RTL) |
| **Bonus** — Pagination | ✅ Server-side, URL-based |
| **Bonus** — Tailwind CSS | ✅ v4 |
| **Bonus** — SSR with Next.js | ✅ App Router + Server Components |
#   p r o d u c t s - t a s k  
 