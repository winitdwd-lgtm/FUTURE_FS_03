import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, Float, MeshDistortMaterial, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

function ScrollAnimatedGroup() {
  const scroll = useScroll();
  const { viewport } = useThree();
  const groupRef = useRef();
  const blobRef = useRef();
  
  // Array of refs for floating beans
  const beansRef = useRef([]);

  useFrame((state, delta) => {
    // scroll.offset goes from 0 (top) to 1 (bottom)
    const offset = scroll.offset;

    // 1. Group Rotation based on scroll
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, offset * Math.PI * 4, 0.05);

    // 2. Animate the central Gold Blob
    if (blobRef.current) {
      // Moves down slightly and scales up in the middle, then scales back
      const targetY = Math.sin(offset * Math.PI) * -1;
      blobRef.current.position.y = THREE.MathUtils.lerp(blobRef.current.position.y, targetY, 0.05);
      
      const scaleTarget = 1 + Math.sin(offset * Math.PI) * 0.8;
      blobRef.current.scale.lerp(new THREE.Vector3(scaleTarget, scaleTarget, scaleTarget), 0.05);
    }

    // 3. Animate individual beans (dynamic spread based on scroll)
    beansRef.current.forEach((bean, i) => {
      if (bean) {
        // As you scroll, they spread out into a wider ring
        const radius = 2 + (i % 3) * offset * 3; 
        const angle = (i / beansRef.current.length) * Math.PI * 2 + offset * Math.PI;
        
        const targetX = Math.cos(angle) * radius;
        const targetZ = Math.sin(angle) * radius;
        // They bounce up and down slightly based on their index
        const targetY = (i % 2 === 0 ? 1.5 : -1.5) * (1 - offset * 1.5);

        bean.position.x = THREE.MathUtils.lerp(bean.position.x, targetX, 0.05);
        bean.position.y = THREE.MathUtils.lerp(bean.position.y, targetY, 0.05);
        bean.position.z = THREE.MathUtils.lerp(bean.position.z, targetZ, 0.05);

        bean.rotation.x += delta * (0.2 + i * 0.1);
        bean.rotation.y += delta * (0.3 + i * 0.1);
      }
    });
  });

  // Scale down the entire 3D group on mobile (viewport width < 5 is roughly mobile/tablet portrait)
  const groupScale = viewport.width < 5 ? viewport.width / 5 : 1;

  return (
    <group ref={groupRef} scale={groupScale}>
      {}
      <Float speed={3} rotationIntensity={2} floatIntensity={3}>
        <mesh ref={blobRef} position={[0, 0, 0]}>
          <sphereGeometry args={[1.2, 64, 64]} />
          <MeshDistortMaterial 
            color="#d4af37" 
            envMapIntensity={2} 
            clearcoat={1} 
            clearcoatRoughness={0.1} 
            metalness={0.9} 
            roughness={0.1}
            distort={0.4} 
            speed={2} 
          />
        </mesh>
      </Float>

      {}
      {[...Array(8)].map((_, i) => (
        <mesh 
          key={i} 
          ref={el => beansRef.current[i] = el}
          scale={0.4 + (i % 3) * 0.2}
        >
          {i % 4 === 0 ? (
            <torusGeometry args={[0.8, 0.2, 16, 32]} />
          ) : (
            <sphereGeometry args={[0.5, 32, 32]} />
          )}
          <meshStandardMaterial 
            color={i % 2 === 0 ? "#2c1810" : "#d4af37"} // Mix of dark roast and gold
            roughness={i % 2 === 0 ? 0.4 : 0.1} 
            metalness={i % 2 === 0 ? 0.1 : 0.9}
            envMapIntensity={1}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function CoffeeScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#d4af37" />
      <Environment preset="city" />
      
      <ScrollAnimatedGroup />

      <ContactShadows position={[0, -4, 0]} opacity={0.6} scale={20} blur={2.5} far={5} />
    </>
  );
}
