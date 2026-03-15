'use client';

import { useState, useEffect } from 'react';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { supabase } from '@/lib/supabase';
import StatsCard from '@/components/admin/StatsCard';
import AppointmentList from '@/components/admin/AppointmentList';

export default function AdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | AppointmentStatus>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar citas de Supabase
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (supabaseError) throw supabaseError;

      // Mapear datos de Supabase al formato de la app
      const mappedAppointments: Appointment[] = (data || []).map((row) => ({
        id: row.id,
        createdAt: row.created_at,
        petName: row.pet_name,
        petBreedAge: row.pet_breed_age,
        petBreed: row.pet_breed,
        petBreedEmoji: row.pet_breed_emoji,
        petSize: row.pet_size,
        baseTimeMinutes: row.base_time_minutes,
        serviceId: row.service_id,
        serviceName: row.service_name,
        serviceAdditionalTime: row.service_additional_time,
        recoveryTime: row.recovery_time,
        ownerName: row.owner_name,
        whatsapp: row.whatsapp,
        comments: row.comments,
        additionalService: row.additional_service,
        petPhoto: row.pet_photo_url,   // ← campo que faltaba
        date: row.date,
        time: row.time,
        status: row.status as AppointmentStatus,
      }));

      setAppointments(mappedAppointments);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Error al cargar las citas');
      // Fallback a localStorage
      const stored = localStorage.getItem('sams-pets-appointments');
      if (stored) {
        setAppointments(JSON.parse(stored));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Actualizar status en Supabase
  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    try {
      const { error: supabaseError } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (supabaseError) throw supabaseError;

      // Actualizar UI
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
      );
    } catch (err) {
      console.error('Error updating status:', err);
      // Fallback a localStorage
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
      );
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'pendiente').length,
    confirmed: appointments.filter((a) => a.status === 'confirmada').length,
    completed: appointments.filter((a) => a.status === 'completada').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[--azul-principal] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[--gris]">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[--azul-principal] flex items-center justify-center">
              <span className="text-white text-lg">🐕</span>
            </div>
            <div>
              <h1 className="font-bold text-[--azul-oscuro]">Panel Admin</h1>
              <p className="text-xs text-[--gris]">Sam's Pets</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAppointments}
              className="text-sm text-[--azul-principal] hover:underline"
            >
              🔄 Actualizar
            </button>
            <a
              href="/"
              className="text-sm text-[--azul-principal] hover:underline"
            >
              Ver sitio
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
            ⚠️ {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatsCard title="Total" value={stats.total} icon="📊" color="blue" />
          <StatsCard title="Pendientes" value={stats.pending} icon="⏳" color="yellow" />
          <StatsCard title="Confirmadas" value={stats.confirmed} icon="✓" color="blue" />
          <StatsCard title="Completadas" value={stats.completed} icon="✅" color="green" />
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'pendiente', 'confirmada', 'completada', 'cancelada'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${filter === f
                  ? 'bg-[--azul-principal] text-white'
                  : 'bg-white text-[--gris] hover:bg-gray-100'
                }
              `}
            >
              {f === 'all' ? 'Todas' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Appointment List */}
        <AppointmentList
          appointments={filteredAppointments}
          onStatusChange={handleStatusChange}
        />

        {/* Info */}
        <div className="mt-8 p-4 bg-green-50 rounded-xl">
          <h3 className="font-medium text-[--azul-oscuro] mb-2">ℹ️ Información</h3>
          <p className="text-sm text-[--gris]">
            Las citas se almacenan en Supabase. Puedes acceder a este panel desde cualquier dispositivo.
          </p>
        </div>
      </main>
    </div>
  );
}
