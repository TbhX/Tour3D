import React from 'react';
import { useStore } from '../store';
import { animated, useSpring } from '@react-spring/web';

export function WelcomeScreen() {
  const currentFloor = useStore((state) => state.currentFloor);
  const direction = useStore((state) => state.direction);
  
  const styles = useSpring({
    opacity: currentFloor === 100 ? 1 : 0,
    transform: currentFloor === 100 
      ? 'translateY(0%)' 
      : `translateY(${direction === 'up' ? '-100%' : '100%'})`,
    config: {
      mass: 1,
      tension: 280,
      friction: 60
    }
  });

  return (
    <animated.div 
      style={styles}
      className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-center drop-shadow-lg mb-4 sm:mb-6">
          La Tour Virtuelle
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-white text-center mt-2 font-light max-w-2xl mx-auto leading-relaxed">
          Premier Hôtel Numérique de Luxe
        </p>
        <div className="mt-6 sm:mt-8 text-white/80 text-sm sm:text-base md:text-lg max-w-xl mx-auto">
          <p className="animate-fade-in">
            Bienvenue au sommet de l'innovation numérique. 
            Explorez 100 étages d'expériences uniques.
          </p>
        </div>
      </div>
    </animated.div>
  );
}