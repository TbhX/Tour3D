import React, { useEffect, useRef } from 'react';
import { Building2 } from 'lucide-react';
import { useStore } from '../store';
import { useSpring, animated } from '@react-spring/web';
import { FloorIndicator } from './FloorIndicator';

export function Navigation() {
  const { currentFloor, targetFloor, setTargetFloor, isTransitioning } = useStore();
  const elevatorRef = useRef<HTMLDivElement>(null);

  const handleFloorChange = (floor: number) => {
    if (floor >= 1 && floor <= 100 && !isTransitioning) {
      setTargetFloor(floor);
    }
  };

  const [styles, api] = useSpring(() => ({
    top: `${((100 - currentFloor) / 100) * 100}%`,
    config: { tension: 120, friction: 14 },
  }));

  useEffect(() => {
    api.start({
      top: `${((100 - targetFloor) / 100) * 100}%`,
    });
  }, [targetFloor]);

  const handleScreenClick = (e: React.MouseEvent) => {
    if (!isTransitioning) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const halfHeight = rect.height / 2;
      
      if (clickY < halfHeight) {
        // Click on upper half - go up one floor
        handleFloorChange(targetFloor + 1);
      } else {
        // Click on lower half - go down one floor
        handleFloorChange(targetFloor - 1);
      }
    }
  };

  return (
    <>
      {/* Clickable screen areas */}
      <div 
        className="fixed inset-0 z-0"
        onClick={handleScreenClick}
      />
      
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <div className="flex flex-col items-center">
            <div className="relative w-10 h-80 bg-gray-200 rounded-full overflow-hidden">
              {/* Floor markers */}
              <div className="absolute inset-0 flex flex-col justify-between py-2">
                {[100, 75, 50, 25, 1].map((floor) => (
                  <div
                    key={floor}
                    className="w-full h-px bg-gray-400 opacity-50"
                    style={{ marginLeft: floor === 1 ? '0%' : '20%' }}
                  />
                ))}
              </div>

              {/* Elevator track */}
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
                    handleFloorChange(Math.max(1, Math.min(100, floor)));
                  }
                }}
              >
                {/* Elevator indicator */}
                <animated.div
                  style={styles}
                  className="absolute w-10 h-10 -ml-2 -mt-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center transform transition-all duration-300 cursor-grab hover:scale-110"
                >
                  <Building2 className="w-5 h-5 text-white" />
                  <FloorIndicator floor={targetFloor} />
                </animated.div>
              </div>
            </div>

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
    </>
  );
}