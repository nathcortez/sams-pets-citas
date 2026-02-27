'use client';

import { TIME_SLOTS, SERVICE_HOURS } from '@/types/appointment';

interface TimeSlotsProps {
  selected: string | undefined;
  onSelect: (time: string) => void;
}

export default function TimeSlots({ selected, onSelect }: TimeSlotsProps) {
  const isLunchHour = (time: string): boolean => {
    const [hour] = time.split(':').map(Number);
    return hour >= 13 && hour < 14;
  };

  const formatTime = (time: string): string => {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg">
      <h3 className="text-lg font-semibold text-[--azul-oscuro] mb-4 text-center">
        Horarios disponibles
      </h3>
      <p className="text-sm text-[--gris] mb-4 text-center">
        Horario: 8:00 AM - 3:00 PM (Hora de almuerzo: 1:00 - 2:00 PM)
      </p>

      <div className="grid grid-cols-3 gap-3">
        {TIME_SLOTS.map((time) => {
          const isDisabled = isLunchHour(time);
          const isSelected = selected === time;

          return (
            <button
              key={time}
              onClick={() => !isDisabled && onSelect(time)}
              disabled={isDisabled}
              className={`
                py-3 px-2 rounded-xl text-sm font-medium transition-all
                ${isDisabled
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed line-through'
                  : isSelected
                    ? 'bg-[--azul-principal] text-white shadow-md'
                    : 'bg-[--azul-claro]/20 text-[--azul-oscuro] hover:bg-[--azul-claro]/40'
                }
              `}
            >
              {formatTime(time)}
            </button>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-[--amarillo]/10 rounded-xl">
        <p className="text-sm text-[--azul-oscuro]">
          ℹ️ La última cita disponible es a las 3:00 PM
        </p>
      </div>
    </div>
  );
}
