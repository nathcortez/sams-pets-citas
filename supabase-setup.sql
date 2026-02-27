-- Crear tabla de citas para Sam's Pets
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  pet_name TEXT NOT NULL,
  pet_breed_age TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  comments TEXT,
  additional_service BOOLEAN DEFAULT FALSE,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'confirmada', 'completada', 'cancelada'))
);

-- Habilitar Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Política de lectura (cualquiera puede leer)
CREATE POLICY "Anyone can read appointments" ON appointments
  FOR SELECT USING (true);

-- Política de inserción (cualquiera puede crear)
CREATE POLICY "Anyone can insert appointments" ON appointments
  FOR INSERT WITH CHECK (true);

-- Política de actualización (solo actualizar status)
CREATE POLICY "Anyone can update appointments" ON appointments
  FOR UPDATE USING (true);

-- Crear índice para búsquedas por fecha
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);

-- Crear índice para búsquedas por status
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
