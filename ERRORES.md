# Errores y Soluciones

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