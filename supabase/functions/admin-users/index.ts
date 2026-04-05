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
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Token requerido' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: userData, error: userError } = await supabase.auth.getUser(token)
    if (userError) throw userError

    const { data: perfilAdmin } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', userData.user.id)
      .single()

    if (perfilAdmin?.rol !== 'admin') {
      return new Response(JSON.stringify({ error: 'Acceso denegado. Se requiere rol admin.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { action, userId, rol, activo } = await req.json()

    let result

    switch (action) {
      case 'list':
        const { data: perfiles, error: listError } = await supabase
          .from('perfiles')
          .select('*')
          .order('created_at', { ascending: false })
        if (listError) throw listError
        result = { data: perfiles }
        break

      case 'updateRol':
        if (!userId || !rol) throw new Error('userId y rol requeridos')
        const { data: updateData, error: updateError } = await supabase
          .from('perfiles')
          .update({ rol, updated_at: new Date().toISOString() })
          .eq('id', userId)
          .select()
          .single()
        if (updateError) throw updateError
        result = { data: updateData, message: 'Rol actualizado' }
        break

      case 'toggleActivo':
        if (!userId) throw new Error('userId requerido')
        const { data: toggleData, error: toggleError } = await supabase
          .from('perfiles')
          .update({ activo, updated_at: new Date().toISOString() })
          .eq('id', userId)
          .select()
          .single()
        if (toggleError) throw toggleError
        result = { data: toggleData, message: activo ? 'Usuario activado' : 'Usuario desactivado' }
        break

      case 'delete':
        if (!userId) throw new Error('userId requerido')
        if (userId === userData.user.id) {
          throw new Error('No puedes eliminarte a ti mismo')
        }
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)
        if (deleteError) throw deleteError
        result = { success: true, message: 'Usuario eliminado' }
        break

      default:
        return new Response(JSON.stringify({ error: 'Acción no válida' }), {
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
