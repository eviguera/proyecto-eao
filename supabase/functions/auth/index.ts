import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, password, fullName, action } = await req.json()

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email y contraseña requeridos' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let result

    switch (action) {
      case 'signup':
        const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: fullName || email.split('@')[0] },
        })
        if (signUpError) throw signUpError
        result = { 
          data: signUpData,
          message: 'Usuario creado exitosamente' 
        }
        break

      case 'login':
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        
        const { data: perfilData } = await supabase
          .from('perfiles')
          .select('*')
          .eq('id', signInData.user.id)
          .single()
        
        result = {
          session: signInData.session,
          user: {
            id: signInData.user.id,
            email: signInData.user.email,
            nombre: perfilData?.nombre || signInData.user.email,
            rol: perfilData?.rol || 'lector',
            activo: perfilData?.activo !== false
          }
        }
        break

      case 'logout':
        const { error: signOutError } = await supabase.auth.signOut()
        if (signOutError) throw signOutError
        result = { success: true }
        break

      case 'getProfile':
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) throw new Error('Token requerido')
        
        const { data: userData, error: userError } = await supabase.auth.getUser(
          authHeader.replace('Bearer ', '')
        )
        if (userError) throw userError
        
        const { data: profile } = await supabase
          .from('perfiles')
          .select('*')
          .eq('id', userData.user.id)
          .single()
        
        result = {
          user: {
            id: userData.user.id,
            email: userData.user.email,
            nombre: profile?.nombre || userData.user.email,
            rol: profile?.rol || 'lector',
            activo: profile?.activo !== false
          }
        }
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
