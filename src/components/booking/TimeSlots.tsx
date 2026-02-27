'use client';

import { useState } from 'react';

interface TimeSlotsProps {
  selected: string | undefined;
  onSelect: (time: string) => void;
}

// Time slots for small breed (1 hour each)
const SMALL_BREED_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '14:00', '15:00'
];

// Time slots for large breed (1:30 each)
const LARGE_BREED_SLOTS = [
  '08:00', '09:30', '11:00', '14:00'
];

export default function TimeSlots({ selected, onSelect }: TimeSlotsProps) {
  const [breedSize, setBreedSize] = useState<'pequena' | 'grande'>('pequena');

  const timeSlots = breedSize === 'pequena' ? SMALL_BREED_SLOTS : LARGE_BREED_SLOTS;

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
      {/* Breed size selector */}
      <div className="mb-4">
        <p className="text-base font-bold text-[--azul-oscuro] mb-3 text-center">¿Qué tamaño es tu mascota?</p>
        <div className="flex gap-3">
          <button
            onClick={() => setBreedSize('pequena')}
            className={`flex-1 py-4 px-4 rounded-xl text-base font-bold transition-all ${
              breedSize === 'pequena'
                ? 'bg-[#E8943D] text-white shadow-md'
                : 'bg-[--azul-claro]/30 text-[--azul-oscuro] hover:bg-[--azul-claro]/50'
            }`}
          >
            🐕 Raza pequeña
          </button>
          <button
            onClick={() => setBreedSize('grande')}
            className={`flex-1 py-4 px-4 rounded-xl text-base font-bold transition-all ${
              breedSize === 'grande'
                ? 'bg-[#E8943D] text-white shadow-md'
                : 'bg-[--azul-claro]/30 text-[--azul-oscuro] hover:bg-[--azul-claro]/50'
            }`}
          >
            🦮 Raza grande
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {timeSlots.map((time) => {
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
                    ? 'bg-[#E8943D] text-white shadow-md'
                    : 'bg-[--azul-claro]/20 text-[--azul-oscuro] hover:bg-[--azul-claro]/40'
                }
              `}
            >
              {formatTime(time)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
