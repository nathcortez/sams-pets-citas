'use client';

import { useState } from 'react';
import { Service, SERVICES } from '@/types/breed';

interface ServiceSelectionProps {
  selectedService?: Service;
  baseTimeMinutes: number;
  onSelect: (service: Service) => void;
  showRecovery?: boolean;
  onRecoveryChange?: (show: boolean) => void;
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

const RECOVERY_SERVICE: Service = {
  id: 'recuperacion-manto',
  name: 'Recuperación de manto',
  icon: '🧶',
  description: '¿Agregar recuperación de manto? (+tiempo extra)',
  additionalTimeMinutes: 45,
};

export default function ServiceSelection({
  selectedService,
  baseTimeMinutes,
  onSelect,
  showRecovery: externalShowRecovery,
  onRecoveryChange,
}: ServiceSelectionProps) {
  const [internalShowRecovery, setInternalShowRecovery] = useState(false);

  const showRecovery = externalShowRecovery ?? internalShowRecovery;

  const handleRecoveryToggle = () => {
    const newValue = !showRecovery;
    setInternalShowRecovery(newValue);
    onRecoveryChange?.(newValue);
  };

  const recoveryTime = RECOVERY_SERVICE.additionalTimeMinutes;

  // Solo tiempos adicionales, sin tiempo base
  const totalTime = selectedService
    ? selectedService.additionalTimeMinutes + (showRecovery ? recoveryTime : 0)
    : showRecovery ? recoveryTime : 0;

  // Filtrar solo los servicios que queremos mostrar
  const filteredServices = SERVICES.filter(s =>
    ['bano-corte', 'paquete-completo', 'paquete-mensual'].includes(s.id)
  );

  return (
    <div className="space-y-6">
      {/* Grid de servicios */}
      <div className="grid grid-cols-1 gap-3">
        {filteredServices.map((service) => (
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

      {/* Toggle de Recuperación de manto */}
      {selectedService && (
        <div
          onClick={handleRecoveryToggle}
          className={`
            flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
            ${showRecovery
              ? 'border-[#E8943D] bg-[#E8943D]/10'
              : 'border-gray-200 hover:border-[#E8943D]/50 bg-white hover:bg-gray-50'
            }
          `}
        >
          <span className="text-3xl flex-shrink-0">{RECOVERY_SERVICE.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">{RECOVERY_SERVICE.name}</span>
              <span className="text-sm text-[#E8943D] font-medium">
                +{formatTime(RECOVERY_SERVICE.additionalTimeMinutes)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{RECOVERY_SERVICE.description}</p>
          </div>
          <div className={`
            w-6 h-6 rounded-md flex items-center justify-center transition-all
            ${showRecovery ? 'bg-[#E8943D]' : 'bg-gray-200'}
          `}>
            {showRecovery && (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Resumen de tiempo */}
      {selectedService && (
        <div className="bg-[#E8943D]/10 border border-[#E8943D]/30 rounded-xl p-4">
          <p className="text-sm text-center text-gray-700">
            <span className="font-medium">Tiempo adicional:</span>{' '}
            <span className="font-bold text-[#E8943D]">
              {formatTime(selectedService.additionalTimeMinutes)} adicionales
            </span>
            {showRecovery && (
              <> + {formatTime(recoveryTime)} (Recuperación)</>
            )}
            {showRecovery && (
              <span className="font-bold text-[#E8943D]">
                {' = '}{formatTime(totalTime)}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
