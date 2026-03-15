'use client';

import { useState } from 'react';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentListProps {
  appointments: Appointment[];
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onDelete?: (id: string) => void;
}

const statusColors: Record<AppointmentStatus, string> = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  confirmada: 'bg-blue-100 text-blue-800',
  completada: 'bg-green-100 text-green-800',
  cancelada: 'bg-red-100 text-red-800',
};

const statusLabels: Record<AppointmentStatus, string> = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  completada: 'Completada',
  cancelada: 'Cancelada',
};

export default function AppointmentList({ appointments, onStatusChange, onDelete }: AppointmentListProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd MMM yyyy", { locale: es });
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">📅</div>
        <p className="text-[--gris]">No hay citas programadas</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="bg-white rounded-2xl p-4 shadow-md"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              {/* Foto de la mascota */}
              {appointment.petPhoto ? (
                <img
                  src={appointment.petPhoto}
                  alt={appointment.petName}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border-2 border-[#E5E3DE]"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-[#FFF4EA] border-2 border-[#E5E3DE] flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{appointment.petBreedEmoji || '🐾'}</span>
                </div>
              )}
              <div>
                <h4 className="font-semibold text-[--azul-oscuro]">{appointment.petName}</h4>
                <p className="text-sm text-[--gris]">
                  {appointment.petBreed || appointment.petBreedAge}
                </p>
                {appointment.petSize && (
                  <span className="text-xs text-[#E8943D] font-medium capitalize">
                    {appointment.petSize}
                  </span>
                )}
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
              {statusLabels[appointment.status]}
            </span>
          </div>

          <div className="flex gap-4 text-sm text-[--azul-oscuro] mb-3">
            <span>📅 {formatDate(appointment.date)}</span>
            <span>⏰ {formatTime(appointment.time)}</span>
          </div>

          <div className="text-sm text-[--gris] mb-3">
            <p>👤 {appointment.ownerName}</p>
            <p>📱 {appointment.whatsapp}</p>
            {appointment.additionalService && (
              <p className="text-[--naranja] font-medium">⚠️ Servicio adicional</p>
            )}
            {appointment.comments && (
              <p className="text-sm mt-1 italic">📝 {appointment.comments}</p>
            )}
          </div>

          {/* Botones de acción */}
          {confirmDeleteId === appointment.id ? (
            <div className="flex gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-sm text-red-700 flex-1">¿Eliminar esta cita?</p>
              <button
                onClick={() => { onDelete?.(appointment.id); setConfirmDeleteId(null); }}
                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => onStatusChange(appointment.id, 'confirmada')}
                className="flex-1 py-2 px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium rounded-lg transition-colors"
              >
                Confirmar
              </button>
              <button
                onClick={() => onStatusChange(appointment.id, 'completada')}
                className="flex-1 py-2 px-3 bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium rounded-lg transition-colors"
              >
                Completar
              </button>
              <button
                onClick={() => onStatusChange(appointment.id, 'cancelada')}
                className="flex-1 py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition-colors"
              >
                Cancelar
              </button>
              {onDelete && (
                <button
                  onClick={() => setConfirmDeleteId(appointment.id)}
                  className="py-2 px-3 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 text-sm font-medium rounded-lg transition-colors"
                  title="Eliminar cita"
                >
                  🗑️
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
