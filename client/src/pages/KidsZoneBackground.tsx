import React from 'react';

export default function KidsZoneBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white opacity-30" />
      
      {/* Sun with tattoo-style outline */}
      <div className="absolute top-8 right-16 h-24 w-24">
        {/* Sun core */}
        <div className="absolute inset-0 rounded-full bg-yellow-100 opacity-20 border border-yellow-300"></div>
        
        {/* Sun rays - tattoo style with thin outlines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute h-12 w-0.5 bg-yellow-200 opacity-20 origin-bottom border-l border-yellow-300" 
            style={{ 
              left: '50%', 
              top: '-20%', 
              transform: `translateX(-50%) rotate(${i * 30}deg)` 
            }}
          />
        ))}
      </div>
      
      {/* Tattoo-style clouds with outlines */}
      <div className="absolute top-20 left-[5%] opacity-30">
        <Cloud scale={1} />
      </div>
      <div className="absolute top-40 left-[35%] opacity-25">
        <Cloud scale={1.5} />
      </div>
      <div className="absolute top-16 left-[65%] opacity-20">
        <Cloud scale={0.8} />
      </div>
      <div className="absolute top-60 left-[80%] opacity-15">
        <Cloud scale={1.2} />
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

function Cloud({ scale = 1 }: { scale?: number }) {
  // Tattoo-style cloud with thin border outline
  return (
    <div className="relative" style={{ transform: `scale(${scale})` }}>
      <div className="absolute w-12 h-6 bg-white opacity-40 rounded-full border border-blue-100"></div>
      <div className="absolute w-8 h-8 bg-white opacity-40 rounded-full -top-2 -left-2 border border-blue-100"></div>
      <div className="absolute w-10 h-10 bg-white opacity-40 rounded-full -top-1 left-4 border border-blue-100"></div>
      <div className="absolute w-8 h-8 bg-white opacity-40 rounded-full -top-1 left-10 border border-blue-100"></div>
    </div>
  );
}