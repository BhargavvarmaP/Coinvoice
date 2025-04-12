"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, PresentationControls, Float, Environment, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

// Enhanced 3D Coin Model
function EnhancedCoinModel(props: any) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  
  // Rotation animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
      
      // Add subtle floating motion
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  // Try to load the 3D model, fallback to custom geometry if failed
  const { scene, nodes, materials } = useGLTF("/assets/3d/coin.glb", true) || {}

  // Use a try-catch block to handle loading errors
  try {
    // If scene is available, render it with enhanced materials
    if (scene) {
      return (
        <primitive 
          object={scene} 
          {...props} 
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerDown={() => setClicked(true)}
          onPointerUp={() => setClicked(false)}
          scale={hovered ? 1.1 : 1}
        />
      )
    } else {
      // If no scene, create a custom coin with distortion material
      return (
        <mesh
          {...props}
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerDown={() => setClicked(true)}
          onPointerUp={() => setClicked(false)}
          scale={hovered ? 1.1 : 1}
        >
          <cylinderGeometry args={[1, 1, 0.2, 64]} />
          <MeshDistortMaterial
            color={new THREE.Color("#FFD700")}
            emissive={new THREE.Color("#FF6B00").multiplyScalar(0.2)}
            metalness={1}
            roughness={0.2}
            distort={0.2}
            speed={2}
          />
        </mesh>
      )
    }
  } catch (error) {
    console.error("Error loading 3D model:", error)
    
    // Fallback to basic coin with gradient material
    return (
      <mesh
        {...props}
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial 
          color={hovered ? "#FFC107" : "#F59E0B"} 
          metalness={0.9} 
          roughness={0.1}
          emissive="#FF6B00"
          emissiveIntensity={0.2}
        />
        <mesh position={[0, 0.101, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.01, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.101, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.01, 32]} />
          <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
        </mesh>
      </mesh>
    )
  }
}

// Animated Coin Component with Canvas
export function AnimatedCoin({ className = "", size = "md", interactive = true }: { 
  className?: string; 
  size?: "sm" | "md" | "lg" | "xl";
  interactive?: boolean;
}) {
  const [canRender3D, setCanRender3D] = useState(false)
  
  // Size mapping
  const sizeMap = {
    sm: "h-24 w-24",
    md: "h-40 w-40",
    lg: "h-56 w-56",
    xl: "h-72 w-72"
  }

  // Check if we can render 3D content
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      setCanRender3D(!!gl)
    } catch (e) {
      setCanRender3D(false)
    }
  }, [])

  // Fallback for when 3D isn't available
  function CoinFallback() {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <motion.div 
          className="rounded-full bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center text-white font-bold text-xl"
          animate={{ 
            rotateY: 360,
            boxShadow: ["0 0 20px rgba(245, 158, 11, 0.3)", "0 0 40px rgba(245, 158, 11, 0.6)", "0 0 20px rgba(245, 158, 11, 0.3)"]
          }}
          transition={{ 
            rotateY: { duration: 10, repeat: Infinity, ease: "linear" },
            boxShadow: { duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
          }}
          style={{ width: "80%", height: "80%" }}
        >
          CVT
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`${sizeMap[size]} ${className}`}>
      {canRender3D ? (
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          {interactive ? (
            <PresentationControls
              global
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 4, Math.PI / 4]}
              azimuth={[-Math.PI / 4, Math.PI / 4]}
              config={{ mass: 2, tension: 500 }}
              snap={{ mass: 4, tension: 300 }}
            >
              <Float rotationIntensity={0.2} floatIntensity={0.5}>
                <EnhancedCoinModel position={[0, 0, 0]} scale={2} />
              </Float>
            </PresentationControls>
          ) : (
            <Float rotationIntensity={0.5} floatIntensity={0.5}>
              <EnhancedCoinModel position={[0, 0, 0]} scale={2} />
            </Float>
          )}
          
          <Environment preset="city" />
        </Canvas>
      ) : (
        <CoinFallback />
      )}
    </div>
  )
}
