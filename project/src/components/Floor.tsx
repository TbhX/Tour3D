import React from 'react';
import { Box, Text } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';

interface FloorProps {
  floor: number;
  position: [number, number, number];
  isActive: boolean;
}

export function Floor({ floor, position, isActive }: FloorProps) {
  const { scale, color } = useSpring({
    scale: isActive ? 1.1 : 1,
    color: isActive ? '#60A5FA' : '#1E40AF',
    config: { mass: 1, tension: 280, friction: 60 }
  });

  return (
    <animated.group position={position} scale={scale as any}>
      <Box args={[10, 3.5, 10]}>
        <animated.meshStandardMaterial color={color as any} />
      </Box>
      <Text
        position={[0, 0, 5.1]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {`Étage ${floor}`}
      </Text>
    </animated.group>
  );
}