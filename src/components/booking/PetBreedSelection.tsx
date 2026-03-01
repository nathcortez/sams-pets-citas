'use client';

import { useState } from 'react';
import { PetBreed, PetSize, PET_BREEDS, BASE_TIME_BY_SIZE } from '@/types/breed';

interface PetBreedSelectionProps {
  selectedBreed?: PetBreed;
  onSelect: (breed: PetBreed) => void;
}

export default function PetBreedSelection({ selectedBreed, onSelect }: PetBreedSelectionProps) {
  const [activeTab, setActiveTab] = useState<PetSize>('pequeno');
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherBreedName, setOtherBreedName] = useState('');
  const [otherBreedSize, setOtherBreedSize] = useState<PetSize>('pequeno');

  const handleBreedSelect = (breed: PetBreed) => {
    setShowOtherInput(false);
    onSelect(breed);
  };

  const handleOtherSubmit = () => {
    if (otherBreedName.trim()) {
      const newBreed: PetBreed = {
        name: otherBreedName.trim(),
        emoji: '🐕',
        size: otherBreedSize,
        baseTimeMinutes: BASE_TIME_BY_SIZE[otherBreedSize],
      };
      onSelect(newBreed);
      setShowOtherInput(false);
      setOtherBreedName('');
    }
  };

  const breeds = PET_BREEDS[activeTab];

  return (
    <div className="space-y-6">
      {/* Pregunta principal */}
      <h3 className="text-lg font-semibold text-[--azul-oscuro] text-center">
        ¿Qué tipo de mascota tienes?
      </h3>

      {/* Tabs de tamaño */}
      <div className="flex gap-2 justify-center">
        {(['pequeno', 'mediano', 'grande'] as PetSize[]).map((size) => (
          <button
            key={size}
            onClick={() => setActiveTab(size)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all capitalize
              ${activeTab === size
                ? 'bg-[#E8943D] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {size}
          </button>
        ))}
      </div>

      {/* Grid de razas */}
      <div className="grid grid-cols-2 gap-3">
        {breeds.map((breed) => (
          <button
            key={breed.name}
            onClick={() => handleBreedSelect(breed)}
            className={`
              flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all min-h-[80px]
              ${selectedBreed?.name === breed.name && selectedBreed?.size === breed.size
                ? 'border-[#E8943D] bg-[#E8943D]/10'
                : 'border-gray-200 hover:border-[#E8943D]/50 bg-white hover:bg-gray-50'
              }
            `}
          >
            <span className="text-3xl mb-1">{breed.emoji}</span>
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">
              {breed.name}
            </span>
          </button>
        ))}
      </div>

      {/* OpciónOtra raza */}
      {!showOtherInput ? (
        <button
          onClick={() => setShowOtherInput(true)}
          className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#E8943D] hover:text-[#E8943D] transition-colors"
        >
          + Otra raza
        </button>
      ) : (
        <div className="bg-gray-50 p-4 rounded-xl space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la raza
            </label>
            <input
              type="text"
              value={otherBreedName}
              onChange={(e) => setOtherBreedName(e.target.value)}
              placeholder="Ej: Mestizo, Criollo, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8943D] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamaño
            </label>
            <div className="flex gap-2">
              {(['pequeno', 'mediano', 'grande'] as PetSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setOtherBreedSize(size)}
                  className={`
                    flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all
                    ${otherBreedSize === size
                      ? 'bg-[#E8943D] text-white'
                      : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowOtherInput(false)}
              className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleOtherSubmit}
              disabled={!otherBreedName.trim()}
              className="flex-1 py-2 px-4 bg-[#E8943D] text-white rounded-lg hover:bg-[#d4802f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      {/* Mostrar selección actual */}
      {selectedBreed && (
        <div className="bg-[#E8943D]/10 border border-[#E8943D]/30 rounded-xl p-4">
          <p className="text-sm text-center text-gray-700">
            <span className="font-medium">Seleccionado:</span> {selectedBreed.emoji} {selectedBreed.name}
            <span className="text-gray-500 ml-2">
              ({selectedBreed.baseTimeMinutes} min base)
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
