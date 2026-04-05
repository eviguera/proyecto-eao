import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const periodo = url.searchParams.get('periodo') || 'mes'

    let fechaInicio = new Date()
    if (periodo === 'semana') {
      fechaInicio.setDate(fechaInicio.getDate() - 7)
    } else if (periodo === 'mes') {
      fechaInicio.setMonth(fechaInicio.getMonth() - 1)
    } else if (periodo === 'trimestre') {
      fechaInicio.setMonth(fechaInicio.getMonth() - 3)
    } else {
      fechaInicio.setFullYear(fechaInicio.getFullYear() - 1)
    }

    const [
      { data: gestionData },
      { data: ordenesData },
      { data: insumosData },
      { data: vehiculosData }
    ] = await Promise.all([
      supabase
        .from('gestion_interna')
        .select('*')
        .gte('fecha_recepcion', fechaInicio.toISOString().split('T')[0]),
      supabase
        .from('ordenes')
        .select('*')
        .gte('fecha', fechaInicio.toISOString().split('T')[0]),
      supabase.from('insumos').select('*'),
      supabase.from('vehiculos').select('*')
    ])

    const ventas = (gestionData || []).reduce((sum, g) => sum + (Number(g.valor_cobrado) || 0), 0)
    const costos = (gestionData || []).reduce((sum, g) => sum + (Number(g.costo_total) || 0), 0)
    const utilidad = ventas - costos
    const margen = ventas > 0 ? Math.round((utilidad / ventas) * 100) : 0

    const estadosOrden = (ordenesData || []).reduce((acc, o) => {
      acc[o.estado] = (acc[o.estado] || 0) + 1
      return acc
    }, {})

    const estadosPago = (gestionData || []).reduce((acc, g) => {
      acc[g.estado_pago] = (acc[g.estado_pago] || 0) + 1
      return acc
    }, {})

    const stockBajo = (insumosData || []).filter(i => 
      i.stock <= (i.minimo || 0)
    ).length

    const ventasPorMes = {}
    ;(gestionData || []).forEach(g => {
      if (g.fecha_recepcion) {
        const mes = g.fecha_recepcion.substring(0, 7)
        if (!ventasPorMes[mes]) ventasPorMes[mes] = 0
        ventasPorMes[mes] += Number(g.valor_cobrado) || 0
      }
    })

    const trabajosPopulares = {}
    ;(ordenesData || []).forEach(o => {
      ;(o.trabajos || []).forEach(t => {
        trabajosPopulares[t] = (trabajosPopulares[t] || 0) + 1
      })
    })
    const topTrabajos = Object.entries(trabajosPopulares)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))

    const resultado = {
      periodo,
      kpis: {
        ventas,
        costos,
        utilidad,
        margen,
        totalOrdenes: (ordenesData || []).length,
        ordenesActivas: Object.values(estadosOrden).reduce((a, b) => a + b, 0) - (estadosOrden['Entregado'] || 0),
        totalClientes: (vehiculosData || []).length,
        stockBajo
      },
      graficos: {
        estadosOrden,
        estadosPago,
        ventasPorMes,
        topTrabajos
      },
      recientes: {
        ordenes: (ordenesData || []).slice(0, 5),
        gestiones: (gestionData || []).slice(0, 5)
      }
    }

    return new Response(JSON.stringify(resultado), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
