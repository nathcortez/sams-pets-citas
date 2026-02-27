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
    <div className="bg-[--azul-claro]/20 rounded-2xl p-4 shadow-lg border-2 border-[--azul-claro]/30">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(date) => date && onSelect(date)}
        disabled={disabledDays}
        locale={es}
        classNames={{
          root: 'w-full',
          month_caption: 'text-center font-semibold text-lg text-[--azul-oscuro] mb-2',
          weekday: 'text-center text-sm font-medium text-[--gris] uppercase',
          day: 'text-center',
          day_button: 'mx-auto w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all hover:bg-[--azul-claro]/30',
          selected: 'bg-[--azul-principal] !text-white rounded-full shadow-md',
          today: 'font-bold text-[--naranja] border-2 border-[--naranja] rounded-full',
          disabled: 'text-gray-300 cursor-not-allowed',
        }}
        components={{
          Chevron: ({ orientation }) => {
            if (orientation === 'left') {
              return <span className="text-[--azul-principal]">◀</span>;
            }
            return <span className="text-[--azul-principal]">▶</span>;
          }
        }}
      />
    </div>
  );
}
