# IA Profesor Frontend (Next.js)

Frontend de IA Profesor con App Router y UI enfocada en experiencia educativa.

## Tecnologias
- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- Framer Motion
- Supabase JS (auth y sesiones)

## Estructura
- `app/` rutas y layouts
- `components/` UI y secciones
- `lib/` clientes, tipos y helpers
- `context/` auth provider
- `public/` assets

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`

## Variables de entorno (ejemplo)
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_BASE_URL`

## Deploy (Vercel)
- Build automatico con `npm run build`
- Configurar variables `NEXT_PUBLIC_*`

## Nota
Incluye dashboard, tutor IA con streaming, learning paths, logros y analiticas.
