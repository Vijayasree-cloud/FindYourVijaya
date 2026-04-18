import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, ArrowRight, BookOpen, Cpu, HeartPulse, Palette } from 'lucide-react';

export default function EducationalDomain() {
  const [domain, setDomain] = useState('');
  const navigate = useNavigate();

  const handleSuggest = (suggestion: string) => {
    setDomain(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      // The role parameter is used in the Roadmap page URL. 
      // e.g. /roadmap/software-engineering
      const formattedDomain = domain.trim().toLowerCase().replace(/\s+/g, '-');
      navigate(`/roadmap/${formattedDomain}`);
    }
  };

  const suggestions = [
    { name: "Software Engineering", icon: Cpu },
    { name: "Artificial Intelligence", icon: Sparkles },
    { name: "Healthcare & Medicine", icon: HeartPulse },
    { name: "Design & UX", icon: Palette },
  ];

  return (
    <div className="flex min-h-[90vh] flex-col items-center justify-center bg-slate-950 text-white relative overflow-hidden p-6 rounded-3xl border border-slate-800/50 shadow-2xl">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
      `}</style>

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-center justify-center">
        
        {/* Left Side: Mascot */}
        <div className="relative flex justify-center items-center min-h-[300px] w-full lg:w-1/3">
          {/* Glow effect behind mascot */}
          <div className="absolute inset-0 bg-violet-500/20 blur-[80px] rounded-full animate-pulse-glow max-w-[300px] max-h-[300px] m-auto"></div>
          
          {/* Code-only Animated Mascot */}
          <div className="relative z-10 flex items-center justify-center animate-float">
            {/* Orbital Rings */}
            <div className="absolute w-48 h-48 border border-violet-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute w-56 h-56 border border-fuchsia-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
            <div className="absolute w-64 h-64 border border-violet-400/10 rounded-full border-dashed animate-[spin_20s_linear_infinite]"></div>
            
            {/* Mascot Body (Bot Icon) */}
            <div className="relative w-24 h-24 bg-slate-800/80 backdrop-blur-xl border border-slate-600 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.3)]">
              <Bot className="w-12 h-12 text-violet-400 animate-[pulse_3s_ease-in-out_infinite]" />
              
              {/* Floating Elements */}
              <div className="absolute -top-3 -right-3 bg-fuchsia-500/20 p-1.5 rounded-full backdrop-blur-sm border border-fuchsia-500/30 animate-bounce">
                <Sparkles className="w-4 h-4 text-fuchsia-400" />
              </div>
              <div className="absolute -bottom-3 -left-3 bg-violet-500/20 p-1.5 rounded-full backdrop-blur-sm border border-violet-500/30 animate-[bounce_2s_ease-in-out_infinite_reverse]">
                <BookOpen className="w-4 h-4 text-violet-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8 bg-slate-900/60 p-8 rounded-3xl border border-slate-800 backdrop-blur-lg">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
              Define your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Domain</span>
            </h1>
            <p className="text-slate-400 text-base">What field are you most passionate about? Tell me, and I'll generate a personalized roadmap to get you there.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. Artificial Intelligence, Data Science..."
                className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl py-4 px-6 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-lg"
                required
              />
            </div>
            <button
              type="submit"
              disabled={!domain.trim()}
              className="w-full group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-violet-600 px-8 py-4 font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-violet-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Generate AI Roadmap
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="border-t border-slate-800 pt-6">
            <p className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Popular Domains</p>
            <div className="flex flex-wrap gap-3">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSuggest(sug.name)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/50 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <sug.icon className="w-4 h-4 text-violet-400" />
                  {sug.name}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
