'use client';

import { useState } from 'react';

interface PetFormData {
  petName: string;
  petBreedAge: string;
  ownerName: string;
  whatsapp: string;
  comments: string;
  additionalService: boolean;
}

interface PetFormProps {
  data: PetFormData;
  onChange: (data: PetFormData) => void;
}

const COUNTRY_CODES = [
  { code: '+502', country: 'GT' },
  { code: '+501', country: 'BZ' },
  { code: '+503', country: 'SV' },
  { code: '+504', country: 'HN' },
  { code: '+505', country: 'NI' },
  { code: '+506', country: 'CR' },
  { code: '+507', country: 'PA' },
  { code: '+1', country: 'US' },
];

// Función para limpiar el número de WhatsApp
function cleanWhatsAppNumber(input: string): string {
  // Eliminar cualquier carácter que no sea número
  return input.replace(/[^\d]/g, '');
}

// Función para obtener el número completo con código de país
function getFullWhatsAppNumber(prefix: string, number: string): string {
  const cleaned = cleanWhatsAppNumber(number);
  const countryCode = prefix.replace('+', '');
  return countryCode + cleaned;
}

export default function PetForm({ data, onChange }: PetFormProps) {
  const [prefix, setPrefix] = useState('502');
  const [whatsappError, setWhatsappError] = useState('');

  const updateField = (field: keyof PetFormData, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  const handleWhatsAppChange = (value: string) => {
    // Limpiar el número automáticamente
    const cleaned = cleanWhatsAppNumber(value);

    // Concatenar con el código de país (sin el +)
    const fullNumber = prefix + cleaned;
    updateField('whatsapp', fullNumber);

    // Validar que tenga exactamente 8 dígitos (sin contar el código de país)
    const localNumber = cleaned;
    if (localNumber.length > 0 && localNumber.length !== 8) {
      setWhatsappError('El número debe tener 8 dígitos');
    } else {
      setWhatsappError('');
    }
  };

  // Obtener solo los dígitos locales para mostrar en el input
  const displayNumber = data.whatsapp.startsWith(prefix)
    ? data.whatsapp.slice(prefix.length)
    : data.whatsapp;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg space-y-3">
      {/* Nombre de la mascota */}
      <div>
        <label className="block text-xs font-medium text-[--azul-oscuro] mb-1">
          Nombre de la mascota *
        </label>
        <input
          type="text"
          value={data.petName}
          onChange={(e) => updateField('petName', e.target.value)}
          placeholder="Ej: Max"
          className="w-full px-3 py-2 rounded-lg border-2 border-[--azul-claro]/30 focus:border-[--azul-principal] focus:outline-none transition-colors text-sm"
        />
      </div>

      {/* Nombre del propietario */}
      <div>
        <label className="block text-xs font-medium text-[--azul-oscuro] mb-1">
          Nombre del propietario/encargado *
        </label>
        <input
          type="text"
          value={data.ownerName}
          onChange={(e) => updateField('ownerName', e.target.value)}
          placeholder="Tu nombre"
          className="w-full px-3 py-2 rounded-lg border-2 border-[--azul-claro]/30 focus:border-[--azul-principal] focus:outline-none transition-colors text-sm"
        />
      </div>

      {/* WhatsApp */}
      <div>
        <label className="block text-xs font-medium text-[--azul-oscuro] mb-1">
          Número de WhatsApp *
        </label>
        <div className="flex gap-2">
          <select
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            className="px-2 py-2 rounded-lg border-2 border-[--azul-claro]/30 focus:border-[--azul-principal] focus:outline-none bg-white text-xs w-20"
          >
            {COUNTRY_CODES.map(({ code, country }) => (
              <option key={code} value={code.replace('+', '')}>
                +{code.replace('+', '')}
              </option>
            ))}
          </select>
          <input
            type="tel"
            value={displayNumber}
            onChange={(e) => handleWhatsAppChange(e.target.value)}
            placeholder="55555555"
            className={`flex-1 px-3 py-2 rounded-lg border-2 focus:outline-none transition-colors text-sm ${
              whatsappError
                ? 'border-red-500 focus:border-red-500'
                : 'border-[--azul-claro]/30 focus:border-[--azul-principal]'
            }`}
          />
        </div>
        {whatsappError && (
          <p className="text-red-500 text-xs mt-1">{whatsappError}</p>
        )}
      </div>

      {/* Comentarios */}
      <div>
        <label className="block text-xs font-medium text-[--azul-oscuro] mb-1">
          ¿Tu mascota tiene alguna enfermedad, alergia o presenta agresividad?
        </label>
        <textarea
          value={data.comments}
          onChange={(e) => updateField('comments', e.target.value)}
          placeholder="Cuéntanos cualquier información importante..."
          rows={2}
          className="w-full px-3 py-2 rounded-lg border-2 border-[--azul-claro]/30 focus:border-[--azul-principal] focus:outline-none transition-colors resize-none text-sm"
        />
      </div>
    </div>
  );
}
