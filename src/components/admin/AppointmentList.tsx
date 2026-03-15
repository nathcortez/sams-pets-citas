'use client';

import { Appointment, AppointmentStatus } from '@/types/appointment';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentListProps {
  appointments: Appointment[];
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onDelete?: (id: string) => void;
}

const statusColors: Record<AppointmentStatus, string> = {
  pendiente:  'bg-yellow-100 text-yellow-800',
  confirmada: 'bg-blue-100 text-blue-800',
  completada: 'bg-green-100 text-green-800',
  cancelada:  'bg-red-100 text-red-800',
};

export default function AppointmentList({ appointments, onStatusChange, onDelete }: AppointmentListProps) {

  const formatDate = (dateStr: string) => format(new Date(dateStr), 'dd MMM yyyy', { locale: es });

  const formatTime = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return `${h > 12 ? h - 12 : h}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Eliminar la cita de ${name}? Esta acción no se puede deshacer.`)) {
      onDelete?.(id);
    }
  };

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">📅</div>
        <p className="text-gray-500">No hay citas programadas</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((apt) => (
        <div key={apt.id} className="bg-white rounded-2xl p-4 shadow-md space-y-3">

          {/* Foto + nombre + estado */}
          <div className="flex items-start gap-3">
            {apt.petPhoto ? (
              <img src={apt.petPhoto} alt={apt.petName}
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border-2 border-gray-100" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-orange-50 border-2 border-gray-100 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">{apt.petBreedEmoji || '🐾'}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{apt.petName}</p>
              <p className="text-sm text-gray-500">{apt.petBreed || apt.petBreedAge}</p>
              {apt.petSize && <p className="text-xs text-orange-500 capitalize">{apt.petSize}</p>}
            </div>
            {/* Selector de estado */}
            <select
              value={apt.status}
              onChange={(e) => onStatusChange(apt.id, e.target.value as AppointmentStatus)}
              className={`text-xs font-semibold px-2 py-1.5 rounded-lg border-0 cursor-pointer focus:outline-none ${statusColors[apt.status]}`}
            >
              <option value="pendiente">⏳ Pendiente</option>
              <option value="confirmada">✅ Confirmada</option>
              <option value="completada">🎉 Realizada</option>
              <option value="cancelada">❌ Cancelada</option>
            </select>
          </div>

          {/* Fecha, hora, dueño */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>📅 {formatDate(apt.date)} &nbsp; ⏰ {formatTime(apt.time)}</p>
            <p>👤 {apt.ownerName}</p>
            {apt.comments && <p className="italic text-gray-400">📝 {apt.comments}</p>}
          </div>

          {/* Botón eliminar */}
          {onDelete && (
            <button
              onClick={() => handleDelete(apt.id, apt.petName)}
              className="w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 text-sm font-medium transition-colors"
            >
              🗑️ Eliminar registro
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
