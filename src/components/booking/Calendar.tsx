'use client';

import { useState, useEffect, useMemo } from 'react';
import { format, addDays, startOfDay, isSameDay, parseISO, isWithinInterval, addMinutes, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Appointment } from '@/types/appointment';
import { PetBreed, Service } from '@/types/breed';

interface CalendarProps {
  selected: Date | undefined;
  onSelect: (date: Date) => void;
  selectedBreed?: PetBreed;
  selectedService?: Service;
  recoveryTimeMinutes?: number;
  selectedTime?: string;
  onTimeSelect?: (time: string) => void;
}

// Generar los próximos 14 días (excluyendo Domingos)
function getNext14Days(): Date[] {
  const today = startOfDay(new Date());
  const days: Date[] = [];
  let count = 0;
  while (days.length < 14 && count < 60) {
    const day = addDays(today, count);
    if (getDay(day) !== 0) { // 0 = Domingo
      days.push(day);
    }
    count++;
  }
  return days;
}

// Obtener nombre abreviado del día
function getDayName(date: Date): string {
  return format(date, 'EEE', { locale: es }).toUpperCase();
}

// Generar horarios disponibles entre 8:00 y 15:00 (último inicio a las 3:00 PM)
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 8; hour <= 15; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 15) {
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return slots;
}

// Calcular tiempo total de la cita en minutos
function getTotalTimeMinutes(breed?: PetBreed, service?: Service, recoveryMinutes?: number): number {
  const baseTime = breed?.baseTimeMinutes || 45;
  const serviceTime = service?.additionalTimeMinutes || 0;
  const recoveryTime = recoveryMinutes || 0;
  return baseTime + serviceTime + recoveryTime;
}

// Calcular la duración total de una cita existente en la base de datos
function getExistingAppointmentDuration(apt: Appointment): number {
  // Tiempo base de la raza (default 60 min si no está definido)
  const baseTime = apt.baseTimeMinutes || 60;
  // Tiempo adicional del servicio
  const serviceTime = apt.serviceAdditionalTime || 0;
  // Tiempo de recuperación de manto (si aplica)
  const recoveryTime = apt.recoveryTime || 0;
  return baseTime + serviceTime + recoveryTime;
}

// Verificar si un horario está disponible
function isSlotAvailable(
  slot: string,
  date: Date,
  newAppointmentDuration: number,
  appointments: Appointment[]
): boolean {
  const [slotHour, slotMinute] = slot.split(':').map(Number);
  const slotStartMinutes = slotHour * 60 + slotMinute;
  const slotEndMinutes = slotStartMinutes + newAppointmentDuration;

  // Horas de almuerzo: 13:00 - 14:00 (bloqueado)
  const lunchStartMinutes = 13 * 60; // 780
  const lunchEndMinutes = 14 * 60;   // 840

  // Última hora de inicio: 15:00 (3:00 PM)
  const lastPossibleStartMinutes = 15 * 60; // 900

  // El horario de inicio no puede ser después de las 15:00
  if (slotStartMinutes > lastPossibleStartMinutes) {
    return false;
  }

  // La nueva cita no debe cruzarse con el almuerzo
  const overlapsWithLunch = (
    (slotStartMinutes >= lunchStartMinutes && slotStartMinutes < lunchEndMinutes) || // Empieza durante almuerzo
    (slotEndMinutes > lunchStartMinutes && slotEndMinutes <= lunchEndMinutes) ||   // Termina durante almuerzo
    (slotStartMinutes < lunchStartMinutes && slotEndMinutes > lunchEndMinutes)      // Envuelve el almuerzo
  );

  if (overlapsWithLunch) {
    return false;
  }

  // Obtener la fecha en formato YYYY-MM-DD para comparación
  const dateStr = format(startOfDay(date), 'yyyy-MM-dd');

  // Verificar si el slot se sobrepone con otras citas existentes
  for (const apt of appointments) {
    // Ignorar citas canceladas
    if (apt.status === 'cancelada') continue;

    // Normalizar la fecha de la cita (asegurar formato YYYY-MM-DD)
    const aptDateStr = apt.date ? String(apt.date).split('T')[0] : '';

    // Ignorar citas de otros días
    if (aptDateStr !== dateStr) continue;

    // Calcular el rango de tiempo de la cita existente
    const [aptHour, aptMinute] = apt.time.split(':').map(Number);
    const aptStartMinutes = aptHour * 60 + aptMinute;
    // Usar la función para obtener la duración completa de la cita existente
    const aptDuration = getExistingAppointmentDuration(apt);
    const aptEndMinutes = aptStartMinutes + aptDuration;

    // Verificar superposición: la nueva cita NO debe overlappear con la cita existente
    // Dos citas se superponen si:
    // - La nueva empieza antes de que termine la existente Y
    // - La nueva termina después de que empiece la existente
    const overlaps = (
      slotStartMinutes < aptEndMinutes &&  // Nueva empieza antes de que termine la existente
      slotEndMinutes > aptStartMinutes    // Nueva termina después de que empieza la existente
    );

    if (overlaps) {
      return false;
    }
  }

  return true;
}

export default function Calendar({
  selected,
  onSelect,
  selectedBreed,
  selectedService,
  recoveryTimeMinutes,
  selectedTime: externalSelectedTime,
  onTimeSelect
}: CalendarProps) {
  const [internalSelectedTime, setInternalSelectedTime] = useState<string | undefined>();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const days = useMemo(() => getNext14Days(), []);
  const timeSlots = useMemo(() => generateTimeSlots(), []);

  const selectedTime = externalSelectedTime || internalSelectedTime;

  const handleTimeSelect = (time: string) => {
    setInternalSelectedTime(time);
    onTimeSelect?.(time);
  };

  const totalMinutes = useMemo(
    () => getTotalTimeMinutes(selectedBreed, selectedService, recoveryTimeMinutes),
    [selectedBreed, selectedService, recoveryTimeMinutes]
  );

  // Cargar citas existentes
  useEffect(() => {
    const loadAppointments = async () => {
      // Cargar desde localStorage
      const localAppointments = JSON.parse(localStorage.getItem('sams-pets-appointments') || '[]');
      setAppointments(localAppointments);
    };
    loadAppointments();
  }, []);

  // Limpiar hora seleccionada cuando cambia el día
  useEffect(() => {
    setInternalSelectedTime(undefined);
  }, [selected]);

  const availableSlots = useMemo(() => {
    if (!selected) return [];
    return timeSlots.map(slot => ({
      time: slot,
      available: isSlotAvailable(slot, selected, totalMinutes, appointments)
    }));
  }, [selected, timeSlots, totalMinutes, appointments]);

  // Solo horarios disponibles (sin los no disponibles)
  const onlyAvailableSlots = useMemo(() => {
    return availableSlots.filter(slot => slot.available);
  }, [availableSlots]);

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hr ${mins} min`;
  };

  return (
    <div className="space-y-6">
      {/* Selector horizontal de días */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3 text-center">
          Selecciona un día
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {days.map((day) => {
            const isSelected = selected && isSameDay(day, selected);
            return (
              <button
                key={day.toISOString()}
                onClick={() => onSelect(day)}
                className={`
                  flex-shrink-0 w-14 h-20 rounded-2xl flex flex-col items-center justify-center transition-all
                  ${isSelected
                    ? 'bg-[#E8943D] text-white shadow-lg'
                    : 'bg-white border-2 border-gray-100 hover:border-[#E8943D]/50 text-gray-700'
                  }
                `}
              >
                <span className={`text-xs font-medium ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                  {getDayName(day)}
                </span>
                <span className="text-xl font-bold mt-1">
                  {format(day, 'd')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selector de horario */}
      {selected && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3 text-center">
            Horarios disponibles
          </h3>
          {onlyAvailableSlots.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">
                No hay horarios disponibles para este día.
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Por favor selecciona otro día.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {onlyAvailableSlots.map(({ time }) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`
                    py-3 px-2 rounded-xl text-sm font-medium transition-all
                    ${selectedTime === time
                      ? 'bg-[#E8943D] text-white shadow-md'
                      : 'bg-white border-2 border-gray-100 hover:border-[#E8943D] text-gray-700'
                    }
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Resumen de selección */}
      {(selected || selectedTime) && (
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tiempo estimado:</span>
            <span className="font-bold text-[#E8943D]">{formatTime(totalMinutes)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
