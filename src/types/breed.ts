export type PetSize = 'pequeno' | 'mediano' | 'intermedio' | 'grande';

export interface PetBreed {
  name: string;
  emoji: string;
  size: PetSize;
  baseTimeMinutes: number;
}

export const PET_BREEDS: Record<PetSize, PetBreed[]> = {
  pequeno: [
    { name: 'Chihuahua', emoji: '🐕', size: 'pequeno', baseTimeMinutes: 30 },
    { name: 'Cachorro', emoji: '🐶', size: 'pequeno', baseTimeMinutes: 30 },
    { name: 'Mestizo', emoji: '🐕', size: 'pequeno', baseTimeMinutes: 30 },
  ],
  mediano: [
    { name: 'French Poodle', emoji: '🐩', size: 'mediano', baseTimeMinutes: 75 },
    { name: 'Schnauzer', emoji: '🐕', size: 'mediano', baseTimeMinutes: 75 },
    { name: 'Yorkie', emoji: '🐶', size: 'mediano', baseTimeMinutes: 75 },
    { name: 'Pomerania', emoji: '🐕', size: 'mediano', baseTimeMinutes: 75 },
    { name: 'Mestizo', emoji: '🐕', size: 'mediano', baseTimeMinutes: 75 },
    { name: 'Maltés', emoji: '🐕', size: 'mediano', baseTimeMinutes: 75 },
    { name: 'Bulldog Francés', emoji: '🐶', size: 'mediano', baseTimeMinutes: 75 },
    { name: 'Pug', emoji: '🐕', size: 'mediano', baseTimeMinutes: 75 },
    { name: 'Shih Tzu', emoji: '🐕', size: 'mediano', baseTimeMinutes: 75 },
  ],
  intermedio: [
    { name: 'Cocker Spaniel', emoji: '🐕', size: 'intermedio', baseTimeMinutes: 90 },
    { name: 'Beagle', emoji: '🐕', size: 'intermedio', baseTimeMinutes: 90 },
    { name: 'Pitbull', emoji: '🐕', size: 'intermedio', baseTimeMinutes: 90 },
    { name: 'Boston Terrier', emoji: '🐶', size: 'intermedio', baseTimeMinutes: 90 },
    { name: 'Bulldog Inglés', emoji: '🐶', size: 'intermedio', baseTimeMinutes: 90 },
  ],
  grande: [
    { name: 'Pastor Australiano', emoji: '🐕', size: 'grande', baseTimeMinutes: 105 },
    { name: 'Shar Pei', emoji: '🐕', size: 'grande', baseTimeMinutes: 105 },
    { name: 'Pastor Alemán', emoji: '🐕', size: 'grande', baseTimeMinutes: 105 },
    { name: 'Labrador', emoji: '🐕', size: 'grande', baseTimeMinutes: 105 },
    { name: 'Golden Retriever', emoji: '🐕', size: 'grande', baseTimeMinutes: 105 },
    { name: 'Husky', emoji: '🐕', size: 'grande', baseTimeMinutes: 105 },
    { name: 'Dóberman', emoji: '🐕', size: 'grande', baseTimeMinutes: 105 },
    { name: 'Boxer', emoji: '🐕', size: 'grande', baseTimeMinutes: 105 },
    { name: 'San Bernardo', emoji: '🐕', size: 'grande', baseTimeMinutes: 105 },
  ],
};

export const BASE_TIME_BY_SIZE: Record<PetSize, number> = {
  pequeno: 30,
  mediano: 75,
  intermedio: 90,
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
    id: 'bano-corte',
    name: 'Baño + Corte',
    icon: '✂️',
    description: 'Baño completo más corte de pelo al estilo de la raza',
    additionalTimeMinutes: 30,
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
    description: 'Baño + corte + uñas + oídos',
    additionalTimeMinutes: 75,
  },
  {
    id: 'paquete-mensual',
    name: 'Paquete mensual',
    icon: '📅',
    description: 'Sesión correspondiente a paquete mensual',
    additionalTimeMinutes: 75,
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
