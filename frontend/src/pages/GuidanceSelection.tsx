import { Link } from 'react-router-dom';
import { Briefcase, GraduationCap, Bot, Sparkles, Zap } from 'lucide-react';

export default function GuidanceSelection() {
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
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-center justify-center">
        
        {/* Left Side: Mascot */}
        <div className="relative flex justify-center items-center min-h-[300px] w-full lg:w-1/3">
          {/* Glow effect behind mascot */}
          <div className="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full animate-pulse-glow max-w-[300px] max-h-[300px] m-auto"></div>
          
          {/* Code-only Animated Mascot */}
          <div className="relative z-10 flex items-center justify-center animate-float">
            {/* Orbital Rings */}
            <div className="absolute w-48 h-48 border border-blue-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute w-56 h-56 border border-indigo-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
            <div className="absolute w-64 h-64 border border-blue-400/10 rounded-full border-dashed animate-[spin_20s_linear_infinite]"></div>
            
            {/* Mascot Body (Bot Icon) */}
            <div className="relative w-24 h-24 bg-slate-800/80 backdrop-blur-xl border border-slate-600 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)]">
              <Bot className="w-12 h-12 text-blue-400 animate-[pulse_3s_ease-in-out_infinite]" />
              
              {/* Floating Elements */}
              <div className="absolute -top-3 -right-3 bg-indigo-500/20 p-1.5 rounded-full backdrop-blur-sm border border-indigo-500/30 animate-bounce">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="absolute -bottom-3 -left-3 bg-blue-500/20 p-1.5 rounded-full backdrop-blur-sm border border-blue-500/30 animate-[bounce_2s_ease-in-out_infinite_reverse]">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Selection Cards */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="mb-4 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Choose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Path</span>
            </h1>
            <p className="text-slate-400 text-lg">Tell me where you are in your journey so I can guide you perfectly.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Link to="/educational-domain" className="group relative flex flex-col p-8 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/50 hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="h-14 w-14 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap className="h-7 w-7 text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Educational Guidance</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                I am a student exploring different career domains. I don't have a professional resume yet, but I want to know how to reach my goals.
              </p>
              <div className="inline-flex items-center text-violet-400 font-semibold text-sm group-hover:text-violet-300">
                Explore Domains <Sparkles className="ml-2 w-4 h-4" />
              </div>
            </Link>

            <Link to="/upload" className="group relative flex flex-col p-8 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="h-7 w-7 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Career Guidance</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                I am ready for the job market. I want to upload my resume to get ATS scores, role matching, and a personalized upskilling roadmap.
              </p>
              <div className="inline-flex items-center text-blue-400 font-semibold text-sm group-hover:text-blue-300">
                Upload Resume <Zap className="ml-2 w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
