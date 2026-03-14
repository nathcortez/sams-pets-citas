import { createClient } from '@supabase/supabase-js';

// Limpiar whitespace/saltos de línea que invalidan los headers HTTP
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\s/g, '');
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/\s/g, '');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Para desarrollo local sin Supabase, usamos localStorage
// Esta función verifica si Supabase está configurado
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
