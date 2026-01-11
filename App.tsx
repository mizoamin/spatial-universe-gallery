
import React, { useState, useEffect } from 'react';
import IntroPortal from './components/IntroPortal';
import Archive from './components/Archive';

const App: React.FC = () => {
  const [isExploded, setIsExploded] = useState(false);

  // Check if session already started to skip intro on reload if desired, 
  // but for "Cinematic" experience we usually want it once.
  const handleExplode = () => {
    setIsExploded(true);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505]">
      {/* Cinematic Noise Layer */}
      <div className="fixed inset-0 bg-noise z-[100] pointer-events-none"></div>
      
      {!isExploded ? (
        <IntroPortal onExplode={handleExplode} />
      ) : (
        <Archive />
      )}
    </main>
  );
};

export default App;
