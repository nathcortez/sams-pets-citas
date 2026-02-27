'use client';

import { Appointment, AppointmentStatus } from '@/types/appointment';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface BookingSummaryProps {
  appointment: Appointment;
  onSend: () => void;
  isSending: boolean;
}

export default function BookingSummary({
  appointment,
  onSend,
  isSending,
}: BookingSummaryProps) {
  const whatsappLink = generateWhatsAppLink(appointment);

  const formattedDate = format(new Date(appointment.date), "EEEE d 'de' MMMM 'de' yyyy", {
    locale: es,
  });

  const formatTime = (time: string): string => {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg space-y-4">

      <div className="space-y-3">
        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-[--gris]">📅 Fecha</span>
          <span className="font-medium text-[--azul-oscuro] capitalize">
            {formattedDate}
          </span>
        </div>

        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-[--gris]">⏰ Hora</span>
          <span className="font-medium text-[--azul-oscuro]">
            {formatTime(appointment.time)}
          </span>
        </div>

        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-[--gris]">🐕 Mascota</span>
          <span className="font-medium text-[--azul-oscuro]">
            {appointment.petName}
          </span>
        </div>

        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-[--gris]">🐾 Raza/Edad</span>
          <span className="font-medium text-[--azul-oscuro]">
            {appointment.petBreedAge}
          </span>
        </div>

        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-[--gris]">👤 Propietario</span>
          <span className="font-medium text-[--azul-oscuro]">
            {appointment.ownerName}
          </span>
        </div>

        <div className="flex justify-between py-2 border-b border-gray-100">
          <span className="text-[--gris]">📱 WhatsApp</span>
          <span className="font-medium text-[--azul-oscuro]">
            {appointment.whatsapp}
          </span>
        </div>

        {appointment.additionalService && (
          <div className="flex justify-between py-2 border-b border-gray-100 bg-[--naranja]/10 rounded-lg px-2">
            <span className="text-[--naranja]">⚠️ Servicio adicional</span>
            <span className="font-medium text-[--naranja]">
              Recuperación de manto
            </span>
          </div>
        )}

        {appointment.comments && (
          <div className="py-2 border-b border-gray-100">
            <span className="text-[--gris] block mb-1">📝 Comentarios</span>
            <p className="text-[--azul-oscuro] text-sm">
              {appointment.comments}
            </p>
          </div>
        )}
      </div>

      <div className="pt-4">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onSend}
          className="block w-full py-4 px-6 bg-[--verde-limon] hover:bg-[--verde-limon]/90 text-[--azul-oscuro] font-semibold text-center rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {isSending ? 'Enviando...' : 'Confirmar cita por WhatsApp'}
        </a>

        <p className="text-xs text-center text-[--gris] mt-3">
          Serás redirigido a WhatsApp para confirmar tu cita
        </p>
      </div>
    </div>
  );
}
