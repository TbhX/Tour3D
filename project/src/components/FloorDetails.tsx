import React from 'react';
import { Building2, Globe, Users, Calendar, Crown } from 'lucide-react';
import { animated, useTransition } from '@react-spring/web';
import { useStore } from '../store';

interface FloorDetailsProps {
  floor: number;
  isAvailable: boolean;
}

export function FloorDetails({ floor, isAvailable }: FloorDetailsProps) {
  const direction = useStore((state) => state.direction);
  
  const transitions = useTransition(true, {
    from: { 
      opacity: 0,
      transform: `translateY(${direction === 'up' ? '100%' : '-100%'})`,
    },
    enter: { 
      opacity: 1,
      transform: 'translateY(0%)',
    },
    leave: { 
      opacity: 0,
      transform: `translateY(${direction === 'up' ? '-100%' : '100%'})`,
    },
    config: {
      tension: 280,
      friction: 60,
    },
  });

  const getPriceForFloor = (floor: number) => {
    const basePrice = 1000;
    const premium = Math.pow(1.02, floor) * basePrice;
    return Math.round(premium);
  };

  const getFloorType = (floor: number) => {
    if (floor === 100) return 'Suite Présidentielle';
    if (floor >= 90) return 'Suite Royale';
    if (floor >= 70) return 'Suite Exécutive';
    if (floor >= 50) return 'Suite Deluxe';
    return 'Suite Premium';
  };

  return transitions((styles, show) =>
    show && (
      <animated.div 
        style={styles} 
        className="fixed left-8 top-1/2 -translate-y-1/2 z-10 w-80"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-bold">{getFloorType(floor)}</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Prix par mois</span>
              <span className="text-2xl font-bold text-blue-600">
                {getPriceForFloor(floor)}€
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Globe className="w-4 h-4" />
              <span>Visibilité mondiale</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>Jusqu'à 1M visiteurs/mois</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Réservation minimum 1 mois</span>
            </div>

            <button
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                isAvailable
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!isAvailable}
            >
              {isAvailable ? 'Réserver maintenant' : 'Déjà réservé'}
            </button>

            {floor >= 90 && (
              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-amber-800 text-sm">
                  Étage premium avec services exclusifs et visibilité maximale
                </p>
              </div>
            )}
          </div>
        </div>
      </animated.div>
    )
  );
}