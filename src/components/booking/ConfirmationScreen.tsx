'use client';

import { Appointment, BUSINESS_INFO } from '@/types/appointment';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface ConfirmationScreenProps {
  appointment: Appointment;
}

export default function ConfirmationScreen({ appointment }: ConfirmationScreenProps) {
  const formattedDate = format(parseISO(appointment.date), "EEEE d 'de' MMMM", { locale: es });
  const formattedTime = () => {
    const [hour, minute] = appointment.time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center justify-center px-4 text-center">

      {/* Ícono de éxito */}
      <div className="w-24 h-24 bg-[#E8943D] rounded-full flex items-center justify-center text-4xl mb-5 shadow-lg">
        🐾
      </div>

      <h1 className="text-2xl font-bold text-[#1B3A5C] mb-2">
        ¡Cita agendada!
      </h1>
      <p className="text-[#6B6B6B] mb-8 max-w-xs">
        Tu cita quedó registrada. Pronto recibirás confirmación de Sam&apos;s Pets.
      </p>

      {/* Resumen */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E3DE] w-full max-w-sm mb-6 text-left space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-[#6B6B6B]">📅 Fecha</span>
          <span className="text-sm font-medium text-[#1B3A5C] capitalize">{formattedDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-[#6B6B6B]">⏰ Hora</span>
          <span className="text-sm font-medium text-[#1B3A5C]">{formattedTime()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-[#6B6B6B]">🐕 Mascota</span>
          <span className="text-sm font-medium text-[#1B3A5C]">{appointment.petName}</span>
        </div>
        {appointment.serviceName && (
          <div className="flex justify-between">
            <span className="text-sm text-[#6B6B6B]">✂️ Servicio</span>
            <span className="text-sm font-medium text-[#1B3A5C]">{appointment.serviceName}</span>
          </div>
        )}
        <div className="border-t border-[#E5E3DE] pt-3">
          <div className="flex justify-between">
            <span className="text-sm text-[#6B6B6B]">📍 Lugar</span>
            <span className="text-sm font-medium text-[#1B3A5C]">El Progreso, Jutiapa</span>
          </div>
        </div>
      </div>

      {/* Solo una acción: agendar otra cita */}
      <a
        href="/"
        className="w-full max-w-sm bg-[#E8943D] hover:bg-[#d4802f] text-white font-semibold py-4 px-6 rounded-2xl text-center transition-colors shadow-md"
      >
        Agendar otra cita
      </a>

      <p className="text-xs text-[#9B9B9B] mt-5">
        {BUSINESS_INFO.instagram} · {BUSINESS_INFO.phone}
      </p>
    </div>
  );
}
