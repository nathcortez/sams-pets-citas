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

export default function PetForm({ data, onChange }: PetFormProps) {
  const [prefix, setPrefix] = useState('+502');

  const updateField = (field: keyof PetFormData, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

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

      {/* Raza y edad */}
      <div>
        <label className="block text-xs font-medium text-[--azul-oscuro] mb-1">
          Raza y edad *
        </label>
        <input
          type="text"
          value={data.petBreedAge}
          onChange={(e) => updateField('petBreedAge', e.target.value)}
          placeholder="Ej: Golden Retriever, 3 años"
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
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          <input
            type="tel"
            value={data.whatsapp}
            onChange={(e) => updateField('whatsapp', e.target.value)}
            placeholder="49037428"
            className="flex-1 px-3 py-2 rounded-lg border-2 border-[--azul-claro]/30 focus:border-[--azul-principal] focus:outline-none transition-colors text-sm"
          />
        </div>
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

      {/* Servicio adicional */}
      <div className="bg-[--naranja]/10 rounded-xl p-3">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.additionalService}
            onChange={(e) => updateField('additionalService', e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-[--azul-principal] focus:ring-[--azul-principal]"
          />
          <div>
            <span className="text-xs font-medium text-[--azul-oscuro]">
              ¿Tu perro necesita servicio adicional?
            </span>
            <p className="text-xs text-[--gris] mt-0.5">
              Si tu perro está enredado y necesita recuperación de manto,
              este servicio tiene costo adicional y requiere tiempo extra.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
