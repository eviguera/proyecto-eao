#!/bin/bash
# Script para deploy rápido a Vercel

echo "🚀 Taller Automotriz v5.0 - Deploy"
echo "=================================="

# Verificar que hay cambios para subir
if [ -z "$(git status --porcelain)" ]; then
  echo "✓ No hay cambios pendientes"
else
  echo "📦 Hay cambios. Subiendo a GitHub..."
  git add -A
  git commit -m "Update $(date '+%Y-%m-%d %H:%M')"
  git push origin main
fi

echo ""
echo "✅ Cambios subidos a GitHub"
echo "🌐 Vercel deployará automáticamente en ~30 segundos"
echo ""
echo "📋 URLs de tu aplicación:"
echo "   - App principal: https://proyecto-eao.vercel.app/"
echo "   - Tests: https://proyecto-eao.vercel.app/test"
echo "   - Datos demo: https://proyecto-eao.vercel.app/test-data"
echo ""
echo "💡 Tip: Si Vercel no inicia deploy, ve a vercel.com y verifica el proyecto"
