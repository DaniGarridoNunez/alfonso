import React from 'react';
import { FloatingText } from '../types';

interface FloatingIndicatorsProps {
  items: FloatingText[];
}

export const FloatingIndicators: React.FC<FloatingIndicatorsProps> = ({ items }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {items.map((item) => (
        <div
          key={item.id}
          className="floating-text absolute text-2xl font-bold text-white drop-shadow-md select-none"
          style={{ 
            left: item.x, 
            top: item.y,
            textShadow: '0px 0px 5px rgba(233, 69, 96, 0.8)'
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};