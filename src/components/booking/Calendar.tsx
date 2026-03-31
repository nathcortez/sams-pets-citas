'use client';

import { useState, useEffect, useMemo } from 'react';
import { format, addDays, startOfDay, isSameDay, parseISO, isWithinInterval, addMinutes, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Appointment } from '@/types/appointment';
import { PetBreed, Service } from '@/types/breed';
import { supabase } from '@/lib/supabase';

interface CalendarProps {
  selected: Date | undefined;
  onSelect: (date: Date) => void;
  selectedBreed?: PetBreed;
  selectedService?: Service;
  recoveryTimeMinutes?: number;
  selectedTime?: string;
  onTimeSelect?: (time: string) => void;
}

// Verificar si una fecha es domingo (0) o sábado (6)
export function isSunday(date: Date): boolean {
  return getDay(date) === 0;
}
export function isSaturday(date: Date): boolean {
  return getDay(date) === 6;
}
export function isWeekend(date: Date): boolean {
  return isSunday(date) || isSaturday(date);
}

// Generar los próximos 14 días (excluyendo Sábados y Domingos)
function getNext14Days(): Date[] {
  const today = startOfDay(new Date());
  const days: Date[] = [];
  let count = 0;
  while (days.length < 14 && count < 60) {
    const day = addDays(today, count);
    if (!isWeekend(day)) {
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

// Generar horarios disponibles entre 8:00 y 16:00
function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 8; hour <= 16; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 16) {
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
  const baseTime = apt.baseTimeMinutes || 30;
  const serviceTime = apt.serviceAdditionalTime || 0;
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

  // Horas de almuerzo: 12:00 - 13:00 (bloqueado)
  const lunchStartMinutes = 12 * 60;
  const lunchEndMinutes = 13 * 60;

  // Última hora de inicio: 16:00
  const lastPossibleStartMinutes = 16 * 60;
  // Cierre del negocio: 18:00
  const endOfBusinessMinutes = 18 * 60;

  // El horario de inicio no puede ser después de las 16:00
  if (slotStartMinutes > lastPossibleStartMinutes) {
    return false;
  }

  // La cita completa debe terminar antes de las 18:00
  if (slotEndMinutes >= endOfBusinessMinutes) {
    return false;
  }

  // La nueva cita no debe cruzarse con el almuerzo (12:00 - 13:00)
  const overlapsWithLunch = (
    slotStartMinutes < lunchEndMinutes && slotEndMinutes > lunchStartMinutes
  );
  
  // Obtener la fecha en formato YYYY-MM-DD
  const dateStr = format(startOfDay(date), 'yyyy-MM-dd');

  // Verificar solapamiento con citas existentes considerando su duración real
  for (const apt of appointments) {
    if (apt.status === 'cancelada') continue;
    const aptDateStr = apt.date ? String(apt.date).split('T')[0] : '';
    if (aptDateStr !== dateStr) continue;

    // Calcular duración real de la cita existente
    const aptDuration = getExistingAppointmentDuration(apt);
    const [aptHour, aptMinute] = apt.time.split(':').map(Number);
    const aptStartMinutes = aptHour * 60 + aptMinute;
    const aptEndMinutes = aptStartMinutes + aptDuration;

    // Bloquear si hay solapamiento
    const newStart = slotStartMinutes;
    const newEnd = slotEndMinutes;

    const overlaps = newStart < aptEndMinutes && newEnd > aptStartMinutes;
    if (overlaps) return false;
  }

  return true; // ✅ Sin solapamientos, slot disponible
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
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
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
      try {
        const today = format(new Date(), "yyyy-MM-dd");
        const future = format(addDays(new Date(), 20), "yyyy-MM-dd");

        const { data, error } = await supabase
          .from("appointments")
          .select("id, date, time, status, base_time_minutes, service_additional_time, recovery_time, pet_name, pet_breed, service_name")
          .gte("date", today)
          .lte("date", future)
          .neq("status", "cancelada");

        if (error) {
          console.error("Error cargando citas desde Supabase:", error);
          const local = JSON.parse(localStorage.getItem("sams-pets-appointments") || "[]");
          setAppointments(local);
          return;
        }

        const mapped = (data || []).map((row: any) => ({
          id: row.id,
          date: row.date,
          time: row.time,
          status: row.status,
          baseTimeMinutes: row.base_time_minutes,
          serviceAdditionalTime: row.service_additional_time,
          recoveryTime: row.recovery_time,
          petName: row.pet_name,
          petBreed: row.pet_breed,
          serviceName: row.service_name,
          createdAt: "",
          ownerName: "",
          whatsapp: "",
          additionalService: false,
        }));

        setAppointments(mapped);

        const { data: blockedData } = await supabase
          .from("blocked_dates")
          .select("date")
          .gte("date", format(new Date(), "yyyy-MM-dd"))
          .lte("date", format(addDays(new Date(), 20), "yyyy-MM-dd"));

        setBlockedDates((blockedData || []).map((r: any) => r.date));
      } catch (err) {
        console.error("Error en loadAppointments:", err);
        const local = JSON.parse(localStorage.getItem("sams-pets-appointments") || "[]");
        setAppointments(local);
      }
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
          {days.filter(day => !blockedDates.includes(format(day, "yyyy-MM-dd"))).map((day) => {
            const isSelected = selected && isSameDay(day, selected);
            return (
              <button
                key={day.toISOString()}
                onClick={() => { if (!isWeekend(day)) onSelect(day); }}
                disabled={isWeekend(day)}
                className={`
                  flex-shrink-0 w-14 h-20 rounded-2xl flex flex-col items-center justify-center transition-all
                  ${isWeekend(day)
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed opacity-50'
                    : isSelected
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