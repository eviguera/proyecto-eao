# TALLER AUTOMOTRIZ v5.0

Software de gestión para taller automotriz con arquitectura segura.

## 🚀 DEPLOY EN VERCEL (Automático)

### Opción 1: Deploy desde GitHub (Recomendado)

1. **Sube el proyecto a GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit v5.0"
   git remote add origin https://github.com/TU_USUARIO/proyecto-eao.git
   git push -u origin main
   ```

2. **Conecta con Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Clic en "New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente `vercel.json`
   - Clic en "Deploy"

3. **¡Listo!** Cada push a GitHub deployará automáticamente.

### Opción 2: Deploy con Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 📁 ESTRUCTURA DEL PROYECTO

```
├── index.html           # Aplicación principal
├── test.html            # Suite de pruebas
├── test-data.html       # Cargador de datos demo
├── vercel.json          # Configuración de deploy
├── package.json         # Dependencias
├── README.md            # Este archivo
├── INSTALACION.md      # Guía de instalación
└── supabase/
    ├── migration.sql    # Migración SQL (ejecutar en Supabase)
    └── functions/       # Edge Functions (opcional)
```

---

## ⚙️ CONFIGURACIÓN SUPABASE

### 1. Ejecutar Migración SQL

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto → **SQL Editor**
3. Copia y pega el contenido de `supabase/migration.sql`
4. Clic en **Run**

### 2. Crear Primer Usuario Admin

```sql
UPDATE perfiles 
SET rol = 'admin' 
WHERE email = 'tu-email@ejemplo.com';
```

---

## 🧪 PROBAR LA APLICACIÓN

Una vez deployado, accede a:

| URL | Descripción |
|-----|-------------|
| `https://tu-proyecto.vercel.app/` | App principal |
| `https://tu-proyecto.vercel.app/test` | Suite de pruebas |
| `https://tu-proyecto.vercel.app/test-data` | Datos de prueba |

---

## 🔐 SEGURIDAD v5.0

- ✅ Supabase Auth (sin contraseñas hardcodeadas)
- ✅ Row Level Security (RLS) en todas las tablas
- ✅ Roles: Admin / Lector
- ✅ Validación de RUT chileno
- ✅ Headers de seguridad configurados

---

## 📝 FLUJO DE TRABAJO

1. **Desarrolla** en tu máquina local
2. **Commit** tus cambios:
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push
   ```
3. **Vercel deploya automáticamente** en ~30 segundos
4. **Verifica** en producción

---

## 🔧 VARIABLES DE ENTORNO

No necesitas configurar variables - ya están en el código. 
Para producción, considera moverlas a Edge Functions si es necesario.

---

## 📍 Rancagua, Chile
## ⚙️ v5.0 Secure
## 🚀 Deploy with Vercel
