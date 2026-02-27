'use client';

import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-day-picker/style.css';

interface CalendarProps {
  selected: Date | undefined;
  onSelect: (date: Date) => void;
}

export default function Calendar({ selected, onSelect }: CalendarProps) {
  const today = startOfDay(new Date());
  const maxDate = addDays(today, 60); // hasta 60 días adelante

  const disabledDays = [
    { from: new Date(0), to: addDays(today, -1) }, // días pasados
    { from: addDays(maxDate, 1), to: new Date(2099, 11, 31) }, // más de 60 días
    { dayOfWeek: [0] }, // domingos
  ];

  return (
    <div className="bg-[--azul-claro]/20 rounded-2xl p-2 shadow-lg border-2 border-[--azul-claro]/30">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(date) => date && onSelect(date)}
        disabled={disabledDays}
        locale={es}
        classNames={{
          root: 'w-full',
          month_caption: 'text-center font-semibold text-base text-[--azul-oscuro] mb-2',
          weekday: 'text-center text-xs font-medium text-[--gris] uppercase w-9 h-9 flex items-center justify-center',
          day: 'text-center w-9 h-9 p-0',
          day_button: 'w-full h-full rounded-lg flex items-center justify-center text-sm font-medium transition-all hover:bg-[--azul-claro]/40',
          selected: 'bg-[#E8943D] text-white rounded-lg shadow-md font-bold',
          today: 'font-bold text-[--naranja] border-2 border-[--naranja] rounded-lg',
          disabled: 'text-gray-300 cursor-not-allowed',
          month_grid: 'gap-0',
          week: 'gap-0',
        }}
        components={{
          Chevron: ({ orientation }) => {
            if (orientation === 'left') {
              return <span className="text-[--azul-principal] text-sm">◀</span>;
            }
            return <span className="text-[--azul-principal] text-sm">▶</span>;
          }
        }}
      />
    </div>
  );
}
