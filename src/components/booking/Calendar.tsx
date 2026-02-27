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
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      maxWidth: '100%',
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
          caption: 'flex justify-between items-center w-full mb-6',
          month_caption: 'text-center font-medium text-lg text-[#374151]',
          nav: 'flex gap-0',
          nav_button: 'text-[#9CA3AF] hover:text-[#4A6FA5] text-2xl font-light px-3 py-2 min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors duration-200',
          weekdays: 'flex mb-4',
          weekday: 'flex-1 text-center text-[#9CA3AF] font-medium text-xs uppercase tracking-wider',
          weeks: 'flex flex-col gap-1',
          week: 'flex gap-1',
          day_button: 'flex-1 aspect-[1/1] flex items-center justify-center text-base font-normal text-[#374151] rounded-full transition-all duration-200 min-h-[44px] hover:bg-[#F3F4F6]',
          selected: 'bg-[#4A6FA5] text-white font-medium hover:bg-[#4A6FA5]',
          today: 'border-2 border-[#E8943D] text-[#E8943D] font-medium',
          disabled: 'text-[#D1D5DB] cursor-not-allowed hover:bg-transparent',
        }}
      />
    </div>
  );
}
