import { useState, useEffect } from 'react';
import { Volume2, VolumeX, X, MessageCircle, Bot, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useMascot } from '../context/MascotContext';

const pageTips: Record<string, string[]> = {
  '/': [
    "Hi there! I'm CareerBuddy AI.",
    "Ready to see your future?",
  ],
  '/upload': [
    "Upload your resume!",
    "I'll analyze it instantly.",
  ],
  '/dashboard': [
    "Your insights are ready!",
    "Check your automation risk.",
  ]
};

export default function Mascot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Hi! I'm CareerBuddy AI.");
  const location = useLocation();
  
  const { 
    isMascotVisible, 
    isSoundEnabled, 
    toggleSound, 
    mascotState,
    playSound 
  } = useMascot();

  useEffect(() => {
    // Determine context-based message
    const path = location.pathname;
    const tips = pageTips[path] || ["I'm here to guide your career path!"];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    setMessage(randomTip);
    
    if (path === '/') {
      setIsOpen(true);
      playSound('pop');
    }
  }, [location.pathname, playSound]);

  if (!isMascotVisible) return null;

  // Determine styles based on state
  let glowColor = "bg-blue-500/30 shadow-[0_0_25px_rgba(59,130,246,0.5)]";
  let ringColor = "border-blue-500/40";
  let eyeColor = "bg-blue-400";
  let animationClass = "animate-float";

  if (mascotState === 'thinking') {
    glowColor = "bg-violet-500/40 shadow-[0_0_35px_rgba(139,92,246,0.6)]";
    ringColor = "border-violet-500/60";
    eyeColor = "bg-violet-400 animate-pulse";
    animationClass = "animate-[bounce_1s_infinite]";
  } else if (mascotState === 'success') {
    glowColor = "bg-green-500/40 shadow-[0_0_35px_rgba(34,197,94,0.6)]";
    ringColor = "border-green-500/60";
    eyeColor = "bg-green-400";
    animationClass = "animate-[bounce_0.5s_ease-out]";
  } else if (mascotState === 'error') {
    glowColor = "bg-red-500/40 shadow-[0_0_35px_rgba(239,68,68,0.6)]";
    ringColor = "border-red-500/60";
    eyeColor = "bg-red-400";
    animationClass = "animate-[shake_0.5s_ease-in-out]";
  } else if (mascotState === 'typing') {
    glowColor = "bg-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.5)]";
    ringColor = "border-indigo-500/50";
    eyeColor = "bg-indigo-400";
    animationClass = "animate-[bounce_0.2s_infinite]";
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Sound Toggle */}
      <button 
        onClick={toggleSound}
        className="absolute -top-10 right-2 p-2 rounded-full bg-slate-800/80 backdrop-blur border border-slate-700 text-slate-400 hover:text-white transition-colors z-40"
      >
        {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </button>

      {/* Chat Bubble */}
      <div 
        className={`mb-4 w-72 rounded-2xl bg-slate-900 border border-primary/30 p-4 text-white shadow-2xl transition-all duration-300 origin-bottom-right
        ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
        `}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/20 p-1">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <span className="font-semibold text-sm">CareerBuddy AI</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {mascotState === 'thinking' ? (
          <div className="flex items-center gap-2 text-sm text-violet-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <Sparkles className="h-4 w-4 animate-spin" /> Analyzing your profile...
          </div>
        ) : mascotState === 'success' ? (
           <div className="flex items-center gap-2 text-sm text-green-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
           <CheckCircle2 className="h-4 w-4" /> Task completed successfully!
         </div>
        ) : mascotState === 'error' ? (
          <div className="flex items-center gap-2 text-sm text-red-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
          <AlertCircle className="h-4 w-4" /> Oops! Something went wrong.
        </div>
        ) : (
          <div className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            {message}
          </div>
        )}
      </div>

      {/* Mascot Avatar 3D CSS Representation */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) playSound('pop');
        }}
        className={`relative flex items-center justify-center transition-transform duration-300 hover:scale-110 outline-none
        ${animationClass}
        `}
        style={{ perspective: '1000px' }}
      >
        {/* Glow effect behind mascot */}
        <div className={`absolute inset-0 blur-[20px] rounded-full max-w-[80px] max-h-[80px] m-auto pointer-events-none transition-colors duration-500 ${glowColor.split(' ')[0]}`}></div>
        
        {/* Orbital Rings */}
        <div className={`absolute w-20 h-20 border rounded-full pointer-events-none transition-colors duration-500 ${ringColor} ${mascotState === 'thinking' ? 'animate-[spin_1s_linear_infinite]' : 'animate-[spin_6s_linear_infinite]'}`}></div>
        <div className={`absolute w-24 h-24 border rounded-full pointer-events-none transition-colors duration-500 border-dashed ${ringColor} ${mascotState === 'thinking' ? 'animate-[spin_2s_linear_infinite_reverse]' : 'animate-[spin_10s_linear_infinite_reverse]'}`}></div>
        
        {/* Mascot Body (3D Glassmorphism) */}
        <div 
          className={`relative w-16 h-16 bg-slate-800/90 backdrop-blur-xl border border-slate-600 rounded-2xl flex flex-col items-center justify-center group z-10 overflow-hidden transition-all duration-500 ${glowColor}`}
          style={{ transformStyle: 'preserve-3d', transform: 'rotateX(10deg) rotateY(-10deg)' }}
        >
          {/* Glass highlight */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-2xl"></div>
          
          {/* Robot Eyes */}
          <div className="flex gap-2 mb-1 relative z-10 translate-z-[10px]">
            <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${eyeColor}`}></div>
            <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${eyeColor}`}></div>
          </div>
          
          {/* Robot Mouth */}
          <div className="w-4 h-1 bg-slate-600 rounded-full relative z-10 translate-z-[15px]"></div>
        </div>
        
        {/* Floating Sparkles */}
        {(mascotState === 'success' || mascotState === 'thinking') && (
          <div className="absolute -top-2 -right-2 bg-yellow-500/20 p-1 rounded-full backdrop-blur-sm border border-yellow-500/30 animate-bounce pointer-events-none z-20">
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
        )}
      </button>

      {/* Shake animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
      `}</style>
    </div>
  );
}
