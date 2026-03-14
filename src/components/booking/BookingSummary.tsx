'use client';

import { Appointment } from '@/types/appointment';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface BookingSummaryProps {
  appointment: Appointment;
  onSend: () => void;
  isSending: boolean;
  error?: string | null;
}

export default function BookingSummary({ appointment, onSend, isSending, error }: BookingSummaryProps) {
  const formattedDate = format(new Date(appointment.date), "EEEE d 'de' MMMM 'de' yyyy", {
    locale: es,
  }).replace(/De/g, 'de');

  const formatTime = (time: string): string => {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hora${hours > 1 ? 's' : ''}`;
    return `${hours} hora${hours > 1 ? 's' : ''} ${mins} min`;
  };

  const totalDuration = (appointment.baseTimeMinutes || 45) + (appointment.serviceAdditionalTime || 0);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg space-y-4">

      <div className="space-y-3">
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-[--gris]">📅 Fecha</span>
          <span className="font-medium text-[--azul-oscuro] text-right capitalize">{formattedDate}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-[--gris]">⏰ Hora</span>
          <span className="font-medium text-[--azul-oscuro]">{formatTime(appointment.time)}</span>
        </div>
        {appointment.serviceName && (
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-[--gris]">✂️ Servicio</span>
            <span className="font-medium text-[--azul-oscuro]">{appointment.serviceName}</span>
          </div>
        )}
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-[--gris]">⏱️ Duración</span>
          <span className="font-medium text-[--azul-oscuro]">{formatDuration(totalDuration)}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-[--gris]">🐕 Mascota</span>
          <span className="font-medium text-[--azul-oscuro]">{appointment.petName}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-[--gris]">🐾 Raza</span>
          <span className="font-medium text-[--azul-oscuro]">{appointment.petBreedEmoji} {appointment.petBreed}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-[--gris]">👤 Propietario</span>
          <span className="font-medium text-[--azul-oscuro]">{appointment.ownerName}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-[--gris]">📱 WhatsApp</span>
          <span className="font-medium text-[--azul-oscuro]">{appointment.whatsapp}</span>
        </div>
        {appointment.additionalService && (
          <div className="flex justify-between py-2 border-b border-gray-100 bg-[--naranja]/10 rounded-lg px-2">
            <span className="text-[--naranja]">⚠️ Servicio adicional</span>
            <span className="font-medium text-[--naranja]">Recuperación de manto</span>
          </div>
        )}
        {appointment.comments && (
          <div className="py-2 border-b border-gray-100">
            <span className="text-[--gris] block mb-1">📝 Comentarios</span>
            <p className="text-[--azul-oscuro] text-sm">{appointment.comments}</p>
          </div>
        )}
      </div>

      {/* Error si falla el guardado */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 text-center">
          ⚠️ {error}
        </div>
      )}

      {/* Botón confirmar — directo, sin WhatsApp */}
      <div className="pt-2">
        <button
          onClick={onSend}
          disabled={isSending}
          className={`
            w-full py-4 px-6 font-bold text-lg rounded-2xl transition-all shadow-lg
            ${isSending
              ? 'bg-[#E8943D]/60 text-white/80 cursor-not-allowed'
              : 'bg-[#E8943D] hover:bg-[#d4802f] text-white hover:shadow-xl transform hover:scale-[1.02]'
            }
          `}
        >
          {isSending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Guardando...
            </span>
          ) : (
            '✅ Confirmar mi cita'
          )}
        </button>
      </div>
    </div>
  );
}
