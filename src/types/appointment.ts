export type AppointmentStatus = 'pendiente' | 'confirmada' | 'completada' | 'cancelada';

export interface RescheduleEntry {
  from: string;
  to: string;
  date: string;
}

export interface Client {
  id: string;
  name: string;
  whatsapp: string;
  createdAt: string;
}

export interface Pet {
  id: string;
  clientId: string;
  name: string;
  breed: string;
}

export interface Appointment {
  id: string;
  createdAt: string;
  petName: string;
  petBreedAge?: string;
  petBreed?: string; // Nombre de la raza seleccionada
  petBreedEmoji?: string; // Emoji de la raza seleccionada
  petSize?: string; // Tamaño: pequeno, mediano, grande
  baseTimeMinutes?: number; // Tiempo base de la raza
  serviceId?: string; // ID del servicio seleccionado
  serviceName?: string; // Nombre del servicio
  serviceAdditionalTime?: number; // Tiempo adicional del servicio
  recoveryTime?: number; // Tiempo de recuperación de manto
  ownerName: string;
  whatsapp: string;
  comments?: string;
  additionalService: boolean;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: AppointmentStatus;
  // Campos para re-agendamiento
  originalDate?: string; // Fecha original antes de re-agendar
  rescheduleHistory?: RescheduleEntry[]; // Historial de cambios
}

export interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  instagram: string;
  location: string;
  whatsappNumber: string; // sin prefijo, ej: 49037428
}

export const BUSINESS_INFO: BusinessInfo = {
  name: "Sam's Pets",
  address: 'El Progreso Jutiapa, calle salida a Jalapa, edificio La Casa del Agricultor, Jutiapa, Guatemala, 22002',
  phone: '+502 4903-7428',
  instagram: '@samspets_shop',
  location: 'El Progreso, Jutiapa',
  whatsappNumber: '50249037428',
};

export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00'
];

export const SERVICE_HOURS = {
  start: '08:00',
  lunchStart: '13:00',
  lunchEnd: '14:00',
  lastAppointment: '15:00',
};
