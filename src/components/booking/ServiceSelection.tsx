'use client';

import { Service, SERVICES } from '@/types/breed';

interface ServiceSelectionProps {
  selectedService?: Service;
  baseTimeMinutes: number;
  onSelect: (service: Service) => void;
}

function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} hora${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hora${hours > 1 ? 's' : ''} ${mins} min`;
}

export default function ServiceSelection({
  selectedService,
  baseTimeMinutes,
  onSelect,
}: ServiceSelectionProps) {
  const totalTime = selectedService
    ? baseTimeMinutes + selectedService.additionalTimeMinutes
    : baseTimeMinutes;

  return (
    <div className="space-y-6">
      {/* Pregunta principal */}
      <h3 className="text-lg font-semibold text-[--azul-oscuro] text-center">
        ¿Qué servicio necesitas?
      </h3>

      {/* Grid de servicios */}
      <div className="grid grid-cols-1 gap-3">
        {SERVICES.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className={`
              flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left
              ${selectedService?.id === service.id
                ? 'border-[#E8943D] bg-[#E8943D]/10'
                : 'border-gray-200 hover:border-[#E8943D]/50 bg-white hover:bg-gray-50'
              }
            `}
          >
            <span className="text-3xl flex-shrink-0">{service.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{service.name}</span>
                <span className="text-sm text-[#E8943D] font-medium">
                  +{formatTime(service.additionalTimeMinutes)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{service.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Resumen de tiempo */}
      {selectedService && (
        <div className="bg-[#E8943D]/10 border border-[#E8943D]/30 rounded-xl p-4">
          <p className="text-sm text-center text-gray-700">
            <span className="font-medium">Tiempo estimado:</span>{' '}
            {formatTime(baseTimeMinutes)} ({selectedService.name}) +{' '}
            {formatTime(selectedService.additionalTimeMinutes)} ={' '}
            <span className="font-bold text-[#E8943D]">
              {formatTime(totalTime)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
