"use client";

import { PetBreed } from "@/types/breed";
import PetBreedSelection from "./PetBreedSelection";

interface PetStepProps {
  selectedBreed: PetBreed | undefined;
  petName: string;
  onBreedSelect: (breed: PetBreed) => void;
  onPetNameChange: (name: string) => void;
}

export default function PetStep({ selectedBreed, petName, onBreedSelect, onPetNameChange }: PetStepProps) {
  return (
    <div className="space-y-6">
      {/* Selección de raza - el componente existente */}
      <PetBreedSelection
        selectedBreed={selectedBreed}
        onSelect={onBreedSelect}
      />

      {/* Nombre de la mascota - aparece solo cuando hay raza seleccionada */}
      {selectedBreed && (
        <div className="animate-fade-in">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5E3DE]">
            <label className="block text-sm font-medium text-[#1B3A5C] mb-2">
              {selectedBreed.emoji} ¿Cómo se llama tu {selectedBreed.name}?
            </label>
            <input
              type="text"
              value={petName}
              onChange={(e) => onPetNameChange(e.target.value)}
              placeholder="Nombre de tu mascota"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E3DE] focus:border-[#E8943D] focus:outline-none text-[#1B3A5C] font-medium transition-colors bg-[#F8F7F4]"
              autoFocus
            />
            {petName.trim() && (
              <p className="text-xs text-[#6B6B6B] mt-2">
                ¡Listo! Agendemos la cita de {petName} 🐾
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
