export type PetSize = 'pequeno' | 'mediano' | 'grande';

export interface PetBreed {
  name: string;
  emoji: string;
  size: PetSize;
  baseTimeMinutes: number;
}

export const PET_BREEDS: Record<PetSize, PetBreed[]> = {
  pequeno: [
    { name: 'Poodle Toy', emoji: '🐩', size: 'pequeno', baseTimeMinutes: 45 },
    { name: 'Yorkshire Terrier', emoji: '🐶', size: 'pequeno', baseTimeMinutes: 45 },
    { name: 'Chihuahua', emoji: '🐕', size: 'pequeno', baseTimeMinutes: 45 },
    { name: 'Pomerania', emoji: '🐕', size: 'pequeno', baseTimeMinutes: 45 },
    { name: 'Schnauzer Miniatura', emoji: '🐕', size: 'pequeno', baseTimeMinutes: 45 },
  ],
  mediano: [
    { name: 'Cocker Spaniel', emoji: '🐕', size: 'mediano', baseTimeMinutes: 75 },
    { name: 'Schnauzer Estándar', emoji: '🐕', size: 'mediano', baseTimeMinutes: 75 },
    { name: 'Bulldog Francés', emoji: '🐶', size: 'mediano', baseTimeMinutes: 75 },
    { name: 'Beagle', emoji: '🐕', size: 'mediano', baseTimeMinutes: 75 },
    { name: 'Bull Terrier', emoji: '🐶', size: 'mediano', baseTimeMinutes: 75 },
    { name: 'Shar Pei', emoji: '🐕', size: 'mediano', baseTimeMinutes: 75 },
    { name: 'Basset Hound', emoji: '🐕', size: 'mediano', baseTimeMinutes: 75 },
    { name: 'Border Collie', emoji: '🐕', size: 'mediano', baseTimeMinutes: 75 },
    { name: 'Maltés', emoji: '🐕', size: 'mediano', baseTimeMinutes: 75 },
    { name: 'Bichón Frisé', emoji: '🐩', size: 'mediano', baseTimeMinutes: 75 },
    { name: 'Shih Tzu', emoji: '🐕', size: 'mediano', baseTimeMinutes: 75 },
  ],
  grande: [
    { name: 'Golden Retriever', emoji: '🐕', size: 'grande', baseTimeMinutes: 105 },
    { name: 'Labrador', emoji: '🐕', size: 'grande', baseTimeMinutes: 105 },
    { name: 'Pastor Alemán', emoji: '🐕', size: 'grande', baseTimeMinutes: 105 },
    { name: 'Husky Siberiano', emoji: '🐕', size: 'grande', baseTimeMinutes: 105 },
    { name: 'Rottweiler', emoji: '🐕', size: 'grande', baseTimeMinutes: 105 },
    { name: 'Gran Danés', emoji: '🐕', size: 'grande', baseTimeMinutes: 105 },
    { name: 'Samoyedo', emoji: '🐕', size: 'grande', baseTimeMinutes: 105 },
    { name: 'Dálmata', emoji: '🐕', size: 'grande', baseTimeMinutes: 105 },
  ],
};

export const BASE_TIME_BY_SIZE: Record<PetSize, number> = {
  pequeno: 45,
  mediano: 75,
  grande: 105,
};

export interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
  additionalTimeMinutes: number;
}

export const SERVICES: Service[] = [
  {
    id: 'bano-basico',
    name: 'Baño básico',
    icon: '🛁',
    description: 'Baño con shampoo, secado y cepillado',
    additionalTimeMinutes: 30,
  },
  {
    id: 'bano-corte',
    name: 'Baño + Corte',
    icon: '✂️',
    description: 'Baño completo más corte de pelo al estilo de la raza',
    additionalTimeMinutes: 60,
  },
  {
    id: 'corte-unas',
    name: 'Corte de uñas',
    icon: '💅',
    description: 'Solo corte y limado de uñas',
    additionalTimeMinutes: 15,
  },
  {
    id: 'limpieza-oidos',
    name: 'Limpieza de oídos',
    icon: '👂',
    description: 'Limpieza profunda de oídos',
    additionalTimeMinutes: 15,
  },
  {
    id: 'limpieza-dental',
    name: 'Limpieza dental',
    icon: '🦷',
    description: 'Cepillado dental básico',
    additionalTimeMinutes: 20,
  },
  {
    id: 'paquete-completo',
    name: 'Paquete completo',
    icon: '⭐',
    description: 'Baño + corte + uñas + oídos + dental',
    additionalTimeMinutes: 105,
  },
  {
    id: 'antipulgas',
    name: 'Tratamiento antipulgas',
    icon: '🧴',
    description: 'Baño medicado antipulgas y garrapatas',
    additionalTimeMinutes: 45,
  },
  {
    id: 'spa-premium',
    name: 'Spa premium',
    icon: '🎀',
    description: 'Paquete completo + tratamiento de pelo + perfume + bandana',
    additionalTimeMinutes: 120,
  },
];
