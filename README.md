# QRCanvasPlatform

A modern QR code canvas platform built with **Vue 3**, **Vite**, **Express**, **PostgreSQL**, and **Prisma ORM**. Deployable to Vercel.

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite + Pinia + Vue Router + Tailwind CSS
- **Backend**: Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT with HttpOnly cookies
- **Deployment**: Vercel (serverless functions)

## Project Structure

```
QRCanvasPlatformLc/
├── src/                    # Frontend source
│   ├── components/         # Vue components
│   │   ├── ui/            # Base UI components (Button, Card)
│   │   ├── layout/        # Layout components (Header, Footer)
│   │   ├── editor/        # Editor components (Toolbar, Canvas, Panels)
│   │   └── sidebar/       # Sidebar components (ImageLibrary)
│   ├── composables/       # Vue composables (useCanvas, useTheme)
│   ├── router/            # Vue Router configuration
│   ├── services/          # API services
│   ├── stores/            # Pinia stores (auth, pages)
│   ├── types/             # TypeScript types
│   ├── views/             # Page views
│   │   ├── auth/          # Login, Register
│   │   ├── home/          # Dashboard
│   │   ├── pages/         # Editor, Show
│   │   └── qr/            # Love Declaration QR
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── server/                 # Backend source
│   ├── index.ts           # Main server (local dev)
│   └── vercel.ts          # Vercel serverless entry
├── prisma/                # Prisma schema
│   └── schema.prisma
├── dist/                  # Build output
├── public/                # Static assets
├── .env                   # Environment variables
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vercel.json
└── README.md
```

## Features

- 🔐 **Authentication**: Register, Login, JWT tokens in HttpOnly cookies
- 📝 **Page Editor**: Drag-and-drop canvas editor with multiple card support
- 🎨 **Elements**: Text, Images, Shapes, QR Codes, Navigation, Carousels
- 📱 **Templates**: Pre-built templates (Birthday, Wedding, Love Letter)
- 🔗 **QR Generation**: Dynamic QR codes with customization
- 🌙 **Dark Mode**: System-aware with manual toggle
- 📄 **Public Pages**: Shareable public page views with print support

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- pnpm (recommended) or npm

### Installation

1. **Clone and install dependencies**
   ```bash
   cd QRCanvasPlatformLc
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and secrets
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Or run migrations
   npm run db:migrate
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```
   This starts both frontend (port 5173) and backend (port 3000) concurrently.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret for JWT signing | Required |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `PORT` | Backend port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Database Schema

The Prisma schema includes:
- **User**: id, uuid, name, email, password, timestamps
- **Page**: id, uuid, title, slug, elements (JSON), canvases (JSON), background, status, userId
- **Media**: Spatie Media Library compatible table
- **Cache, Job, Session**: Laravel-compatible tables

## Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Frontend only (Vite)
npm run dev:backend      # Backend only (tsx watch)

# Building
npm run build            # Build both frontend and backend
npm run build:frontend   # Build frontend (Vite)
npm run build:backend    # Build backend (tsc)

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio

# Other
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run test             # Run Vitest
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Pages
- `GET /api/pages` - List user's pages
- `GET /api/pages/:uuid` - Get public page
- `POST /api/pages` - Create page
- `PUT /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page
- `POST /api/pages/:id/toggle-status` - Toggle page status
- `GET /api/templates` - List templates
- `POST /api/pages/from-template/:templateId` - Create from template

### QR Codes
- `POST /api/qr/generate` - Generate QR code

## Deployment to Vercel

1. **Push to GitHub**

2. **Import in Vercel**
   - Connect your repository
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist/client`

3. **Environment Variables**
   Add in Vercel dashboard:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `JWT_SECRET` (strong random string)
   - `NODE_ENV=production`
   - `FRONTEND_URL` (your Vercel domain)

4. **Database**
   - Use Vercel Postgres, Neon, Supabase, or any PostgreSQL provider
   - Run `prisma migrate deploy` after deployment

## Key Differences from Laravel Version

| Laravel | This Version |
|---------|--------------|
| Inertia.js | Vue Router + Pinia |
| Laravel Auth | JWT + HttpOnly cookies |
| Eloquent ORM | Prisma ORM |
| Blade/Vue SFC | Pure Vue SFC |
| Vite + Laravel plugin | Pure Vite |
| PHP/Composer | Node.js/Express |

## Migration Notes

This is a complete rewrite from the Laravel + Inertia version to a pure JavaScript/TypeScript stack. All features have been preserved:

- ✅ User authentication (register/login/logout)
- ✅ Page CRUD with multi-canvas support
- ✅ Drag-and-drop editor with 7 element types
- ✅ Template system
- ✅ QR code generation
- ✅ Public page viewing with print
- ✅ Dark mode
- ✅ Responsive design

## License

MIT