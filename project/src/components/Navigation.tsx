import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Building2 } from 'lucide-react';
import { useStore } from '../store';
import { useSpring, animated } from '@react-spring/web';
import { FloorIndicator } from './FloorIndicator';

export function Navigation() {
  const { currentFloor, targetFloor, setTargetFloor, isTransitioning } = useStore();
  const elevatorRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Fonction pour changer d'étage
  const handleFloorChange = useCallback(
    (floor: number) => {
      if (floor >= 1 && floor <= 100 && !isTransitioning) {
        setTargetFloor(floor);
      }
    },
    [isTransitioning, setTargetFloor]
  );

  // Animation de l'ascenseur avec react-spring
  const [styles, api] = useSpring(() => ({
    top: `${((100 - currentFloor) / 100) * 100}%`,
    config: { tension: 120, friction: 14 },
  }));

  // Mise à jour de l'animation à chaque changement d'étage
  useEffect(() => {
    api.start({
      top: `${((100 - targetFloor) / 100) * 100}%`,
    });
  }, [targetFloor, api]);

  // Gestion des clics sur l'écran
  const handleScreenClick = (e: React.MouseEvent) => {
    if (!isTransitioning) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const halfHeight = rect.height / 2;

      // Cliquez sur la moitié supérieure ou inférieure de l'écran pour changer d'étage
      if (clickY < halfHeight) {
        handleFloorChange(targetFloor + 1); // Aller à l'étage supérieur
      } else {
        handleFloorChange(targetFloor - 1); // Aller à l'étage inférieur
      }
    }
  };

  // Fonction pour gérer le défilement
  const handleScroll = (e: React.UIEvent) => {
    const scrollY = e.currentTarget.scrollTop;
    const newFloor = Math.round(((100 - scrollY) / e.currentTarget.scrollHeight) * 100);
    handleFloorChange(Math.max(1, Math.min(100, newFloor)));
    setScrollPosition(scrollY);
  };

  return (
    <>
      {/* Zone cliquable de l'écran */}
      <div 
        className="fixed inset-0 z-0"
        onClick={handleScreenClick}
      />
      
      {/* Panneau d'ascenseur à droite de l'écran */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <div className="flex flex-col items-center">
            {/* Piste de l'ascenseur */}
            <div className="relative w-10 h-80 bg-gray-200 rounded-full overflow-hidden">
              {/* Marqueurs d'étages */}
              <div className="absolute inset-0 flex flex-col justify-between py-2">
                {[100, 75, 50, 25, 1].map((floor) => (
                  <div
                    key={floor}
                    className="w-full h-px bg-gray-400 opacity-50"
                    style={{ marginLeft: floor === 1 ? '0%' : '20%' }}
                  />
                ))}
              </div>

              {/* Track de l'ascenseur */}
              <div
                ref={elevatorRef}
                className="absolute w-full cursor-pointer"
                style={{ height: '100%' }}
                onClick={(e) => {
                  if (!isTransitioning) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const percentage = 1 - y / rect.height;
                    const floor = Math.round(percentage * 100);
                    handleFloorChange(Math.max(1, Math.min(100, floor))); // Contrainte de l'étage entre 1 et 100
                  }
                }}
              >
                {/* Indicateur d'ascenseur animé */}
                <animated.div
                  style={styles}
                  className="absolute w-10 h-10 -ml-2 -mt-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center transform transition-all duration-300 cursor-grab hover:scale-110"
                >
                  <Building2 className="w-5 h-5 text-white" />
                  <FloorIndicator floor={targetFloor} />
                </animated.div>
              </div>
            </div>

            {/* Affichage de l'étage actuel */}
            <div className="mt-4 text-center">
              <div className="font-medium text-lg">
                Étage {targetFloor}
              </div>
              {isTransitioning && (
                <div className="text-sm text-blue-600 animate-pulse">
                  En mouvement...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Zone avec la possibilité de défiler pour changer d'étage */}
      <div
        className="overflow-y-scroll h-screen w-screen absolute top-0 left-0 z-0"
        onScroll={handleScroll}
      >
        {/* Cette zone est utilisée pour le défilement et l'interaction avec la scrollbar */}
      </div>
    </>
  );
}