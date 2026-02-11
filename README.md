# IA Landing Page - MVP

Landing page generator powered by AI.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **AI:** OpenAI API
- **Deploy:** Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Setup environment variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Then fill in your credentials.

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (auth)/           # Auth pages (login, signup)
│   ├── (dashboard)/      # Protected pages
│   └── preview/          # Landing page preview
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── landing-page/     # Landing page sections
│   ├── forms/            # Forms
│   └── layout/           # Layout components
├── lib/                   # Utilities & integrations
│   ├── supabase/         # Supabase client
│   ├── openai/           # OpenAI integration
│   ├── export/           # Export functionality
│   └── rate-limit/       # Rate limiting
└── types/                 # TypeScript types
```

## Next Steps

- Configure Supabase (Etapa 3)
- Setup database schema (Etapa 4)
- Implement AI generation (Etapa 5)

---

Built with ❤️ using Next.js and OpenAI
