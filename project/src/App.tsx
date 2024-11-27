import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Navigation } from './components/Navigation';
import { Building } from './components/Building';
import { WelcomeScreen } from './components/WelcomeScreen';
import { gsap } from 'gsap';

function App() {
  return (
    <div className="h-screen w-screen bg-gradient-to-b from-blue-400 to-blue-600">
      <Navigation />
      <WelcomeScreen />

      <Canvas className="h-full w-full">
        <Suspense fallback={null}>
          <PerspectiveCamera 
            makeDefault 
            position={[20, 20, 20]} 
            fov={50} 
          />
          <Environment preset="sunset" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />

          <Building />

          <OrbitControls
            enablePan={false}
            minDistance={10}
            maxDistance={50}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;