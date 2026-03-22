import { Appointment, BUSINESS_INFO } from '@/types/appointment';

export function generateWhatsAppLink(appointment: Appointment): string {
  const {
    petName,
    petBreed,
    petBreedAge,
    petBreedEmoji,
    ownerName,
    whatsapp,
    comments,
    additionalService,
    serviceName,
    date,
    time,
  } = appointment;

  // Parsear como local para evitar desfase UTC
  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const formattedDate = dateObj.toLocaleDateString('es-GT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Hora con AM/PM
  const [hour, minute] = time.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour;
  const formattedTime = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;

  // Raza — preferir petBreed (nuevo sistema) sobre petBreedAge (legacy)
  const breedText = petBreed
    ? `${petBreedEmoji ? petBreedEmoji + ' ' : ''}${petBreed}`
    : petBreedAge || 'No especificada';

  const serviceText = serviceName
    ? `✂️ *Servicio*: ${serviceName}`
    : '✂️ *Servicio*: Grooming Completo';

  const additionalText = additionalService
    ? '\n⚠️ *Servicio adicional*: Recuperación de manto (pelaje enredado)'
    : '';

  const commentsText = comments
    ? `\n📝 *Notas*: ${comments}`
    : '';

  const message =
`*Nueva Cita - Sam's Pets* 🐾

📅 *Fecha*: ${formattedDate}
⏰ *Hora*: ${formattedTime}

🐕 *Mascota*: ${petName}
🐾 *Raza*: ${breedText}
${serviceText}${additionalText}

👤 *Propietario*: ${ownerName}
📱 *WhatsApp cliente*: ${whatsapp}${commentsText}

_Por favor confirmar esta cita_ ✅`;

  const encodedMessage = encodeURIComponent(message);
  const phone = BUSINESS_INFO.whatsappNumber;

  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

export function generateWhatsAppReminder(appointment: Appointment): string {
  const { petName, ownerName, date, time } = appointment;

  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const formattedDate = dateObj.toLocaleDateString('es-GT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
