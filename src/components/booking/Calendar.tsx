'use client';

import { DayPicker } from 'react-day-picker';
import { addDays, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-day-picker/style.css';

interface CalendarProps {
  selected: Date | undefined;
  onSelect: (date: Date) => void;
}

export default function Calendar({ selected, onSelect }: CalendarProps) {
  const today = startOfDay(new Date());
  const maxDate = addDays(today, 60);

  const disabledDays = [
    { from: new Date(0), to: addDays(today, -1) },
    { from: addDays(maxDate, 1), to: new Date(2099, 11, 31) },
    { dayOfWeek: [0] },
  ];

  return (
    <div className="bg-[--azul-claro]/20 rounded-2xl p-3 shadow-lg border-2 border-[--azul-claro]/30 max-w-[260px] mx-auto">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(date) => date && onSelect(date)}
        disabled={disabledDays}
        locale={es}
        classNames={{
          root: 'w-full',
          caption: 'flex justify-center items-center gap-4 mb-2',
          month_caption: 'text-center font-semibold text-lg text-[--azul-oscuro]',
          nav: 'flex gap-2',
          nav_button: 'text-[--azul-principal] hover:text-[--azul-oscuro]',
          weekdays: 'flex mb-1',
          weekday: 'flex-1 text-center text-xs font-bold text-white bg-[--azul-principal] py-1 rounded-md',
          weeks: 'flex flex-col gap-1',
          week: 'flex gap-1',
          day_button: 'flex-1 aspect-square flex items-center justify-center text-sm font-medium rounded-md transition-all',
          selected: 'bg-[#E8943D] text-white font-bold shadow-md',
          today: 'border-2 border-[--naranja] font-bold text-[--naranja]',
          disabled: 'bg-gray-100 text-gray-300 cursor-not-allowed',
        }}
      />
    </div>
  );
}
