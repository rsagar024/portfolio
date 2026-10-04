'use client'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, OrbitControls } from '@react-three/drei'
import { useInView } from 'react-intersection-observer'
import * as THREE from 'three'
import { useMediaQuery, REDUCED_MOTION } from '../../lib/useMediaQuery'

function NeonSphere({ still }: { still: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current && !still) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.2
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3
    }
  })

  return (
    <group>
      <Sphere ref={meshRef} args={[1, 64, 128]} scale={2.2}>
        <MeshDistortMaterial
          color="#ffffff"
          attach="material"
          distort={0.4}
          speed={still ? 0 : 2}
          // Glass-like: mostly see-through, only the light highlights show on the surface.
          transparent
          opacity={0.12}
          depthWrite={false}
          roughness={0.1}
          metalness={0}
          wireframe={false}
        />
      </Sphere>
      <Sphere args={[1, 32, 32]} scale={2.4}>
        <meshBasicMaterial color="#00d4ff" wireframe opacity={0.08} transparent />
      </Sphere>
      <pointLight color="#00d4ff" intensity={40} position={[3, 3, 3]} />
      <pointLight color="#b829ff" intensity={30} position={[-3, -3, -3]} />
      <ambientLight intensity={0.6} />
    </group>
  )
}

export default function Scene3D() {
  const reducedMotion = useMediaQuery(REDUCED_MOTION)
  // Stop rendering entirely while the hero is scrolled out of view.
  const { ref, inView } = useInView({ rootMargin: '100px' })

  // Reduced motion: render on demand (a still frame), no auto-rotate or distortion.
  const frameloop = reducedMotion ? 'demand' : inView ? 'always' : 'never'

  return (
    <div ref={ref} className="w-full h-full">
      <Canvas frameloop={frameloop} camera={{ position: [0, 0, 6.5], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <NeonSphere still={reducedMotion} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={!reducedMotion} autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
