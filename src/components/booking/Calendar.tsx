'use client';

import { DayPicker } from 'react-day-picker';
import { addDays, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

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
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      border: '2px solid #7BB3E0',
      maxWidth: '320px',
      margin: '0 auto'
    }}>
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(date) => date && onSelect(date)}
        disabled={disabledDays}
        locale={es}
        classNames={{
          root: 'w-full',
          caption: 'flex justify-between items-center w-full mb-3',
          month_caption: 'text-center font-bold text-xl text-[#2E4A7A]',
          nav: 'flex gap-1',
          nav_button: 'text-[#4A6FA5] hover:text-[#2E4A7A] text-xl font-bold px-3 py-1',
          weekdays: 'flex mb-3 bg-[#4A6FA5] rounded-lg p-1',
          weekday: 'flex-1 text-center text-white font-bold text-xs py-2',
          weeks: 'flex flex-col gap-2',
          week: 'flex gap-2 justify-between',
          day_button: 'flex-1 aspect-square flex items-center justify-center text-base font-medium rounded-lg transition-all hover:bg-[#7BB3E0]/30',
          selected: 'bg-[#E8943D] text-white font-bold shadow-md',
          today: 'border-2 border-[#E8943D] font-bold text-[#E8943D]',
          disabled: 'bg-gray-100 text-gray-300 cursor-not-allowed opacity-50',
        }}
      />
    </div>
  );
}
