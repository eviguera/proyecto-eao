# TALLER AUTOMOTRIZ — Agent Context

> Software de gestión para taller automotriz con arquitectura segura.

## Project Identity

| Field | Value |
|-------|-------|
| **Name** | Taller Automotriz |
| **Type** | Frontend (Single Page App) |
| **Language** | HTML5 / Vanilla JavaScript |
| **Framework** | None (Vanilla JS + Supabase SDK) |
| **Hosting** | Vercel |
| **Backend** | Supabase (PostgreSQL + Auth + Edge Functions) |

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
├── ERRORES.md          # Registro de errores y soluciones
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

## ⚠️ CHECKLIST DE DEBUGGING - Antes de asumir que el código está mal

Cuando la app no funciona, seguir este orden:

### 1. Verificar Deployment (Vercel)
```bash
# Verificar estado HTTP (si devuelve 401 -> está bloqueado)
curl -I https://proyecto-eao-evigueras-projects.vercel.app/

# Verificar que el contenido es el correcto
curl -s https://proyecto-eao-evigueras-projects.vercel.app/ | head -50
```

**Errores comunes de Vercel:**
- HTTP 401 → Deployment Protection activo → Ir a Settings → General → Deployment Protection → Desactivar
- HTTP 404 → Ruta no configurada → Revisar vercel.json
- HTTP 5xx → Error en el servidor → Ver logs de Vercel

### 2. Verificar Supabase
```bash
# Verificar que el proyecto está activo
# Ir a: https://supabase.com/dashboard

# Verificar tablas
# Ir a: Supabase Dashboard → Table Editor

# Verificar Edge Functions
supabase_list_edge_functions

# Verificar logs
supabase_get_logs (auth, api, edge-function)
```

**Errores comunes de Supabase:**
- Auth timeout → La verificación de sesión puede colgar → Usar DOMContentLoaded + setTimeout
- RLS bloqueando datos → Verificar políticas de acceso
- Edge Function fallando → Revisar logs

### 3. Verificar Código JS
```bash
# Extraer y validar sintaxis JS
node -e "
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const match = html.match(/<script>([\\s\\S]*?)<\\/script>/);
if (match) {
  try {
    new Function(match[1]);
    console.log('JS Syntax: OK');
  } catch(e) {
    console.log('JS Error:', e.message);
  }
}
"
```

### 4. Verificar en Navegador
- Abrir consola (F12) → Buscar errores rojos
- Revisar pestaña Network → Ver requests que fallan
- Revisar LocalStorage → Ver si hay sesión guardada

## Errores Conocidos y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| "Verificando conexión..." stuck | Vercel Deployment Protection activo | Settings → General → Deployment Protection → Desactivar |
| doLogin is not defined | Código no cargado (por protección de Vercel) | Misma solución anterior |
| HTTP 401 de Supabase | Proyecto pausado o clave incorrecta | Verificar proyecto activo en Supabase |
| Error de sintaxis JS | Caracteres especiales o código incompleto | Validar con new Function() |

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

### Debuggear problemas de login
1. Verificar Vercel no está bloqueado (curl -I)
2. Verificar Supabase está activo
3. Revisar logs de auth (supabase_get_logs)
4. Revisar Edge Function verificar-perfil
5. Verificar credenciales en tabla perfiles

---

*This template is part of the opencode kit. For behavioral rules,
see ``.*
