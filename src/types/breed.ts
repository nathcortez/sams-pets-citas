export type PetSize = 'pequeno' | 'mediano' | 'intermedio' | 'grande';

export interface PetBreed {
  name: string;
  emoji: string;
  size: PetSize;
  baseTimeMinutes: number;
}

export const PET_BREEDS: Record<PetSize, PetBreed[]> = {
  pequeno: [
    { name: 'Chihuahua',  emoji: '🐕', size: 'pequeno', baseTimeMinutes: 30 },
    { name: 'Cachorro',   emoji: '🐶', size: 'pequeno', baseTimeMinutes: 30 },
    { name: 'Mestizo',    emoji: '🐕', size: 'pequeno', baseTimeMinutes: 30 },
  ],
  mediano: [
    { name: 'French Poodle',        emoji: '🐩', size: 'mediano', baseTimeMinutes: 60 },
    { name: 'Schnauzer',            emoji: '🐕', size: 'mediano', baseTimeMinutes: 60 },
    { name: 'Yorkie',               emoji: '🐶', size: 'mediano', baseTimeMinutes: 60 },
    { name: 'Pomerania',            emoji: '🐕', size: 'mediano', baseTimeMinutes: 60 },
    { name: 'Mestizo',              emoji: '🐕', size: 'mediano', baseTimeMinutes: 60 },
    { name: 'Maltés',               emoji: '🐕', size: 'mediano', baseTimeMinutes: 60 },
    { name: 'Bulldog Francés',      emoji: '🐶', size: 'mediano', baseTimeMinutes: 60 },
    { name: 'Pug',                  emoji: '🐕', size: 'mediano', baseTimeMinutes: 60 },
    { name: 'Shih Tzu',             emoji: '🐕', size: 'mediano', baseTimeMinutes: 60 },
    { name: 'Bichón Frisé',         emoji: '🐩', size: 'mediano', baseTimeMinutes: 60 },
    { name: 'Dachshund (Salchicha)',emoji: '🌭', size: 'mediano', baseTimeMinutes: 60 },
  ],
  intermedio: [
    { name: 'Cocker Spaniel',    emoji: '🐕', size: 'intermedio', baseTimeMinutes: 90 },
    { name: 'Beagle',            emoji: '🐕', size: 'intermedio', baseTimeMinutes: 90 },
    { name: 'Pitbull',           emoji: '🐕', size: 'intermedio', baseTimeMinutes: 90 },
    { name: 'Boston Terrier',    emoji: '🐶', size: 'intermedio', baseTimeMinutes: 90 },
    { name: 'Bulldog Inglés',    emoji: '🐶', size: 'intermedio', baseTimeMinutes: 90 },
    { name: 'Pastor Australiano',emoji: '🐕', size: 'intermedio', baseTimeMinutes: 90 },
    { name: 'Jack Russell Terrier', emoji: '🐕', size: 'intermedio', baseTimeMinutes: 90 },
  ],
  grande: [
    { name: 'Shar Pei',           emoji: '🐕', size: 'grande', baseTimeMinutes: 120 },
    { name: 'Pastor Alemán',      emoji: '🐕', size: 'grande', baseTimeMinutes: 120 },
    { name: 'Labrador',           emoji: '🐕', size: 'grande', baseTimeMinutes: 120 },
    { name: 'Golden Retriever',   emoji: '🐕', size: 'grande', baseTimeMinutes: 120 },
    { name: 'Husky',              emoji: '🐕', size: 'grande', baseTimeMinutes: 120 },
    { name: 'Dóberman',           emoji: '🐕', size: 'grande', baseTimeMinutes: 120 },
    { name: 'Boxer',              emoji: '🐕', size: 'grande', baseTimeMinutes: 120 },
    { name: 'San Bernardo',       emoji: '🐕', size: 'grande', baseTimeMinutes: 120 },
    { name: 'Rottweiler',         emoji: '🐕', size: 'grande', baseTimeMinutes: 120 },
    { name: 'Viejo Pastor Inglés',emoji: '🐕', size: 'grande', baseTimeMinutes: 120 },
  ],
};

export const BASE_TIME_BY_SIZE: Record<PetSize, number> = {
  pequeno:    30,
  mediano:    60,
  intermedio: 90,
  grande:    120,
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
    id: 'grooming-completo',
    name: 'Grooming Completo',
    icon: '✂️',
    description: 'Baño · Corte · Limado de uñas · Limpieza de oídos',
    additionalTimeMinutes: 0,
  },
];

export const RECOVERY_SERVICE: Service = {
  id: 'recuperacion-manto',
  name: 'Recuperación de manto',
  icon: '🧶',
  description: 'Tratamiento especial para recuperar y nutrir el pelaje',
  additionalTimeMinutes: 45,
};

export const CORTE_DEFINIDO_SERVICE: Service = {
  id: 'corte-definido',
  name: 'Corte definido',
  icon: '✂️',
  description: 'Acabado con líneas precisas y definición del corte',
  additionalTimeMinutes: 30,
};
