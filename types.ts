export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  effectValue: number; // CPS (clicks per second) or Click Power
  type: 'auto' | 'manual'; // 'auto' increases passive income, 'manual' increases click power
  count: number;
  icon: string;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
}

export interface GameState {
  score: number;
  totalScore: number; // Lifetime score
  clickPower: number;
  autoClicksPerSecond: number;
  lastSaveTime: number;
}