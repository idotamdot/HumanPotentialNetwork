import React from 'react';

export default function KidsZoneBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-blue-50 opacity-50" />
      
      {/* Sun */}
      <div className="absolute top-16 right-16 h-24 w-24 rounded-full bg-gradient-to-b from-yellow-200 to-yellow-400 opacity-60">
        <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full bg-yellow-300 blur-md opacity-60"></div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute h-10 w-1 bg-yellow-200 opacity-70 origin-bottom" 
            style={{ 
              left: '50%', 
              top: '-30%', 
              transform: `translateX(-50%) rotate(${i * 45}deg)` 
            }}
          />
        ))}
      </div>
      
      {/* Clouds */}
      <div className="absolute top-20 left-[5%] opacity-60">
        <Cloud scale={1} />
      </div>
      <div className="absolute top-40 left-[35%] opacity-50">
        <Cloud scale={1.5} />
      </div>
      <div className="absolute top-16 left-[65%] opacity-40">
        <Cloud scale={0.8} />
      </div>
      <div className="absolute top-60 left-[80%] opacity-40">
        <Cloud scale={1.2} />
      </div>
      
      {/* Bottom hills/mountains */}
      <div className="absolute bottom-0 left-0 right-0 h-32">
        <div className="absolute bottom-0 left-[-5%] w-[50%] h-40 rounded-[100%] bg-green-100 opacity-50"></div>
        <div className="absolute bottom-0 left-[25%] w-[55%] h-32 rounded-[100%] bg-green-100 opacity-40"></div>
        <div className="absolute bottom-0 left-[60%] w-[50%] h-24 rounded-[100%] bg-green-100 opacity-30"></div>
      </div>
      
      {/* Rainbow */}
      <div className="absolute top-[15%] left-[10%] w-[80%] h-[30%] opacity-10">
        <div className="absolute inset-0 border-t-[15px] border-red-500 rounded-[50%/100%] rounded-b-none transform scale-x-150"></div>
        <div className="absolute inset-0 border-t-[12px] border-orange-500 rounded-[50%/100%] rounded-b-none transform scale-x-145 scale-y-105"></div>
        <div className="absolute inset-0 border-t-[9px] border-yellow-500 rounded-[50%/100%] rounded-b-none transform scale-x-140 scale-y-110"></div>
        <div className="absolute inset-0 border-t-[6px] border-green-500 rounded-[50%/100%] rounded-b-none transform scale-x-135 scale-y-115"></div>
        <div className="absolute inset-0 border-t-[3px] border-blue-500 rounded-[50%/100%] rounded-b-none transform scale-x-130 scale-y-120"></div>
      </div>
    </div>
  );
}

function Cloud({ scale = 1 }: { scale?: number }) {
  return (
    <div className="relative" style={{ transform: `scale(${scale})` }}>
      <div className="absolute w-12 h-6 bg-white rounded-full opacity-90"></div>
      <div className="absolute w-8 h-8 bg-white rounded-full -top-2 -left-2 opacity-90"></div>
      <div className="absolute w-10 h-10 bg-white rounded-full -top-1 left-4 opacity-90"></div>
      <div className="absolute w-8 h-8 bg-white rounded-full -top-1 left-10 opacity-90"></div>
    </div>
  );
}