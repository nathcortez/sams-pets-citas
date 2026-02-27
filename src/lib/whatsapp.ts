import { Appointment, BUSINESS_INFO } from '@/types/appointment';

export function generateWhatsAppLink(appointment: Appointment): string {
  const { petName, petBreedAge, ownerName, whatsapp, comments, additionalService, date, time } = appointment;

  const formattedDate = new Date(date).toLocaleDateString('es-GT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const serviceText = additionalService
    ? '\n⚠️ *SERVICIO ADICIONAL*: Recuperación de manto (enredado)'
    : '';

  const commentsText = comments
    ? `\n📝 *Comentarios*: ${comments}`
    : '';

  const message = `*Nueva Cita - Sam's Pets*

📅 *Fecha*: ${formattedDate}
⏰ *Hora*: ${time}

🐕 *Mascota*: ${petName}
🐾 *Raza/Edad*: ${petBreedAge}

👤 *Propietario*: ${ownerName}
📱 *WhatsApp*: ${whatsapp}${serviceText}${commentsText}

_Esta cita está pendiente de confirmación_`;

  const encodedMessage = encodeURIComponent(message);
  const phone = BUSINESS_INFO.whatsappNumber;

  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

export function generateWhatsAppReminder(appointment: Appointment): string {
  const { petName, ownerName, date, time } = appointment;

  const formattedDate = new Date(date).toLocaleDateString('es-GT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const message = `*Recordatorio de Cita - Sam's Pets*

¡Hola ${ownerName}! 👋

Te recordamos que mañana tienes una cita:
📅 ${formattedDate}
⏰ ${time}
🐕 Mascota: ${petName}

¡Te esperamos! 🐾

Si necesitas cancelar o reprogramar, contáctanos con anticipación.`;

  const encodedMessage = encodeURIComponent(message);
  const phone = appointment.whatsapp.replace(/\D/g, '');

  return `https://wa.me/${phone}?text=${encodedMessage}`;
}
