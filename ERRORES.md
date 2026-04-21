# Errores y Soluciones

---

## Error: Editar vehículo retorna datos incorrectos

### Fecha: 20 Abril 2026

### Síntomas
- Al hacer clic en "Editar" de un vehículo (ej: HTFC36), se abre el modal con datos de otro vehículo (ej: TYTD76)

### Causa Raíz
La función `DB.get` pasaba el `id` pero `apiCall` no lo usaba para consultas GET, solo para PATCH/DELETE. поэтому siempre devolvía el primer registro.

### Solución
Modificar `apiCall` para usar el ID en queries GET:

```javascript
if (method === 'GET') {
  if (id) {
    url += '?id=eq.' + id;
  } else if (filters) {
    url += '?' + new URLSearchParams(filters).toString();
  }
}
```

### Commits relacionados
- `80bf2c2` - Fix: DB.get ahora pasa ID correctamente para GET
- `11b2405` - Fix: PATCH con WHERE clause
- `19a2690` - Fix: manejar respuesta vacía en PATCH

---

## Error: JWT expired - No se puede guardar

### Fecha: 19 Abril 2026

### Síntomas
- Error en consola: "JWT expired"
- No se pueden guardar checklists ni órdenes

### Causa Raíz
El token JWT de Supabase expira después de cierto tiempo y la app no lo renueva automáticamente.

### Solución
Agregar lógica de fallback en `apiCall` para usar anon key cuando el token expire, y modificaciones en políticas RLS temporalmente para permitir inserción sin JWT válido.

### Commits relacionados
- `55b2d82` - fix: syntax error blocking login

---

## Mejora: Formatos de Impresión

### Fecha: 20 Abril 2026

### Descripción
Los botones de imprimir en Órdenes, Checklist y Actas ahora abren documentos profesionales formateados en nuevas ventanas, listos para guardar como PDF.

### Implementación
- **Orden de Trabajo**: Tabla con info del cliente/vehículo, lista de trabajos, observaciones y espacio para firmas
- **Checklist**: 2 columnas para que todo caiga en 1 página, incluye fotos si existen
- **Acta**: Formato formal con trabajos realizados y datos de recepción

### Características
- Diseño profesional con tablas bordes
- Espacios para firmas
- CSS optimizado para impresión
- Responsive para que todo/caiga en 1 página

### Commits relacionados
- `a472f1f` - Mejora formatos de impresión
- `20ff9a6` - Checklist en 2 columnas
- `4582e7d` - Checklist con fotos y formato compacto

---

## Error: "Verificando conexión..." stuck - No funciona el login

### Fecha: 11-12 Abril 2026

### Síntomas
- La app muestra "Verificando conexión..." infinitamente
- Error en consola del navegador: `Uncaught ReferenceError: doLogin is not defined`
- Error: `Uncaught SyntaxError: missing ) after argument list`
- El botón "Ingresar al sistema" no responde

### Causa Raíz
**Vercel Deployment Protection estaba habilitado**

Vercel tiene una característica de seguridad que requiere autenticación para acceder al sitio por defecto. Esto hace que el navegador muestre una página de autenticación de Vercel en lugar del código real de la app.

### Solución

1. Ir a **Vercel Dashboard → Settings → General → Deployment Protection**
2. Desactivar **"Vercel Authentication"** (quitar el toggle)
3. También se puede encontrar en **Settings → Security**

### Importante
- El código de la app **nunca estuvo mal**
- Los cambios de cache, funciones helper, etc. no causaron el problema
- El error de sintaxis JS era un falso positivo porque el navegador no podía cargar el código correctamente

### Cómo verificar
```bash
curl -I https://proyecto-eao-evigueras-projects.vercel.app/
# Si devuelve HTTP 401 -> La protección está activa
# Si devuelve HTTP 200 -> La protección está desactivada
```

### Lección Aprendida
Siempre verificar si el hosting está bloqueado antes de debuggear el código de la aplicación.