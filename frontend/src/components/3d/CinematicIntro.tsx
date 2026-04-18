import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Bot, Play, Pause, SkipForward } from 'lucide-react';

// Camera flight animation component
function CameraRig({ onComplete }: { onComplete: () => void }) {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Zoom in from z=25 down to z=5 over 6 seconds
    if (t < 6) {
      state.camera.position.z = THREE.MathUtils.lerp(25, 5, t / 6);
      state.camera.rotation.z = THREE.MathUtils.lerp(0.5, 0, t / 6);
    } else {
      // Once we reach 6 seconds, we complete the intro
      onComplete();
    }
    
    // Subtle hover effect
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, Math.sin(t / 2) * 0.5, 0.05);
  });
  return null;
}

function HolographicGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial 
          color="#3b82f6" 
          wireframe={true} 
          transparent={true} 
          opacity={0.3} 
        />
      </mesh>
      {/* Inner solid glowing core */}
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshStandardMaterial 
          color="#1e3a8a" 
          emissive="#3b82f6" 
          emissiveIntensity={2} 
          toneMapped={false} 
        />
      </mesh>
    </Float>
  );
}

function FloatingCard({ text, position, rotation, color }: { text: string, position: [number, number, number], rotation: [number, number, number], color: string }) {
  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={2}>
      <group position={position} rotation={rotation}>
        <mesh>
          <planeGeometry args={[3, 1.5]} />
          <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.DoubleSide} />
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(3, 1.5)]} />
            <lineBasicMaterial color={color} />
          </lineSegments>
        </mesh>
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>
      </group>
    </Float>
  );
}

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/10/25/audio_2eb23eb1b0.mp3?filename=ambient-sci-fi-music-123496.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    
    // Auto-play might be blocked by browsers, but we try
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkip = () => {
    if (audioRef.current) {
      // Fade out audio on skip
      const fadeOut = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.05) {
          audioRef.current.volume -= 0.05;
        } else {
          clearInterval(fadeOut);
          audioRef.current?.pause();
        }
      }, 100);
    }
    onComplete();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
      className="fixed inset-0 z-[100] bg-slate-950 overflow-hidden"
    >
      {/* HUD Overlays */}
      <div className="absolute top-6 left-6 z-10 flex items-center gap-4">
        <div className="flex items-center gap-2 text-blue-400">
          <Bot className="w-8 h-8 animate-pulse" />
          <span className="font-bold text-xl tracking-wider">CAREERLENS AI</span>
        </div>
      </div>

      <div className="absolute top-6 right-6 z-10 flex items-center gap-4">
        <button 
          onClick={toggleAudio}
          className="p-3 rounded-full bg-slate-900/50 border border-blue-500/30 text-blue-400 hover:bg-blue-900/30 transition-all backdrop-blur-md"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button 
          onClick={handleSkip}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600/20 border border-blue-500 text-blue-300 hover:bg-blue-600/40 transition-all font-semibold backdrop-blur-md"
        >
          Skip Intro <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Mascot Dialog Box */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-md"
      >
        <div className="rounded-2xl border border-blue-500/30 bg-slate-900/80 p-6 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
                <Bot className="h-6 w-6 text-blue-400" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-300 mb-1">CareerBuddy AI</h4>
              <p className="text-slate-200 font-medium">
                <span className="typing-animation block overflow-hidden whitespace-nowrap border-r-2 border-blue-400 pr-2 text-sm">
                  Welcome! Let's simulate your future career.
                </span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3D Scene */}
      <Canvas shadows camera={{ position: [0, 0, 25], fov: 60 }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#3b82f6" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <HolographicGlobe />
        
        {/* Floating Cards around the globe */}
        <FloatingCard text="Salary Growth" position={[-5, 2, -2]} rotation={[0, 0.5, -0.1]} color="#10b981" />
        <FloatingCard text="AI Risk" position={[5, 2, -2]} rotation={[0, -0.5, 0.1]} color="#f59e0b" />
        <FloatingCard text="Career Paths" position={[-4, -3, 1]} rotation={[0, 0.3, 0.1]} color="#8b5cf6" />
        <FloatingCard text="Resume Score" position={[4, -3, 2]} rotation={[0, -0.4, -0.1]} color="#3b82f6" />
        
        {/* Portal Tunnel Rings */}
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i} position={[0, 0, i * 4 - 5]} rotation={[0, 0, 0]}>
            <torusGeometry args={[10 + i, 0.05, 16, 100]} />
            <meshBasicMaterial color={i % 2 === 0 ? "#3b82f6" : "#8b5cf6"} transparent opacity={0.3} />
          </mesh>
        ))}

        <CameraRig onComplete={onComplete} />
      </Canvas>
    </motion.div>
  );
}
