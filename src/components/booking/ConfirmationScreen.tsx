"use client";

import { Appointment, BUSINESS_INFO } from "@/types/appointment";
import { generateWhatsAppLink } from "@/lib/whatsapp";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface ConfirmationScreenProps {
  appointment: Appointment;
}

export default function ConfirmationScreen({ appointment }: ConfirmationScreenProps) {
  const formattedDate = format(parseISO(appointment.date), "EEEE d 'de' MMMM", { locale: es });
  const whatsappLink = generateWhatsAppLink(appointment);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Animación de éxito */}
      <div className="w-24 h-24 bg-[#E8943D] rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg">
        🐾
      </div>

      <h1 className="text-2xl font-bold text-[#1B3A5C] mb-2">
        ¡Cita agendada!
      </h1>
      <p className="text-[#6B6B6B] mb-8">
        Te esperamos en Sam&apos;s Pets
      </p>

      {/* Resumen de la cita */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E3DE] w-full max-w-sm mb-6 text-left space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-[#6B6B6B]">📅 Fecha</span>
          <span className="text-sm font-medium text-[#1B3A5C] capitalize">{formattedDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-[#6B6B6B]">⏰ Hora</span>
          <span className="text-sm font-medium text-[#1B3A5C]">{appointment.time}</span>
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

      {/* Botón WhatsApp */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-sm bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-md mb-3"
      >
        <span className="text-xl">💬</span>
        Confirmar por WhatsApp
      </a>

      {/* Botón nueva cita */}
      <a
        href="/"
        className="w-full max-w-sm bg-white border-2 border-[#E5E3DE] text-[#1B3A5C] font-medium py-3 px-6 rounded-2xl text-center transition-colors hover:border-[#E8943D]"
      >
        Agendar otra cita
      </a>

      <p className="text-xs text-[#6B6B6B] mt-6">
        {BUSINESS_INFO.address}
      </p>
    </div>
  );
}
