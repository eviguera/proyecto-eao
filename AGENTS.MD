# TALLER AUTOMOTRIZ — Agent Context

> Software de gestión para taller automotriz con arquitectura segura.

## Project Identity

| Field | Value |
|-------|-------|
| **Name** | Taller Automotriz |
| **Type** | Frontend (Single Page App) |
| **Language** | HTML5 / Vanilla JavaScript |
| **Framework** | None (Vanilla JS + Supabase SDK) |

## Purpose

Software de gestión para taller automotriz que permite administrar vehículos, órdenes de trabajo, inventario de insumos, checklists de recepción, actas y gestión interna de pagos. Usa Supabase como backend con autenticación segura y Row Level Security.

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  Supabase   │────▶│ PostgreSQL  │
│  (HTML/JS)  │     │   (Auth/REST)     │             │
└─────────────┘     └─────────────────────┘
         │
         └──────────▶ Edge Functions (seguridad)
```

## Key Directories

```
app-eao/
├── index.html           # App principal (monolítico)
├── test.html            # Suite de pruebas
├── test-data.html       # Datos demo
├── vercel.json          # Config Vercel
├── package.json         # Dependencias
├── AGENTS.md           # Este archivo
└── supabase/
    ├── migration.sql    # Schema DB
    └── functions/       # Edge Functions
```

## Development Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Deploy to Vercel
npx vercel --prod

# Lint (pendiente agregar)
```

## Code Conventions

- [Funciones: camelCase, prefijos semánticos (db*, api*, render*, show*)]
- [Constantes: UPPER_SNAKE_CASE]
- [HTML: clases CSS con prefijos (btn-, card-, modal-)]
- [Evitar globals, usar IIFE]
- [Sempre usar template literals para strings HTML]

## Integration Points

| Service | Purpose | Docs |
|---------|---------|------|
| Supabase Auth | Autenticación usuarios | https://supabase.com/docs |
| Supabase REST | API de datos | https://supabase.com/docs |
| Vercel | Hosting y deployment | https://vercel.com |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| SUPABASE_URL | URL del proyecto Supabase | Yes |
| SUPABASE_ANON_KEY | Clave pública anon | Yes |

## Common Tasks

### Agregar nueva página
1. Agregar entrada en `PAGES` object
2. Crear función `renderPageName()` 
3. Agregar caso en función `go()`

### Ejecutar migración SQL
1. Ir a Supabase Dashboard → SQL Editor
2. Copiar contenido de `supabase/migration.sql`
3. Ejecutar

### Deploy a producción
```bash
npm run dev  # desarrollo local
git add . && git commit -m "descripción" && git push  # deploy automático en Vercel
```

---

*This template is part of the claude-core kit. For behavioral rules,
see `.claude/CLAUDE.md`.*
