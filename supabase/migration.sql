-- ============================================
-- MIGRACIÓN SEGURA PARA TALLER AUTOMOTRIZ
-- Ejecutar en Supabase Dashboard > SQL Editor
-- ============================================

-- 1. HABILITAR RLSchecks
-- Asegurar que RLS está habilitado en las tablas
ALTER TABLE vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gestion_interna ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE actas ENABLE ROW LEVEL SECURITY;
ALTER TABLE insumos ENABLE ROW LEVEL SECURITY;

-- 2. CREAR TABLA DE PERFILES DE USUARIOS (relacionada con auth.users)
CREATE TABLE IF NOT EXISTS public.perfiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'lector' CHECK (rol IN ('admin', 'lector')),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfiles (id, nombre, email, rol)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    'lector'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. POLÍTICAS RLS

-- Tabla: perfiles
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.perfiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin puede ver todos los perfiles" ON public.perfiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Admin puede actualizar perfiles" ON public.perfiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Tabla: vehiculos
CREATE POLICY "Todos pueden ver vehículos" ON public.vehiculos
  FOR SELECT USING (true);

CREATE POLICY "Solo admins pueden insertar vehículos" ON public.vehiculos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Solo admins pueden actualizar vehículos" ON public.vehiculos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Solo admins pueden eliminar vehículos" ON public.vehiculos
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Tabla: ordenes
CREATE POLICY "Todos pueden ver órdenes" ON public.ordenes
  FOR SELECT USING (true);

CREATE POLICY "Solo admins pueden insertar órdenes" ON public.ordenes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Solo admins pueden actualizar órdenes" ON public.ordenes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Solo admins pueden eliminar órdenes" ON public.ordenes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Tabla: gestion_interna
CREATE POLICY "Todos pueden ver gestión interna" ON public.gestion_interna
  FOR SELECT USING (true);

CREATE POLICY "Solo admins pueden insertar gestión" ON public.gestion_interna
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Solo admins pueden actualizar gestión" ON public.gestion_interna
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Solo admins pueden eliminar gestión" ON public.gestion_interna
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Tabla: checklists
CREATE POLICY "Todos pueden ver checklists" ON public.checklists
  FOR SELECT USING (true);

CREATE POLICY "Solo admins pueden insertar checklists" ON public.checklists
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Solo admins pueden actualizar checklists" ON public.checklists
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Solo admins pueden eliminar checklists" ON public.checklists
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Tabla: actas
CREATE POLICY "Todos pueden ver actas" ON public.actas
  FOR SELECT USING (true);

CREATE POLICY "Solo admins pueden insertar actas" ON public.actas
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Solo admins pueden actualizar actas" ON public.actas
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Solo admins pueden eliminar actas" ON public.actas
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- Tabla: insumos
CREATE POLICY "Todos pueden ver insumos" ON public.insumos
  FOR SELECT USING (true);

CREATE POLICY "Solo admins pueden insertar insumos" ON public.insumos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Solo admins pueden actualizar insumos" ON public.insumos
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Solo admins pueden eliminar insumos" ON public.insumos
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.perfiles 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );

-- 4. CREAR ÍNDICES PARA MEJORAR RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_vehiculos_patente ON public.vehiculos(patente);
CREATE INDEX IF NOT EXISTS idx_ordenes_estado ON public.ordenes(estado);
CREATE INDEX IF NOT EXISTS idx_ordenes_fecha ON public.ordenes(fecha);
CREATE INDEX IF NOT EXISTS idx_gestion_estado_pago ON public.gestion_interna(estado_pago);
CREATE INDEX IF NOT EXISTS idx_insumos_categoria ON public.insumos(categoria);

-- 5. AGREGAR COLUMNA FOTOS A CHECKLISTS
ALTER TABLE public.checklists ADD COLUMN IF NOT EXISTS fotos JSONB DEFAULT '[]'::jsonb;

-- 5. ACTUALIZAR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_perfiles_updated_at
  BEFORE UPDATE ON public.perfiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 6. PERMISOS PARA SERVICIO (Edge Functions)
GRANT USAGE ON SCHEMA public TO service_role;
GRANT ALL ON public.perfiles TO service_role;
