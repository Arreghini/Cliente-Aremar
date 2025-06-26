import React, { useState, useEffect } from 'react';
import DolphinAnimation from '../atoms/DolphinAnimation';

function Gallery() {
  const [showDelfin, setShowDelfin] = useState(false);
  const DELFIN_DURATION = 30000; // 30 segundos

  useEffect(() => {
    let timeout;

    const playDolphin = () => {
      setShowDelfin(false);
      setTimeout(() => setShowDelfin(true), 50);
      timeout = setTimeout(() => setShowDelfin(false), DELFIN_DURATION);
    };
    playDolphin();

    const interval = setInterval(playDolphin, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div>
      {showDelfin && (
        <DolphinAnimation
          className="absolute bottom-4 left-0 h-12 pointer-events-none animate-dolphin z-30"
        />
      )}
    </div>
  );
}

export default Gallery;
