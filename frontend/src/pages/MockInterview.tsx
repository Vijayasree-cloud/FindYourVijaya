import React, { useState } from 'react';
import { Loader2, Maximize2, Minimize2 } from 'lucide-react';

export default function MockInterview() {
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className={`relative w-full flex flex-col rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 transition-all ${isFullscreen ? 'fixed inset-0 z-[100] h-screen rounded-none border-none' : 'min-h-[85vh] h-[85vh]'}`}>
      
      {/* Header Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 p-3 flex justify-between items-center z-20">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          Live Mock Interview
        </h2>
        
        <button 
          onClick={toggleFullscreen}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
        >
          {isFullscreen ? (
            <><Minimize2 className="w-4 h-4" /> Exit Fullscreen</>
          ) : (
            <><Maximize2 className="w-4 h-4" /> Enter Fullscreen</>
          )}
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 top-[60px] flex flex-col items-center justify-center bg-slate-950 z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-[30px] rounded-full animate-pulse"></div>
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-6 relative z-10" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Connecting to AI Simulator...</h3>
          <p className="text-slate-400 font-medium">Please allow microphone and camera access if prompted.</p>
        </div>
      )}

      {/* Lovable iframe */}
      <iframe 
        src="https://aihiringweb.lovable.app" 
        className="w-full h-full flex-1 border-none bg-white"
        onLoad={() => setLoading(false)}
        allow="camera *; microphone *; fullscreen *; display-capture *; autoplay *"
      />
    </div>
  );
}
