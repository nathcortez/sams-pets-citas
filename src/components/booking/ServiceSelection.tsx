'use client';

import { useEffect } from 'react';
import { Service, SERVICES, RECOVERY_SERVICE } from '@/types/breed';

interface ServiceSelectionProps {
  selectedService?: Service;
  baseTimeMinutes: number;
  onSelect: (service: Service) => void;
  showRecovery?: boolean;
  onRecoveryChange?: (show: boolean) => void;
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours} hora${hours > 1 ? 's' : ''}`;
  return `${hours} hora${hours > 1 ? 's' : ''} ${mins} min`;
}

const GROOMING_INCLUDES = [
  { icon: '🛁', label: 'Baño completo' },
  { icon: '✂️', label: 'Corte de pelo' },
  { icon: '💅', label: 'Limado de uñas' },
  { icon: '👂', label: 'Limpieza de oídos' },
];

export default function ServiceSelection({
  selectedService,
  baseTimeMinutes,
  onSelect,
  showRecovery = false,
  onRecoveryChange,
}: ServiceSelectionProps) {
  const groomingService = SERVICES[0]; // grooming-completo

  // Auto-seleccionar Grooming Completo al montar
  useEffect(() => {
    if (!selectedService) {
      onSelect(groomingService);
    }
  }, []);

  const totalTime = baseTimeMinutes + (showRecovery ? RECOVERY_SERVICE.additionalTimeMinutes : 0);

  return (
    <div className="space-y-5">

      {/* Tarjeta Grooming Completo */}
      <div className="rounded-2xl border-2 border-[#E8943D] bg-[#E8943D]/5 p-5">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{groomingService.icon}</span>
          <div>
            <h3 className="font-bold text-gray-900 text-base">{groomingService.name}</h3>
            <p className="text-xs text-gray-500">Servicio incluido</p>
          </div>
          {/* Checkmark */}
          <div className="ml-auto w-6 h-6 rounded-full bg-[#E8943D] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Lo que incluye */}
        <div className="grid grid-cols-2 gap-2">
          {GROOMING_INCLUDES.map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-[#E8943D]/20">
              <span className="text-lg">{icon}</span>
              <span className="text-sm text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle Recuperación de manto */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
          Servicio adicional (opcional)
        </p>
        <button
          type="button"
          onClick={() => onRecoveryChange?.(!showRecovery)}
          className={`
            w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left
            ${showRecovery
              ? 'border-[#E8943D] bg-[#E8943D]/10'
              : 'border-gray-200 hover:border-[#E8943D]/40 bg-white'
            }
          `}
        >
          <span className="text-3xl flex-shrink-0">{RECOVERY_SERVICE.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 text-sm">{RECOVERY_SERVICE.name}</span>
              <span className="text-sm font-bold text-[#E8943D]">
                +{formatTime(RECOVERY_SERVICE.additionalTimeMinutes)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{RECOVERY_SERVICE.description}</p>
          </div>
          {/* Checkbox */}
          <div className={`
            flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all
            ${showRecovery ? 'bg-[#E8943D] border-[#E8943D]' : 'border-gray-300 bg-white'}
          `}>
            {showRecovery && (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* Resumen de tiempo total */}
      <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">Tiempo estimado de la cita:</span>
        <span className="font-bold text-[#E8943D] text-base">{formatTime(totalTime)}</span>
      </div>

    </div>
  );
}
