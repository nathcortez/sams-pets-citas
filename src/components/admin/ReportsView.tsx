'use client';

import { useMemo, useState } from 'react';
import { Appointment } from '@/types/appointment';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReportsViewProps {
  appointments: Appointment[];
}

type PeriodFilter = 'all' | 'week' | 'month';

const STATUS_CONFIG = {
  pendiente:  { label: 'Pendientes',  emoji: '⏳', bar: 'bg-yellow-400' },
  confirmada: { label: 'Confirmadas', emoji: '✅', bar: 'bg-blue-400'   },
  completada: { label: 'Realizadas',  emoji: '🎉', bar: 'bg-green-400'  },
  cancelada:  { label: 'Canceladas',  emoji: '❌', bar: 'bg-red-400'    },
};

const SIZE_CONFIG: Record<string, { label: string; emoji: string }> = {
  pequeno:    { label: 'Pequeño',    emoji: '🐕' },
  mediano:    { label: 'Mediano',    emoji: '🐩' },
  intermedio: { label: 'Intermedio', emoji: '🦮' },
  grande:     { label: 'Grande',     emoji: '🐕‍🦺' },
};

export default function ReportsView({ appointments }: ReportsViewProps) {
  const [period, setPeriod] = useState<PeriodFilter>('month');

  const now = new Date();

  const filtered = useMemo(() => {
    if (period === 'all') return appointments;
    const interval =
      period === 'week'
        ? { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) }
        : { start: startOfMonth(now), end: endOfMonth(now) };
    return appointments.filter((a) => {
      try { return isWithinInterval(parseISO(a.date), interval); } catch { return false; }
    });
  }, [appointments, period]);

  const total = filtered.length;

  // Por estado
  const byStatus = useMemo(() =>
    (['pendiente', 'confirmada', 'completada', 'cancelada'] as const).map((s) => {
      const count = filtered.filter((a) => a.status === s).length;
      return { status: s, count, pct: total > 0 ? Math.round((count / total) * 100) : 0 };
    }),
  [filtered, total]);

  // Por tamaño
  const bySize = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((a) => {
      const key = a.petSize || 'sin_datos';
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .map(([size, count]) => ({ size, count, pct: total > 0 ? Math.round((count / total) * 100) : 0 }))
      .sort((a, b) => b.count - a.count);
  }, [filtered, total]);

  // Por día de la semana (solo citas completadas)
  const completadas = filtered.filter((a) => a.status === 'completada');
  const byDay = useMemo(() => {
    const days: Record<string, number> = { Lun: 0, Mar: 0, Mié: 0, Jue: 0, Vie: 0, Sáb: 0 };
    completadas.forEach((a) => {
      try {
        const d = format(parseISO(a.date), 'EEE', { locale: es });
        const key = d.charAt(0).toUpperCase() + d.slice(1, 3);
        if (key in days) days[key]++;
      } catch {}
    });
    const maxVal = Math.max(...Object.values(days), 1);
    return Object.entries(days).map(([day, count]) => ({ day, count, pct: Math.round((count / maxVal) * 100) }));
  }, [completadas]);

  const periodLabel = period === 'week' ? 'esta semana' : period === 'month' ? 'este mes' : 'historial total';

  return (
    <div className="space-y-6">

      {/* Selector de período */}
      <div className="flex gap-2">
        {([['week', 'Esta semana'], ['month', 'Este mes'], ['all', 'Todo']] as [PeriodFilter, string][]).map(([p, label]) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              period === p ? 'bg-[#E8943D] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Total */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total de citas {periodLabel}</p>
        <p className="text-4xl font-bold text-[#1B3A5C]">{total}</p>
      </div>

      {/* Por estado */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-[#1B3A5C] mb-4">Estado de las citas</h3>
        <div className="space-y-3">
          {byStatus.map(({ status, count, pct }) => {
            const cfg = STATUS_CONFIG[status];
            return (
              <div key={status}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">
                    {cfg.emoji} {cfg.label}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {count} <span className="text-gray-400 font-normal">({pct}%)</span>
                  </span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${cfg.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Por tamaño de raza */}
      {bySize.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-[#1B3A5C] mb-4">Por tamaño de mascota</h3>
          <div className="space-y-3">
            {bySize.map(({ size, count, pct }) => {
              const cfg = SIZE_CONFIG[size] || { label: size, emoji: '🐾' };
              return (
                <div key={size}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{cfg.emoji} {cfg.label}</span>
                    <span className="text-sm font-bold text-gray-900">
                      {count} <span className="text-gray-400 font-normal">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#E8943D] transition-all duration-500"
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Días más activos (citas realizadas) */}
      {completadas.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-[#1B3A5C] mb-1">Días más activos</h3>
          <p className="text-xs text-gray-400 mb-4">Basado en citas realizadas</p>
          <div className="flex items-end gap-2 h-24">
            {byDay.map(({ day, count, pct }) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-[#1B3A5C]">{count > 0 ? count : ''}</span>
                <div className="w-full rounded-t-lg bg-[#E8943D]/20 flex items-end" style={{ height: '60px' }}>
                  <div className="w-full rounded-t-lg bg-[#E8943D] transition-all duration-500"
                    style={{ height: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-500">{day}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {total === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-4xl mb-2">📊</p>
          <p className="text-gray-500">No hay datos para {periodLabel}</p>
        </div>
      )}
    </div>
  );
}
