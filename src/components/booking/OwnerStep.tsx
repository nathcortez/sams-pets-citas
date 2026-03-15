"use client";

import { useRef } from "react";

interface OwnerStepProps {
  formData: {
    petName: string;
    petBreedAge: string;
    ownerName: string;
    whatsapp: string;
    comments: string;
    additionalService: boolean;
  };
  onChange: (data: any) => void;
  petPhotoData: string | undefined;
  onPhotoChange: (data: string | undefined) => void;
}

export default function OwnerStep({ formData, onChange, petPhotoData, onPhotoChange }: OwnerStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => onPhotoChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Foto de mascota - inline, compacta */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5E3DE]">
        <div className="flex items-center gap-4">
          {/* Preview o placeholder */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 rounded-2xl border-2 border-dashed border-[#E8943D] flex items-center justify-center cursor-pointer overflow-hidden flex-shrink-0 bg-[#FFF4EA]"
          >
            {petPhotoData ? (
              <img src={petPhotoData} alt="Mascota" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">📷</span>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-[#1B3A5C]">
              {petPhotoData ? "Foto agregada ✓" : "Agrega una foto (opcional)"}
            </p>
            <p className="text-xs text-[#6B6B6B] mt-1">
              Nos ayuda a prepararnos para la cita
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-[#E8943D] font-medium mt-1 hover:underline"
            >
              {petPhotoData ? "Cambiar foto" : "Seleccionar foto"}
            </button>
          </div>
          {petPhotoData && (
            <button onClick={() => onPhotoChange(undefined)} className="text-[#6B6B6B] text-xs">✕</button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoCapture}
          className="hidden"
        />
      </div>

      {/* Campos del dueño */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5E3DE] space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1B3A5C] mb-2">👤 Tu nombre</label>
          <input
            type="text"
            value={formData.ownerName}
            onChange={(e) => onChange({ ...formData, ownerName: e.target.value })}
            placeholder="¿Cómo te llamas?"
            className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E3DE] focus:border-[#E8943D] focus:outline-none text-[#1B3A5C] transition-colors"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-medium text-[#1B3A5C] mb-2">📱 WhatsApp</label>
          <input
            type="tel"
            value={formData.whatsapp}
            onChange={(e) => onChange({ ...formData, whatsapp: e.target.value })}
            placeholder="Ej: 49037428"
            className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E3DE] focus:border-[#E8943D] focus:outline-none text-[#1B3A5C] transition-colors"
          />
          <p className="text-xs text-[#6B6B6B] mt-1">Te enviaremos la confirmación por aquí</p>
        </div>

        {/* Comentarios */}
        <div>
          <label className="block text-sm font-medium text-[#1B3A5C] mb-2">📝 Comentarios <span className="font-normal text-[#6B6B6B]">(opcional)</span></label>
          <textarea
            value={formData.comments}
            onChange={(e) => onChange({ ...formData, comments: e.target.value })}
            placeholder="¿Algo especial que debamos saber de tu mascota?"
            rows={2}
            className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E3DE] focus:border-[#E8943D] focus:outline-none text-[#1B3A5C] transition-colors resize-none"
          />
        </div>


      </div>
    </div>
  );
}
