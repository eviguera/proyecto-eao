import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { table, method, filters, data, id } = await req.json()

    if (!table) {
      return new Response(JSON.stringify({ error: 'Tabla requerida' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let result

    switch (method) {
      case 'getAll':
        let query = supabase.from(table).select('*').order('id', { ascending: false }).limit(100)
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            query = query.eq(key, value)
          })
        }
        const { data: getData, error: getError } = await query
        if (getError) throw getError
        result = { data: getData }
        break

      case 'get':
        if (!id) throw new Error('ID requerido')
        const { data: singleData, error: singleError } = await supabase
          .from(table)
          .select('*')
          .eq('id', id)
          .single()
        if (singleError) throw singleError
        result = { data: singleData }
        break

      case 'add':
        if (!data) throw new Error('Datos requeridos')
        const { data: addData, error: addError } = await supabase
          .from(table)
          .insert([data])
          .select()
          .single()
        if (addError) throw addError
        result = { data: addData }
        break

      case 'update':
        if (!id || !data) throw new Error('ID y datos requeridos')
        const { data: updateData, error: updateError } = await supabase
          .from(table)
          .update(data)
          .eq('id', id)
          .select()
          .single()
        if (updateError) throw updateError
        result = { data: updateData }
        break

      case 'delete':
        if (!id) throw new Error('ID requerido')
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq('id', id)
        if (deleteError) throw deleteError
        result = { success: true }
        break

      default:
        return new Response(JSON.stringify({ error: 'Método no válido' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
