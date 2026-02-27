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
  { code: '+502', country: 'Guatemala' },
  { code: '+501', country: 'Belice' },
  { code: '+503', country: 'El Salvador' },
  { code: '+504', country: 'Honduras' },
  { code: '+505', country: 'Nicaragua' },
  { code: '+506', country: 'Costa Rica' },
  { code: '+507', country: 'Panamá' },
  { code: '+1', country: 'EE.UU./México' },
];

export default function PetForm({ data, onChange }: PetFormProps) {
  const [prefix, setPrefix] = useState('+502');

  const updateField = (field: keyof PetFormData, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg space-y-4">
      <h3 className="text-lg font-semibold text-[--azul-oscuro] mb-4">
        Datos de tu mascota
      </h3>

      {/* Nombre de la mascota */}
      <div>
        <label className="block text-sm font-medium text-[--azul-oscuro] mb-1">
          Nombre de la mascota *
        </label>
        <input
          type="text"
          value={data.petName}
          onChange={(e) => updateField('petName', e.target.value)}
          placeholder="Ej: Max"
          className="w-full px-4 py-3 rounded-xl border-2 border-[--azul-claro]/30 focus:border-[--azul-principal] focus:outline-none transition-colors"
        />
      </div>

      {/* Raza y edad */}
      <div>
        <label className="block text-sm font-medium text-[--azul-oscuro] mb-1">
          Raza y edad *
        </label>
        <input
          type="text"
          value={data.petBreedAge}
          onChange={(e) => updateField('petBreedAge', e.target.value)}
          placeholder="Ej: Golden Retriever, 3 años"
          className="w-full px-4 py-3 rounded-xl border-2 border-[--azul-claro]/30 focus:border-[--azul-principal] focus:outline-none transition-colors"
        />
      </div>

      {/* Nombre del propietario */}
      <div>
        <label className="block text-sm font-medium text-[--azul-oscuro] mb-1">
          Nombre del propietario/encargado *
        </label>
        <input
          type="text"
          value={data.ownerName}
          onChange={(e) => updateField('ownerName', e.target.value)}
          placeholder="Tu nombre"
          className="w-full px-4 py-3 rounded-xl border-2 border-[--azul-claro]/30 focus:border-[--azul-principal] focus:outline-none transition-colors"
        />
      </div>

      {/* WhatsApp */}
      <div>
        <label className="block text-sm font-medium text-[--azul-oscuro] mb-1">
          Número de WhatsApp *
        </label>
        <div className="flex gap-2">
          <select
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            className="px-3 py-3 rounded-xl border-2 border-[--azul-claro]/30 focus:border-[--azul-principal] focus:outline-none bg-white"
          >
            {COUNTRY_CODES.map(({ code, country }) => (
              <option key={code} value={code}>
                {code} ({country})
              </option>
            ))}
          </select>
          <input
            type="tel"
            value={data.whatsapp}
            onChange={(e) => updateField('whatsapp', e.target.value)}
            placeholder="49037428"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-[--azul-claro]/30 focus:border-[--azul-principal] focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Comentarios */}
      <div>
        <label className="block text-sm font-medium text-[--azul-oscuro] mb-1">
          ¿Tu mascota tiene alguna enfermedad, alergia o presenta agresividad?
        </label>
        <textarea
          value={data.comments}
          onChange={(e) => updateField('comments', e.target.value)}
          placeholder="Cuéntanos cualquier información importante..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border-2 border-[--azul-claro]/30 focus:border-[--azul-principal] focus:outline-none transition-colors resize-none"
        />
      </div>

      {/* Servicio adicional */}
      <div className="bg-[--naranja]/10 rounded-xl p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.additionalService}
            onChange={(e) => updateField('additionalService', e.target.checked)}
            className="mt-1 w-5 h-5 rounded text-[--azul-principal] focus:ring-[--azul-principal]"
          />
          <div>
            <span className="font-medium text-[--azul-oscuro]">
              ¿Tu perro necesita servicio adicional?
            </span>
            <p className="text-sm text-[--gris] mt-1">
              Si tu perro está enredado y necesita recuperación de manto,
              este servicio tiene costo adicional y requiere tiempo extra.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
