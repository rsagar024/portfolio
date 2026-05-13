'use client'
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function NeonSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.2
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3
    }
  })

  return (
    <group>
      <Sphere ref={meshRef} args={[1, 100, 200]} scale={2.2}>
        <MeshDistortMaterial
          color="#00d4ff"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0}
          metalness={0.9}
          wireframe={false}
        />
      </Sphere>
      <Sphere args={[1, 32, 32]} scale={2.4}>
        <meshBasicMaterial color="#00d4ff" wireframe opacity={0.08} transparent />
      </Sphere>
      <pointLight color="#00d4ff" intensity={3} position={[3, 3, 3]} />
      <pointLight color="#b000ff" intensity={2} position={[-3, -3, -3]} />
      <ambientLight intensity={0.2} />
    </group>
  )
}

export default function Scene3D() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <NeonSphere />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
