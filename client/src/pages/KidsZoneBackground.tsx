import React, { useEffect, useState } from 'react';

export default function KidsZoneBackground() {
  // State to manage the butterflies
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);
  
  // Create a new butterfly every few seconds
  useEffect(() => {
    // Create initial butterflies
    setButterflies(generateInitialButterflies(3));
    
    // Add a new butterfly every 5-10 seconds
    const interval = setInterval(() => {
      setButterflies(prevButterflies => {
        // Remove butterflies that have flown off-screen (older than 15 seconds)
        const filteredButterflies = prevButterflies.filter(
          butterfly => (Date.now() - butterfly.createdAt) < 15000
        );
        
        // Add a new butterfly
        return [...filteredButterflies, createRandomButterfly()];
      });
    }, Math.random() * 5000 + 5000); // Random interval between 5-10 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white opacity-30" />
      
      {/* Bright glowing sun with tattoo-style outline */}
      <div className="absolute top-8 right-16 h-28 w-28 animate-pulse">
        {/* Outer glow effect */}
        <div className="absolute -inset-6 rounded-full bg-yellow-300 opacity-10 animate-pulse"></div>
        <div className="absolute -inset-4 rounded-full bg-yellow-400 opacity-15 animate-pulse"></div>
        
        {/* Sun core with bright center and gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300 to-amber-300 opacity-80 border border-yellow-500 shadow-lg shadow-yellow-300/50"></div>
        <div className="absolute inset-2 rounded-full bg-yellow-100 opacity-70 mix-blend-overlay"></div>
        
        {/* Bright center */}
        <div className="absolute inset-4 rounded-full bg-white opacity-50"></div>
        
        {/* Sun rays - tattoo style with bright outlines and glow */}
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i}>
            <div 
              className="absolute h-16 w-1 bg-gradient-to-b from-yellow-300 to-amber-200 opacity-60 origin-bottom border-l border-yellow-400" 
              style={{ 
                left: '50%', 
                top: '-30%', 
                transform: `translateX(-50%) rotate(${i * 22.5}deg)` 
              }}
            />
            {/* Glow effect for each ray */}
            <div 
              className="absolute h-14 w-0.5 bg-white opacity-40 origin-bottom blur-[1px]" 
              style={{ 
                left: '50%', 
                top: '-25%', 
                transform: `translateX(-50%) rotate(${i * 22.5}deg)` 
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Brighter tattoo-style clouds with outlines */}
      <div className="absolute top-20 left-[5%] opacity-40">
        <Cloud scale={1} isGlowing={true} />
      </div>
      <div className="absolute top-40 left-[35%] opacity-40">
        <Cloud scale={1.5} isGlowing={true} />
      </div>
      <div className="absolute top-16 left-[65%] opacity-35">
        <Cloud scale={0.8} isGlowing={true} />
      </div>
      <div className="absolute top-60 left-[80%] opacity-30">
        <Cloud scale={1.2} isGlowing={true} />
      </div>
      
      {/* Bottom hills/mountains - tattoo style with thin outlines */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        <div className="absolute bottom-0 left-[-5%] w-[50%] h-40 rounded-[100%] bg-green-50 opacity-15 border-t border-green-200"></div>
        <div className="absolute bottom-0 left-[25%] w-[55%] h-32 rounded-[100%] bg-green-50 opacity-10 border-t border-green-200"></div>
        <div className="absolute bottom-0 left-[60%] w-[50%] h-24 rounded-[100%] bg-green-50 opacity-10 border-t border-green-200"></div>
      </div>
      
      {/* Rainbow with enhanced visibility */}
      <div className="absolute top-[10%] left-[5%] w-[90%] h-[40%] opacity-10">
        <div className="absolute inset-0 border-t-[4px] border-red-400 rounded-[50%/100%] rounded-b-none transform scale-x-150"></div>
        <div className="absolute inset-0 border-t-[4px] border-orange-400 rounded-[50%/100%] rounded-b-none transform scale-x-145 scale-y-105"></div>
        <div className="absolute inset-0 border-t-[4px] border-yellow-400 rounded-[50%/100%] rounded-b-none transform scale-x-140 scale-y-110"></div>
        <div className="absolute inset-0 border-t-[4px] border-green-400 rounded-[50%/100%] rounded-b-none transform scale-x-135 scale-y-115"></div>
        <div className="absolute inset-0 border-t-[4px] border-blue-400 rounded-[50%/100%] rounded-b-none transform scale-x-130 scale-y-120"></div>
        <div className="absolute inset-0 border-t-[4px] border-purple-400 rounded-[50%/100%] rounded-b-none transform scale-x-125 scale-y-125"></div>
      </div>
      
      {/* Animated butterflies */}
      {butterflies.map((butterfly) => (
        <Butterfly 
          key={butterfly.id} 
          id={butterfly.id}
          startPosition={butterfly.startPosition}
          endPosition={butterfly.endPosition}
          color={butterfly.color}
          size={butterfly.size}
          speed={butterfly.speed}
          createdAt={butterfly.createdAt}
        />
      ))}
    </div>
  );
}

// Butterfly interface
interface Butterfly {
  id: string;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  color: string;
  size: number;
  speed: number;
  createdAt: number;
}

// Array of butterfly colors
const butterflyColors = [
  'from-purple-400 to-pink-300',
  'from-blue-400 to-cyan-300',
  'from-orange-400 to-yellow-300',
  'from-pink-400 to-rose-300',
  'from-emerald-400 to-teal-300',
  'from-indigo-400 to-blue-300'
];

// Create a random butterfly
function createRandomButterfly(): Butterfly {
  // Randomize starting position (either from left or right)
  const fromLeft = Math.random() > 0.5;
  const startX = fromLeft ? -50 : window.innerWidth + 50;
  const startY = Math.random() * window.innerHeight * 0.7 + 50;
  
  // End position is the opposite side
  const endX = fromLeft ? window.innerWidth + 50 : -50;
  const endY = Math.random() * window.innerHeight * 0.7 + 50;
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    startPosition: { x: startX, y: startY },
    endPosition: { x: endX, y: endY },
    color: butterflyColors[Math.floor(Math.random() * butterflyColors.length)],
    size: Math.random() * 0.6 + 0.5, // Size between 0.5 and 1.1
    speed: Math.random() * 10 + 5, // Speed between 5 and 15
    createdAt: Date.now()
  };
}

// Generate initial butterflies
function generateInitialButterflies(count: number): Butterfly[] {
  return Array(count).fill(null).map(() => createRandomButterfly());
}

// Butterfly component
function Butterfly({ 
  id, 
  startPosition, 
  endPosition, 
  color, 
  size, 
  speed,
  createdAt 
}: Butterfly) {
  // Calculate how far along the path this butterfly should be
  const duration = 15; // seconds to cross screen
  const progress = Math.min((Date.now() - createdAt) / (duration * 1000), 1);
  
  // Calculate current position
  const currentX = startPosition.x + (endPosition.x - startPosition.x) * progress;
  const currentY = startPosition.y + (endPosition.y - startPosition.y) * progress;
  
  // Add a gentle vertical bobbing effect based on sin wave
  const bobbingY = Math.sin(progress * Math.PI * 8) * 15;
  
  // Determine if flying left to right or right to left
  const flyingRight = startPosition.x < endPosition.x;
  
  return (
    <div 
      className="absolute"
      style={{
        transform: `translate(${currentX}px, ${currentY + bobbingY}px) scale(${size}) ${flyingRight ? '' : 'scaleX(-1)'}`,
        transition: 'transform 100ms cubic-bezier(0.455, 0.03, 0.515, 0.955)'
      }}
    >
      {/* Butterfly body */}
      <div className="relative">
        {/* Body */}
        <div className="absolute w-1 h-4 bg-gray-800 rounded-full left-[7px] top-[2px]"></div>
        
        {/* Wings */}
        <div className="relative">
          {/* Left wing animation */}
          <div 
            className={`absolute w-6 h-5 rounded-full bg-gradient-to-br ${color} opacity-70 border border-gray-400 shadow-sm`}
            style={{ 
              left: '0px', 
              animation: `butterfly-wing-left ${0.15 / speed}s alternate infinite ease-in-out`
            }}
          ></div>
          
          {/* Right wing animation */}
          <div 
            className={`absolute w-6 h-5 rounded-full bg-gradient-to-bl ${color} opacity-70 border border-gray-400 shadow-sm`}
            style={{ 
              left: '8px', 
              animation: `butterfly-wing-right ${0.15 / speed}s alternate infinite ease-in-out`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

// Add this CSS class for butterfly wing animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes butterfly-wing-left {
      0% { transform: rotate(10deg) scaleX(0.8); }
      100% { transform: rotate(-20deg) scaleX(1); }
    }
    @keyframes butterfly-wing-right {
      0% { transform: rotate(-10deg) scaleX(0.8); }
      100% { transform: rotate(20deg) scaleX(1); }
    }
  `;
  document.head.appendChild(style);
}

function Cloud({ scale = 1, isGlowing = false }: { scale?: number; isGlowing?: boolean }) {
  // Tattoo-style cloud with thin border outline and optional glow
  return (
    <div className="relative" style={{ transform: `scale(${scale})` }}>
      {/* Glow effect if enabled */}
      {isGlowing && (
        <div className="absolute w-16 h-10 bg-blue-100 opacity-20 rounded-full blur-sm -top-2 -left-2"></div>
      )}
      
      {/* Cloud parts with enhanced brightness */}
      <div className={`absolute w-12 h-6 ${isGlowing ? 'bg-white opacity-60' : 'bg-white opacity-40'} rounded-full border border-blue-200 ${isGlowing ? 'shadow-sm shadow-blue-100/30' : ''}`}></div>
      <div className={`absolute w-8 h-8 ${isGlowing ? 'bg-white opacity-60' : 'bg-white opacity-40'} rounded-full -top-2 -left-2 border border-blue-200 ${isGlowing ? 'shadow-sm shadow-blue-100/30' : ''}`}></div>
      <div className={`absolute w-10 h-10 ${isGlowing ? 'bg-white opacity-60' : 'bg-white opacity-40'} rounded-full -top-1 left-4 border border-blue-200 ${isGlowing ? 'shadow-sm shadow-blue-100/30' : ''}`}></div>
      <div className={`absolute w-8 h-8 ${isGlowing ? 'bg-white opacity-60' : 'bg-white opacity-40'} rounded-full -top-1 left-10 border border-blue-200 ${isGlowing ? 'shadow-sm shadow-blue-100/30' : ''}`}></div>
    </div>
  );
}