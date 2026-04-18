import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type MascotState = 'idle' | 'thinking' | 'success' | 'error' | 'typing';

interface MascotContextType {
  isMascotVisible: boolean;
  toggleMascot: () => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  mascotState: MascotState;
  setMascotState: (state: MascotState) => void;
  playSound: (type: 'pop' | 'success' | 'error' | 'typing') => void;
}

const MascotContext = createContext<MascotContextType | undefined>(undefined);

export function MascotProvider({ children }: { children: ReactNode }) {
  const [isMascotVisible, setIsMascotVisible] = useState(true);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [mascotState, setMascotState] = useState<MascotState>('idle');

  // Web Audio API Synthesizer
  const playSound = useCallback((type: 'pop' | 'success' | 'error' | 'typing') => {
    if (!isSoundEnabled) return;
    
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();

      const playTone = (freq: number, type: OscillatorType, duration: number, startTime: number = ctx.currentTime, vol: number = 0.1) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(vol, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      switch (type) {
        case 'pop':
          playTone(600, 'sine', 0.1, ctx.currentTime, 0.2);
          playTone(800, 'sine', 0.1, ctx.currentTime + 0.05, 0.2);
          break;
        case 'success':
          playTone(440, 'sine', 0.1, ctx.currentTime, 0.1);
          playTone(554.37, 'sine', 0.1, ctx.currentTime + 0.1, 0.1);
          playTone(659.25, 'sine', 0.3, ctx.currentTime + 0.2, 0.1);
          playTone(880, 'sine', 0.4, ctx.currentTime + 0.3, 0.15);
          break;
        case 'error':
          playTone(200, 'sawtooth', 0.2, ctx.currentTime, 0.1);
          playTone(150, 'sawtooth', 0.3, ctx.currentTime + 0.2, 0.1);
          break;
        case 'typing':
          // Simulate rapid keyboard clacks
          for (let i = 0; i < 5; i++) {
            playTone(800 + Math.random() * 200, 'square', 0.05, ctx.currentTime + i * 0.1, 0.02);
          }
          break;
      }
    } catch (err) {
      console.warn("Audio playback failed", err);
    }
  }, [isSoundEnabled]);

  return (
    <MascotContext.Provider 
      value={{ 
        isMascotVisible, 
        toggleMascot: () => setIsMascotVisible(prev => !prev), 
        isSoundEnabled, 
        toggleSound: () => setIsSoundEnabled(prev => !prev), 
        mascotState, 
        setMascotState,
        playSound
      }}
    >
      {children}
    </MascotContext.Provider>
  );
}

export function useMascot() {
  const context = useContext(MascotContext);
  if (context === undefined) {
    throw new Error('useMascot must be used within a MascotProvider');
  }
  return context;
}
