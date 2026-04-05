# TALLER AUTOMOTRIZ v5.0 - Guía de Instalación Segura

## Cambios Importantes v5.0

### Seguridad Mejorada
- ✅ Autenticación con Supabase Auth (sin contraseñas hardcodeadas)
- ✅ Row Level Security (RLS) en todas las tablas
- ✅ API Proxy para proteger credenciales
- ✅ Validación de RUT chileno
- ✅ Roles: Admin y Lector

---

## PASOS DE MIGRACIÓN

### 1. Ejecutar Migración SQL en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Copia y pega el contenido de `supabase/migration.sql`
5. Ejecuta el script (clic en "Run")

### 2. Crear Primer Usuario Admin

El primer usuario que se registre tendrá rol `lector` por defecto.
Para hacerlo admin, ejecuta en SQL:

```sql
UPDATE perfiles 
SET rol = 'admin' 
WHERE email = 'tu-email@ejemplo.com';
```

O desde la interfaz de administración en la app.

### 3. Configurar Edge Functions (Opcional)

Las Edge Functions ya están creadas en `supabase/functions/`.
Se deployan automáticamente si usas Supabase CLI:

```bash
npm install -g supabase
supabase login
supabase functions deploy
```

### 4. Actualizar Variables de Entorno

En Supabase Dashboard → Settings → Edge Functions:
- `SUPABASE_URL`: Tu URL de proyecto
- `SUPABASE_SERVICE_ROLE_KEY`: Tu clave de servicio

---

## ESTRUCTURA DEL PROYECTO

```
app-eao/
├── index.html           # Aplicación principal
├── test.html            # Suite de pruebas
├── test-data.html       # Cargador de datos demo
├── supabase/
│   ├── migration.sql    # Migración de seguridad
│   └── functions/      # Edge Functions (API Proxy)
│       ├── api-proxy/
│       ├── auth/
│       ├── admin-users/
│       └── dashboard-stats/
└── README.md
```

---

## USUARIOS Y PERMISOS

| Rol | Permisos |
|-----|----------|
| **Admin** | Crear, editar, eliminar en todas las tablas |
| **Lector** | Solo lectura en todas las tablas |

### Registro de Nuevos Usuarios

1. Ve a la pantalla de login
2. Clic en "Registrarse"
3. Ingresa nombre, email y contraseña
4. Un admin debe cambiar su rol a "admin" desde el panel de administración

---

## ROLES EN LA BASE DE DATOS

| Tabla | Lectores | Admin |
|-------|----------|-------|
| vehiculos | SELECT | SELECT, INSERT, UPDATE, DELETE |
| ordenes | SELECT | SELECT, INSERT, UPDATE, DELETE |
| gestion_interna | SELECT | SELECT, INSERT, UPDATE, DELETE |
| checklists | SELECT | SELECT, INSERT, UPDATE, DELETE |
| actas | SELECT | SELECT, INSERT, UPDATE, DELETE |
| insumos | SELECT | SELECT, INSERT, UPDATE, DELETE |

---

## PROBAR HOY

### 1. Abrir test-data.html
- Verificar conexión a Supabase
- Cargar datos de prueba

### 2. Abrir test.html
- Ejecutar pruebas automatizadas

### 3. Abrir index.html
- Registrarse con nueva cuenta
- Iniciar sesión
- Probar todas las funcionalidades

---

## SOLUCIÓN DE PROBLEMAS

### Error: "Perfil no encontrado"
Ejecuta en SQL:
```sql
SELECT * FROM perfiles;
```
Si no hay resultados, el trigger de creación de perfil puede no haberse creado. Ejecuta:
```sql
SELECT auth.uid(), auth.jwt() FROM auth.users;
```

### Error: "Usuario desactivado"
Un admin debe activar tu usuario desde el panel de administración.

### Error de CORS en Edge Functions
Verifica que los headers CORS estén configurados correctamente en tu proyecto.

---

## BACKUP DE DATOS

El panel de administración incluye función de respaldo:
1. Ve a ⚙️ Administración → Respaldo
2. Exporta los datos en formato JSON

---

## AUTORES
- Eduardo Viguera
- Versión: 5.0 Secure
- Fecha: 2026
