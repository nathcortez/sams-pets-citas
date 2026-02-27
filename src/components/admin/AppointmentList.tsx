'use client';

import { Appointment, AppointmentStatus } from '@/types/appointment';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentListProps {
  appointments: Appointment[];
  onStatusChange: (id: string, status: AppointmentStatus) => void;
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

export default function AppointmentList({ appointments, onStatusChange }: AppointmentListProps) {
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
            <div>
              <h4 className="font-semibold text-[--azul-oscuro]">{appointment.petName}</h4>
              <p className="text-sm text-[--gris]">{appointment.petBreedAge}</p>
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
          </div>
        </div>
      ))}
    </div>
  );
}
