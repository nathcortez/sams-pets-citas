-- ============================================================
-- Sam's Pets — Setup de base de datos en Supabase
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL UNIQUE
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Anyone can insert clients" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update clients" ON clients FOR UPDATE USING (true);

CREATE INDEX IF NOT EXISTS idx_clients_whatsapp ON clients(whatsapp);

-- Tabla de mascotas
CREATE TABLE IF NOT EXISTS pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  breed TEXT
);

ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read pets" ON pets FOR SELECT USING (true);
CREATE POLICY "Anyone can insert pets" ON pets FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update pets" ON pets FOR UPDATE USING (true);

CREATE INDEX IF NOT EXISTS idx_pets_client_id ON pets(client_id);

-- Tabla de citas
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Datos de la mascota
  pet_name TEXT NOT NULL,
  pet_breed_age TEXT,
  pet_breed TEXT,
  pet_breed_emoji TEXT,
  pet_size TEXT,
  pet_photo_url TEXT,
  -- Datos del servicio
  base_time_minutes INTEGER DEFAULT 45,
  service_id TEXT,
  service_name TEXT,
  service_additional_time INTEGER DEFAULT 0,
  recovery_time INTEGER DEFAULT 0,
  -- Datos del dueño
  owner_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  comments TEXT,
  additional_service BOOLEAN DEFAULT FALSE,
  -- Fecha y hora
  date DATE NOT NULL,
  time TEXT NOT NULL,
  -- Estado
  status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
  -- Re-agendamiento
  original_date DATE,
  reschedule_history JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read appointments" ON appointments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update appointments" ON appointments FOR UPDATE USING (true);

CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_whatsapp ON appointments(whatsapp);

-- Tabla de días bloqueados (para vacaciones / feriados / cierre)
CREATE TABLE IF NOT EXISTS blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date DATE NOT NULL UNIQUE,
  reason TEXT
);

ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read blocked_dates" ON blocked_dates FOR SELECT USING (true);
CREATE POLICY "Anyone can insert blocked_dates" ON blocked_dates FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete blocked_dates" ON blocked_dates FOR DELETE USING (true);

CREATE INDEX IF NOT EXISTS idx_blocked_dates_date ON blocked_dates(date);
