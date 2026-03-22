'use client';

import { useState } from 'react';
import { Appointment, BUSINESS_INFO } from '@/types/appointment';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ConfirmationScreenProps {
  appointment: Appointment;
}

export default function ConfirmationScreen({ appointment }: ConfirmationScreenProps) {
  const [whatsappSent, setWhatsappSent] = useState(false);

  // Parsear como hora local para evitar desfase por timezone (UTC-6 Guatemala)
  const [year, month, day] = appointment.date.split('-').map(Number);
  const formattedDate = format(new Date(year, month - 1, day), "EEEE d 'de' MMMM", { locale: es });

  const formattedTime = () => {
    const [hour, minute] = appointment.time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const handleWhatsAppConfirm = () => {
    const link = generateWhatsAppLink(appointment);
    window.open(link, '_blank');
    setWhatsappSent(true);
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
      <p className="text-[#6B6B6B] mb-6 max-w-xs">
        Tu cita quedó registrada. Para terminar de confirmarla, manda un mensaje a Sam&apos;s Pets por WhatsApp.
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

      {/* CTA principal: confirmar por WhatsApp */}
      <div className="w-full max-w-sm space-y-3">
        {!whatsappSent ? (
          <button
            onClick={handleWhatsAppConfirm}
            className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg text-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Confirmar por WhatsApp
          </button>
        ) : (
          <div className="w-full bg-green-50 border border-green-200 rounded-2xl py-4 px-6 text-center space-y-2">
            <p className="text-green-700 font-semibold">✅ ¡Mensaje enviado a Sam&apos;s Pets!</p>
            <p className="text-green-600 text-sm">Pronto te confirmarán tu cita.</p>
            <button
              onClick={handleWhatsAppConfirm}
              className="text-xs text-green-600 underline mt-1"
            >
              Abrir WhatsApp de nuevo
            </button>
          </div>
        )}

        {/* Acción secundaria */}
        <a
          href="/"
          className="w-full block bg-white border-2 border-[#E5E3DE] hover:border-[#E8943D] text-[#1B3A5C] font-semibold py-3 px-6 rounded-2xl text-center transition-colors"
        >
          Agendar otra cita
        </a>
      </div>

      <p className="text-xs text-[#9B9B9B] mt-6">
        {BUSINESS_INFO.instagram} · {BUSINESS_INFO.phone}
      </p>
    </div>
  );
}
