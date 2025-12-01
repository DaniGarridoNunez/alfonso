import { Upgrade } from './types';

export const INITIAL_UPGRADES: Upgrade[] = [
  {
    id: 'u1',
    name: 'Dedo Índice Firme',
    description: 'Mejora tu técnica básica. +1 por click.',
    baseCost: 15,
    costMultiplier: 1.5,
    effectValue: 1,
    type: 'manual',
    count: 0,
    icon: '☝️'
  },
  {
    id: 'u2',
    name: 'Hermano Menor Molesto',
    description: 'Da una colleja automáticamente cada segundo.',
    baseCost: 50,
    costMultiplier: 1.3,
    effectValue: 2,
    type: 'auto',
    count: 0,
    icon: '👶'
  },
  {
    id: 'u3',
    name: 'Mano de Goma',
    description: 'Elástico y doloroso. +5 por click.',
    baseCost: 250,
    costMultiplier: 1.6,
    effectValue: 5,
    type: 'manual',
    count: 0,
    icon: '🖐️'
  },
  {
    id: 'u4',
    name: 'Ventilador de Collejas',
    description: 'Gira y golpea sin parar. +10 col/s.',
    baseCost: 1000,
    costMultiplier: 1.4,
    effectValue: 10,
    type: 'auto',
    count: 0,
    icon: '💨'
  },
  {
    id: 'u5',
    name: 'El "Abuelo" Cebolleta',
    description: 'Te enseña la técnica ancestral. +50 por click.',
    baseCost: 5000,
    costMultiplier: 1.8,
    effectValue: 50,
    type: 'manual',
    count: 0,
    icon: '👴'
  },
  {
    id: 'u6',
    name: 'Brazo Robótico',
    description: 'Precisión milimétrica. +100 col/s.',
    baseCost: 12000,
    costMultiplier: 1.5,
    effectValue: 100,
    type: 'auto',
    count: 0,
    icon: '🤖'
  },
    {
    id: 'u7',
    name: 'Guantelete del Infinito',
    description: 'Una colleja para gobernarlos a todos. +1000 col/s.',
    baseCost: 100000,
    costMultiplier: 2.0,
    effectValue: 1000,
    type: 'auto',
    count: 0,
    icon: '💎'
  }
];
