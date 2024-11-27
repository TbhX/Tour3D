import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { useStore } from '../store';
import { Floor } from './Floor';

export function Building() {
  const ref = useRef<THREE.Group>(null);
  const currentFloor = useStore((state) => state.currentFloor);
  
  const { position } = useSpring({
    position: [0, -currentFloor * 4, 0],
    config: { mass: 1, tension: 280, friction: 60 }
  });

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
    }
  });

  return (
    <animated.group ref={ref} position={position as any}>
      {Array.from({ length: 100 }).map((_, index) => (
        <Floor
          key={index}
          floor={index + 1}
          position={[0, index * 4, 0]}
          isActive={currentFloor === index + 1}
        />
      ))}
    </animated.group>
  );
}