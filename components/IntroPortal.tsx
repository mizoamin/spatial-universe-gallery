
import React, { useState, useEffect } from 'react';
import { Zap, Target } from 'lucide-react';

interface IntroPortalProps {
  onExplode: () => void;
}

const IntroPortal: React.FC<IntroPortalProps> = ({ onExplode }) => {
  const [state, setState] = useState<'off' | 'ready' | 'active'>('off');
  const [isExploding, setIsExploding] = useState(false);

  const STYLES = {
    off: 'https://raw.githubusercontent.com/mizoamin/mizo-assets-media-1/main/brand_assets/professional-headshots-and-profile-pics/mizo-state1-off.png',
    ready: 'https://raw.githubusercontent.com/mizoamin/mizo-assets-media-1/main/brand_assets/professional-headshots-and-profile-pics/mizo-state2-ready.png',
    active: 'https://raw.githubusercontent.com/mizoamin/mizo-assets-media-1/main/brand_assets/professional-headshots-and-profile-pics/mizo-state3-active.png'
  };

  const handleSpatialTap = () => {
    if (isExploding) return;
    setState('active');
    setIsExploding(true);
    document.body.classList.add('flash-active');
    
    setTimeout(() => {
      onExplode();
      document.body.classList.remove('flash-active');
    }, 800);
  };

  // Touch handlers for mobile/iPad
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isExploding) setState('ready');
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isExploding) handleSpatialTap();
  };

  // Preload images
  useEffect(() => {
    Object.values(STYLES).forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-[5000] bg-black transition-transform duration-1000 ${isExploding ? 'scale-[2] opacity-0' : 'opacity-100'}`}>
      
      {/* Background Aura - Purple */}
      <div className={`absolute w-[600px] h-[600px] bg-[#8A2BE2]/10 rounded-full blur-[120px] transition-opacity duration-1000 ${state === 'off' ? 'opacity-0' : 'opacity-100'}`}></div>

      <div className="relative flex flex-col items-center">
        {/* Interaction Hub */}
        <div 
          className="relative w-80 h-80 md:w-[500px] md:h-[500px] group cursor-none flex items-center justify-center touch-none"
          onMouseEnter={() => setState('ready')}
          onMouseLeave={() => !isExploding && setState('off')}
          onClick={handleSpatialTap}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Mizo Portrait Layering */}
          <div className="absolute inset-0 transition-all duration-700 transform group-hover:scale-105">
            {/* State 1: Off */}
            <img 
              src={STYLES.off} 
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 z-10 ${state === 'off' ? 'opacity-100' : 'opacity-0'}`}
              alt="Mizo Visionary"
            />
            {/* State 2: Ready */}
            <img 
              src={STYLES.ready} 
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 z-20 ${state === 'ready' ? 'opacity-100' : 'opacity-0'}`}
              alt="Mizo Visionary"
            />
            {/* State 3: Active */}
            <img 
              src={STYLES.active} 
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 z-30 filter drop-shadow-[0_0_20px_#8A2BE2] ${state === 'active' ? 'opacity-100' : 'opacity-0'}`}
              alt="Mizo Visionary"
            />
          </div>

          {/* Spatial UI Elements - Purple Glow */}
          <div className={`absolute inset-0 border-2 border-white/5 rounded-full transition-all duration-700 group-hover:border-[#8A2BE2]/20 scale-110 group-hover:scale-125 ${isExploding ? 'animate-ping' : ''}`}></div>
          <div className="absolute inset-0 border border-dashed border-zinc-800 rounded-full animate-[spin_30s_linear_infinite]"></div>

          {/* Floating Pointer */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 group-hover:scale-150 z-40">
            <div className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center animate-pulse ${state === 'active' ? 'border-[#8A2BE2]' : ''}`}>
               <Target className={`w-4 h-4 transition-colors duration-300 ${state === 'active' ? 'text-[#8A2BE2]' : 'text-white opacity-40'}`} />
            </div>
          </div>
        </div>

        {/* Text Interface */}
        <div className="mt-12 text-center overflow-hidden">
          <h1 className="text-impact text-6xl md:text-8xl tracking-tighter opacity-0 translate-y-20 animate-[slideUp_1s_ease-out_forwards]">
            MIZO <span className="outline-text">AMIN</span>
          </h1>
          <div className="flex items-center justify-center gap-4 mt-6 opacity-0 animate-[fadeIn_1s_ease-out_1s_forwards]">
            <span className="h-px w-10 bg-zinc-800"></span>
            <p className="text-[#B19CD9] uppercase tracking-[0.8em] text-[10px] font-black">
              Spatial Digital Domain
            </p>
            <span className="h-px w-10 bg-zinc-800"></span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default IntroPortal;
