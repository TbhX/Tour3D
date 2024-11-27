import React, { useEffect, useRef, useCallback } from 'react';
import { Building2 } from 'lucide-react';
import { useStore } from '../store';
import { useSpring, animated } from '@react-spring/web';
import { FloorIndicator } from './FloorIndicator';

export function Navigation() {
  const { currentFloor, targetFloor, setTargetFloor, isTransitioning } = useStore();
  const elevatorRef = useRef<HTMLDivElement>(null);

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
    top: `${(100 - currentFloor) * 1}%`,  // Inverse la logique pour corriger l'ordre des étages
    config: { tension: 180, friction: 20 },
  }));

  // Mise à jour de l'animation à chaque changement d'étage
  useEffect(() => {
    api.start({
      top: `${(100 - targetFloor) * 1}%`,  // Assurez-vous que l'animation est correcte
    });
  }, [targetFloor, api]);

  // Gestion des clics sur les flèches haut et bas
  const handleArrowClick = (direction: 'up' | 'down') => {
    if (!isTransitioning) {
      const newFloor = direction === 'up' ? targetFloor + 1 : targetFloor - 1;
      handleFloorChange(newFloor);
    }
  };

  return (
    <>
      {/* Vue 3D principale */}
      <div className="relative w-full h-screen overflow-hidden bg-gray-200">
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            transform: `perspective(1000px) rotateX(${(100 - targetFloor) * 2}deg) translateY(-${(100 - targetFloor) * 1}%)`,
            transitionProperty: "transform",
          }}
        >
          {/* Afficher ici le contenu spécifique à chaque étage */}
          <div
            className={`${targetFloor === 1 ? 'bg-green-300' : 'bg-blue-300'} h-screen flex items-center justify-center`}
          >
            <h1 className="text-white text-4xl">Étage {targetFloor}</h1>
          </div>
          {/* Exemple d'étages supplémentaires */}
          {Array.from({ length: 99 }, (_, index) => (
            <div
              key={index + 2}
              className={`h-screen flex items-center justify-center ${index % 2 === 0 ? 'bg-blue-300' : 'bg-red-300'}`}
            >
              <h1 className="text-white text-4xl">Étage {index + 2}</h1>
            </div>
          ))}
        </div>
      </div>

      {/* Panneau d'ascenseur à droite de l'écran */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <div className="flex flex-col items-center">
            {/* Piste de l'ascenseur */}
            <div className="relative w-10 h-80 sm:h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)] bg-gray-200 rounded-full overflow-hidden">
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
            
            {/* Flèches de navigation */}
            <div className="flex flex-col space-y-2 mt-4">
              <button
                onClick={() => handleArrowClick('up')}
                disabled={isTransitioning || targetFloor >= 100}
                className="w-10 h-10 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all"
              >
                ↑
              </button>
              <button
                onClick={() => handleArrowClick('down')}
                disabled={isTransitioning || targetFloor <= 1}
                className="w-10 h-10 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all"
              >
                ↓
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}