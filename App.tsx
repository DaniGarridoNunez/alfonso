import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, Upgrade, FloatingText } from './types';
import { INITIAL_UPGRADES } from './constants';
import { UpgradeList } from './components/UpgradeList';
import { FloatingIndicators } from './components/FloatingIndicators';
import { getVictimReaction } from './services/geminiService';

export default function App() {
  // Game State
  const [score, setScore] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0); // Lifetime score
  const [upgrades, setUpgrades] = useState<Upgrade[]>(INITIAL_UPGRADES);
  
  // Visual State
  const [isAnimating, setIsAnimating] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [reaction, setReaction] = useState<string>("¡No me pegues!");
  const [isTalking, setIsTalking] = useState(false);
  const [reactionOpacity, setReactionOpacity] = useState(0);

  // Refs for logic loops (to access latest state in intervals without resetting them)
  const stateRef = useRef({
    score,
    totalScore,
    autoClicksPerSecond: 0,
    isTalking
  });

  // Calculate stats
  const clickPower = upgrades
    .filter(u => u.type === 'manual')
    .reduce((acc, u) => acc + (u.count * u.effectValue), 1);

  const autoClicksPerSecond = upgrades
    .filter(u => u.type === 'auto')
    .reduce((acc, u) => acc + (u.count * u.effectValue), 0);

  // Keep refs synced
  useEffect(() => {
    stateRef.current = { score, totalScore, autoClicksPerSecond, isTalking };
  }, [score, totalScore, autoClicksPerSecond, isTalking]);

  // --- Game Loop (Passive Income) ---
  useEffect(() => {
    if (autoClicksPerSecond === 0) return;

    const interval = setInterval(() => {
      // Use functional updates to avoid dependency on 'score' in dependency array
      setScore(prev => prev + (autoClicksPerSecond / 10));
      setTotalScore(prev => prev + (autoClicksPerSecond / 10));
    }, 100);

    return () => clearInterval(interval);
  }, [autoClicksPerSecond]);

  // --- AI Reaction Logic ---
  const triggerReaction = useCallback(async () => {
    // Prevent overlapping reactions
    if (stateRef.current.isTalking) return;

    setIsTalking(true);
    setReactionOpacity(0);
    
    // Determine intensity
    const rate = stateRef.current.autoClicksPerSecond;
    let intensity: 'low' | 'medium' | 'high' = 'low';
    if (rate > 50) intensity = 'medium';
    if (rate > 500) intensity = 'high';

    const text = await getVictimReaction(Math.floor(stateRef.current.totalScore), intensity);
    setReaction(text);
    setReactionOpacity(1);

    // Hide text after a few seconds
    setTimeout(() => {
      setReactionOpacity(0);
      setIsTalking(false);
    }, 4000);
  }, []);

  // Check for random reactions
  useEffect(() => {
    const checkInterval = setInterval(() => {
        // 10% chance to talk every 3 seconds if not already talking
        if (Math.random() < 0.1 && !stateRef.current.isTalking) {
            triggerReaction();
        }
    }, 3000);

    return () => clearInterval(checkInterval);
  }, [triggerReaction]);


  // --- Interaction Handlers ---

  const handleSlap = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // Prevent default if it's a touch event to stop mouse emulation double-firing
    if ('touches' in e && e.cancelable) {
       e.preventDefault();
    }
    
    // Calculate position for floating text
    let clientX, clientY;
    if ('touches' in e) {
       clientX = e.touches[0].clientX;
       clientY = e.touches[0].clientY;
    } else {
       clientX = (e as React.MouseEvent).clientX;
       clientY = (e as React.MouseEvent).clientY;
    }

    // Add Score
    setScore(prev => prev + clickPower);
    setTotalScore(prev => prev + clickPower);

    // Visual Animation Shake
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // Sync with CSS animation duration

    // Floating Text
    const newText: FloatingText = {
      id: Date.now() + Math.random(),
      x: clientX,
      y: clientY,
      text: `+${Math.floor(clickPower)}`
    };
    setFloatingTexts(prev => [...prev, newText]);
    
    // Cleanup floating text
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== newText.id));
    }, 800);

    // Small chance to trigger reaction on slap
    if (Math.random() < 0.02) {
      triggerReaction();
    }
  };

  const buyUpgrade = (id: string) => {
    const upgradeIndex = upgrades.findIndex(u => u.id === id);
    if (upgradeIndex === -1) return;

    const upgrade = upgrades[upgradeIndex];
    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.count));

    if (score >= cost) {
      setScore(prev => prev - cost);
      
      const newUpgrades = [...upgrades];
      newUpgrades[upgradeIndex] = {
        ...upgrade,
        count: upgrade.count + 1
      };
      setUpgrades(newUpgrades);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white flex flex-col md:flex-row overflow-hidden slap-cursor">
      
      <FloatingIndicators items={floatingTexts} />

      {/* LEFT PANEL - GAMEPLAY */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-6 select-none">
        
        {/* Score Header */}
        <div className="absolute top-8 text-center z-20 pointer-events-none">
          <h1 className="text-5xl md:text-7xl font-black text-[#e94560] drop-shadow-lg tracking-tighter">
            {Math.floor(score).toLocaleString()}
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm mt-2">Collejas Totales</p>
          <div className="text-xs text-gray-500 mt-1">
            {autoClicksPerSecond.toFixed(1)} collejas/seg
          </div>
        </div>

        {/* Reaction Bubble */}
        <div 
          className={`absolute top-32 md:top-24 z-10 max-w-[280px] transition-opacity duration-500 ease-in-out`}
          style={{ opacity: reactionOpacity }}
        >
          <div className="relative bg-white text-black p-4 rounded-2xl shadow-xl border-4 border-[#e94560]">
             <p className="font-bold text-center text-lg italic">"{reaction}"</p>
             {/* Triangle for speech bubble */}
             <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-[#e94560]"></div>
             <div className="absolute -bottom-[9px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white"></div>
          </div>
        </div>

        {/* The Victim Area */}
        <div className="relative mt-16 group">
          
          <div 
            className={`
              relative w-64 h-64 md:w-96 md:h-96 rounded-full border-8 border-[#0f3460] shadow-2xl overflow-hidden cursor-pointer
              transition-transform duration-100 active:scale-95
              ${isAnimating ? 'shake-anim filter brightness-75 sepia-[.3] saturate-200' : 'hover:scale-105'}
            `}
            onMouseDown={handleSlap}
            onTouchStart={handleSlap}
          >
            <img 
              src="/alfonso.jpg"
              alt="Victim" 
              className="w-full h-full object-cover pointer-events-none select-none"
              draggable={false}
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

            {/* Hand Overlay Animation */}
            {isAnimating && (
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                     <span className="text-8xl transform rotate-12 drop-shadow-2xl opacity-90">👋</span>
                </div>
            )}
          </div>
          
          <p className="mt-8 text-gray-500 text-sm animate-pulse text-center">
            ¡Haz click en la cara para dar una colleja!<br/>
            <span className="text-xs opacity-50">(Si no carga la imagen, asegúrate de que se llama 'alfonso.jpg')</span>
          </p>
        </div>

      </div>

      {/* RIGHT PANEL - UPGRADES */}
      <div className="w-full md:w-[400px] h-[40vh] md:h-screen bg-[#16213e] border-t md:border-t-0 md:border-l border-gray-700 shadow-2xl z-30">
        <UpgradeList 
          upgrades={upgrades} 
          currentScore={score} 
          onBuy={buyUpgrade} 
        />
      </div>

    </div>
  );
}