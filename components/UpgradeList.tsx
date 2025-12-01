import React from 'react';
import { Upgrade } from '../types';

interface UpgradeListProps {
  upgrades: Upgrade[];
  currentScore: number;
  onBuy: (upgradeId: string) => void;
}

export const UpgradeList: React.FC<UpgradeListProps> = ({ upgrades, currentScore, onBuy }) => {
  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-900/50 rounded-xl border border-gray-700 h-full overflow-y-auto custom-scrollbar">
      <h2 className="text-xl font-bold text-white mb-2 sticky top-0 bg-gray-900/90 p-2 z-10 backdrop-blur-sm">
        Tienda de Dolor
      </h2>
      {upgrades.map((u) => {
        const cost = Math.floor(u.baseCost * Math.pow(u.costMultiplier, u.count));
        const canAfford = currentScore >= cost;

        return (
          <button
            key={u.id}
            onClick={() => onBuy(u.id)}
            disabled={!canAfford}
            className={`
              relative group flex items-center p-3 rounded-lg border transition-all duration-200
              ${canAfford 
                ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-red-500 hover:scale-[1.02] active:scale-95 cursor-pointer' 
                : 'bg-gray-900 border-gray-800 opacity-60 cursor-not-allowed grayscale'
              }
            `}
          >
            <div className="text-4xl mr-4">{u.icon}</div>
            <div className="flex-1 text-left">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-200">{u.name}</span>
                <span className="text-xs bg-gray-950 px-2 py-1 rounded text-gray-400">Lvl {u.count}</span>
              </div>
              <p className="text-xs text-gray-400 leading-tight my-1">{u.description}</p>
              <div className={`text-sm font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                Cuesta: {cost.toLocaleString()} 
                <span className="text-[10px] ml-1 text-gray-500">COLLEJAS</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};