# upgraded-carnival
# NGO Command Center

A production-ready web application for NGO crisis management and coordination, built with Next.js, TypeScript, Tailwind CSS, Prisma, and SQLite.

## Features

- **Authentication**: Login/Register with role-based access (Admin & Member)
- **Dashboard**: Real-time resource tracking with task statistics
- **Command Center Heatmap**: Interactive geospatial visualization (Admin only)
- **LLM & Database Management**: AI-powered task priority assignment and CRUD interface

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4 (flat warm-toned design system)
- **Maps**: React-Leaflet
- **Backend**: Next.js API Routes
- **Database**: Prisma 7 + SQLite (via libsql adapter)
- **Auth**: Custom session-based auth with bcrypt

## Getting Started

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev

# Start development server
npm run dev
```

## Design System

- Warm whites (`#faf8f5`) for backgrounds
- Earthy beige (`#f0ebe3`) for cards
- Muted terracotta (`#c1704a`) for primary actions
- Dark charcoal (`#2c2c2c`) for text
- **No gradients** — flat colors only

## Default Credentials (after seeding)

Register via `/register` to create your first Admin account.
