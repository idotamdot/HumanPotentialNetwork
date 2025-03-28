import React from 'react';

export default function KidsZoneBackground() {
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
      
      {/* Subtle rainbow */}
      <div className="absolute top-[10%] left-[5%] w-[90%] h-[40%] opacity-5">
        <div className="absolute inset-0 border-t-[3px] border-red-300 rounded-[50%/100%] rounded-b-none transform scale-x-150"></div>
        <div className="absolute inset-0 border-t-[3px] border-orange-300 rounded-[50%/100%] rounded-b-none transform scale-x-145 scale-y-105"></div>
        <div className="absolute inset-0 border-t-[3px] border-yellow-300 rounded-[50%/100%] rounded-b-none transform scale-x-140 scale-y-110"></div>
        <div className="absolute inset-0 border-t-[3px] border-green-300 rounded-[50%/100%] rounded-b-none transform scale-x-135 scale-y-115"></div>
        <div className="absolute inset-0 border-t-[3px] border-blue-300 rounded-[50%/100%] rounded-b-none transform scale-x-130 scale-y-120"></div>
        <div className="absolute inset-0 border-t-[3px] border-purple-300 rounded-[50%/100%] rounded-b-none transform scale-x-125 scale-y-125"></div>
      </div>
    </div>
  );
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