import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { useStore } from '../store';
import * as THREE from 'three';

export function FloorView() {
  const ref = useRef<THREE.Group>(null);
  const { currentFloor, targetFloor, setCurrentFloor, setTransitioning, isFloorAvailable } = useStore();
  
  const floorSize = 40;
  const gridSize = 20;

  const [springs, api] = useSpring(() => ({
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    config: { tension: 120, friction: 14 },
    onChange: () => {
      setTransitioning(true);
    },
    onRest: () => {
      setTransitioning(false);
      setCurrentFloor(targetFloor);
    },
  }));

  useEffect(() => {
    api.start({
      position: [0, (targetFloor - currentFloor) * 4, 0],
      rotation: [0, (targetFloor - currentFloor) * Math.PI * 2, 0],
    });
  }, [targetFloor]);

  const floorColor = isFloorAvailable(currentFloor) ? '#2563EB' : '#DC2626';

  return (
    <animated.group ref={ref} {...springs}>
      {/* Main floor platform */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[floorSize, floorSize, gridSize, gridSize]} />
        <meshStandardMaterial
          color={floorColor}
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Solid floor */}
      <mesh position={[0, -0.51, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[floorSize, floorSize]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>

      {/* Floor number display */}
      <group position={[0, 2, -floorSize/3]}>
        <Text
          position={[0, 0, 0]}
          fontSize={4}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor={floorColor}
        >
          {currentFloor}
        </Text>
        <Text
          position={[0, -3, 0]}
          fontSize={1.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          ÉTAGE
        </Text>
      </group>

      {/* Luxury decorative elements */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = floorSize / 3;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(i * 0.3 + THREE.MathUtils.degToRad(currentFloor)) * 0.5,
              Math.sin(angle) * radius
            ]}
          >
            <boxGeometry args={[0.5, 2, 0.5]} />
            <meshStandardMaterial color="#60A5FA" metalness={0.8} roughness={0.2} />
          </mesh>
        );
      })}

      {/* Premium particles */}
      {Array.from({ length: 100 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * (floorSize / 2);
        const speed = Math.random() * 0.5 + 0.5;
        return (
          <mesh
            key={`particle-${i}`}
            position={[
              Math.cos(angle + THREE.MathUtils.degToRad(currentFloor * speed)) * radius,
              Math.random() * 10,
              Math.sin(angle + THREE.MathUtils.degToRad(currentFloor * speed)) * radius
            ]}
          >
            <sphereGeometry args={[0.05]} />
            <meshStandardMaterial
              color="#FFD700"
              metalness={1}
              roughness={0.3}
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}
    </animated.group>
  );
}