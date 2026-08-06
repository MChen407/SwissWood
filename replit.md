# SwissWood — E-commerce Bois de Chauffage & Fourneaux

## Project overview

A Vue 3 + TypeScript + Vite e-commerce web application for SwissWood, a Swiss premium firewood and stove specialist. The app is built in French and includes:

- Product catalogue with filtering by wood essence (Teck, Iroko, Pin, Sapin)
- Cart, checkout, and payment flows
- Customer dashboard (orders, favorites, profile)
- Admin panel (products, orders, clients, payments, reviews, CMS)
- Multi-currency support (EUR / USD / FCFA)
- Supabase for auth and database

## Stack

- **Frontend:** Vue 3, TypeScript, Vite
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite`)
- **State:** Pinia + pinia-plugin-persistedstate
- **Router:** Vue Router 4
- **Backend/DB:** Supabase (PostgreSQL + Auth)
- **Icons:** lucide-vue-next
- **Fonts:** Fraunces (display) + Inter (body) via Google Fonts

## Running the project

```bash
npm run dev   # starts dev server on port 5000
npm run build # type-check + production build
```

## Required environment variables

Set these in Replit Secrets before running against a real Supabase project:

| Key | Description |
|-----|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

Without these, the UI renders but all data calls will fail silently.

## Brand & design

Follows the **SwissWood Charte Graphique** (see `attached_assets/SwissWood-Charte-Graphique_*.md`):

- **Primary dark:** `#4A2C1A` (headers, footer, logo)
- **Primary mid:** `#6B4226` (nav, titles, links)
- **Secondary/sand:** `#C89B5D` / `#E8D4A8`
- **CTA red:** `#B23A2E` (buttons — only one on screen at a time)
- **Background:** `#FAF7F2`
- **Typography:** Fraunces (headings) + Inter (body)

## User preferences

- Keep all existing French-language routes and copy
- Maintain the existing file structure — components, pages, stores, router
- Brand name is **SwissWood** (not Arbora)
