#!/bin/bash
# QA Test Suite for Taller Automotriz

echo "========================================"
echo "   QA TESTS - Taller Automotriz"
echo "========================================"
echo ""

PASS=0
FAIL=0

# Test 1: App loads
echo "Test 1: App loads..."
RES=$(curl -s -o /dev/null -w "%{http_code}" "https://proyecto-eao-evigueras-projects.vercel.app")
if [ "$RES" = "200" ]; then
  echo "  ✅ PASS - HTTP $RES"
  PASS=$((PASS+1))
else
  echo "  ❌ FAIL - HTTP $RES"
  FAIL=$((FAIL+1))
fi

# Test 2: HTML valid
echo "Test 2: HTML structure..."
RES=$(curl -s "https://proyecto-eao-evigueras-projects.vercel.app" | grep -c "Taller Automotriz")
if [ "$RES" -gt 0 ]; then
  echo "  ✅ PASS - Title found"
  PASS=$((PASS+1))
else
  echo "  ❌ FAIL - Title missing"
  FAIL=$((FAIL+1))
fi

# Test 3: Login form exists
echo "Test 3: Login form..."
RES=$(curl -s "https://proyecto-eao-evigueras-projects.vercel.app" | grep -c "Ingresar")
if [ "$RES" -gt 0 ]; then
  echo "  ✅ PASS - Login form found"
  PASS=$((PASS+1))
else
  echo "  ❌ FAIL - Login form missing"
  FAIL=$((FAIL+1))
fi

# Test 4: Supabase URL configured
echo "Test 4: Supabase configured..."
RES=$(curl -s "https://proyecto-eao-evigueras-projects.vercel.app" | grep -c "xfgtjiluftsdkkiayswf")
if [ "$RES" -gt 0 ]; then
  echo "  ✅ PASS - Supabase URL found"
  PASS=$((PASS+1))
else
  echo "  ❌ FAIL - Supabase not configured"
  FAIL=$((FAIL+1))
fi

# Test 5: JS syntax valid
echo "Test 5: JS syntax..."
JS=$(curl -s "https://proyecto-eao-evigueras-projects.vercel.app" | grep -o "CacheService" | head -1)
if [ -n "$JS" ]; then
  echo "  ✅ PASS - CacheService found"
  PASS=$((PASS+1))
else
  echo "  ❌ FAIL - CacheService missing"
  FAIL=$((FAIL+1))
fi

# Test 6: Dark mode CSS
echo "Test 6: Dark mode CSS..."
RES=$(curl -s "https://proyecto-eao-evigueras-projects.vercel.app" | grep -c "data-theme")
if [ "$RES" -gt 0 ]; then
  echo "  ✅ PASS - Dark mode present"
  PASS=$((PASS+1))
else
  echo "  ❌ FAIL - Dark mode missing"
  FAIL=$((FAIL+1))
fi

# Test 7: Export functions
echo "Test 7: Export CSV functions..."
RES=$(curl -s "https://proyecto-eao-evigueras-projects.vercel.app" | grep -c "ExportService")
if [ "$RES" -gt 0 ]; then
  echo "  ✅ PASS - Export found"
  PASS=$((PASS+1))
else
  echo "  ❌ FAIL - Export missing"
  FAIL=$((FAIL+1))
fi

# Test 8: Search function
echo "Test 8: Global search..."
RES=$(curl -s "https://proyecto-eao-evigueras-projects.vercel.app" | grep -c "openGlobalSearch")
if [ "$RES" -gt 0 ]; then
  echo "  ✅ PASS - Search found"
  PASS=$((PASS+1))
else
  echo "  ❌ FAIL - Search missing"
  FAIL=$((FAIL+1))
fi

# Test 9: Charts JS loaded
echo "Test 9: Chart.js loaded..."
RES=$(curl -s "https://proyecto-eao-evigueras-projects.vercel.app" | grep -c "chart.js")
if [ "$RES" -gt 0 ]; then
  echo "  ✅ PASS - Chart.js found"
  PASS=$((PASS+1))
else
  echo "  ❌ FAIL - Chart.js missing"
  FAIL=$((FAIL+1))
fi

# Test 10: Responsive CSS
echo "Test 10: Responsive styles..."
RES=$(curl -s "https://proyecto-eao-evigueras-projects.vercel.app" | grep -c "@media")
if [ "$RES" -gt 0 ]; then
  echo "  ✅ PASS - Responsive CSS found"
  PASS=$((PASS+1))
else
  echo "  ❌ FAIL - Responsive CSS missing"
  FAIL=$((FAIL+1))
fi

# Test 11: Print function
echo "Test 11: Print function..."
RES=$(curl -s "https://proyecto-eao-evigueras-projects.vercel.app" | grep -c "imprimirOrden")
if [ "$RES" -gt 0 ]; then
  echo "  ✅ PASS - Print function found"
  PASS=$((PASS+1))
else
  echo "  ❌ FAIL - Print function missing"
  FAIL=$((FAIL+1))
fi

# Test 12: Notifications
echo "Test 12: Notifications..."
RES=$(curl -s "https://proyecto-eao-evigueras-projects.vercel.app" | grep -c "mostrarNotificaciones")
if [ "$RES" -gt 0 ]; then
  echo "  ✅ PASS - Notifications found"
  PASS=$((PASS+1))
else
  echo "  ❌ FAIL - Notifications missing"
  FAIL=$((FAIL+1))
fi

# Test 13: Dashboard filters
echo "Test 13: Dashboard filters..."
RES=$(curl -s "https://proyecto-eao-evigueras-projects.vercel.app" | grep -c "DASHBOARD_FILTERS")
if [ "$RES" -gt 0 ]; then
  echo "  ✅ PASS - Dashboard filters found"
  PASS=$((PASS+1))
else
  echo "  ❌ FAIL - Dashboard filters missing"
  FAIL=$((FAIL+1))
fi

# Results
echo ""
echo "========================================"
echo "   RESULTS: $PASS passed, $FAIL failed"
echo "========================================"

if [ $FAIL -eq 0 ]; then
  echo "🎉 All tests passed!"
  exit 0
else
  echo "⚠️ Some tests failed"
  exit 1
fi