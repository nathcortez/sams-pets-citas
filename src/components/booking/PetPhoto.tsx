'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface PetPhotoProps {
  photoData?: string;
  onPhotoChange: (photoData: string) => void;
}

export default function PetPhoto({ photoData, onPhotoChange }: PetPhotoProps) {
  const [preview, setPreview] = useState<string | null>(photoData || null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onPhotoChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setPreview(null);
    onPhotoChange('');
    setIsTakingPhoto(true);
    // Trigger file input click
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  const openCamera = () => {
    setIsTakingPhoto(true);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Descripción */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-600 text-center">
          Para brindarte un mejor servicio, nos ayuda ver el estado actual de tu mascota.
          Esta foto es opcional pero recomendada.
        </p>
      </div>

      {/* Input de archivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview de la foto o botón para tomar */}
      {!preview ? (
        <button
          onClick={openCamera}
          className="w-full py-6 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-3"
        >
          <span className="text-2xl">📷</span>
          Tomar foto ahora
        </button>
      ) : (
        <div className="space-y-4">
          {/* Preview de la imagen */}
          <div className="relative aspect-square max-h-80 mx-auto rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={preview}
              alt="Foto de tu mascota"
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Botón para volver a tomar */}
          <button
            onClick={handleRetake}
            className="w-full py-3 px-6 border-2 border-gray-200 hover:border-[#E8943D] text-gray-600 hover:text-[#E8943D] font-medium rounded-xl transition-colors"
          >
            Volver a tomar
          </button>
        </div>
      )}
    </div>
  );
}
