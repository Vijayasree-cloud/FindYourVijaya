import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Activity, Compass, TrendingUp, Bot, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CinematicIntro from '../components/3d/CinematicIntro';

export default function Landing() {
  const [introFinished, setIntroFinished] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    // Check if we've seen it this session to avoid annoyance
    if (sessionStorage.getItem('introSeen')) {
      setIntroFinished(true);
      setShowLanding(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('introSeen', 'true');
    setIntroFinished(true);
    // Wait for the CinematicIntro to fade out before showing the landing page UI
    setTimeout(() => setShowLanding(true), 1500);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white selection:bg-primary selection:text-white relative overflow-hidden">
      <AnimatePresence>
        {!introFinished && <CinematicIntro key="intro" onComplete={handleIntroComplete} />}
      </AnimatePresence>

      <AnimatePresence>
        {showLanding && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="w-full relative z-10"
          >
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

      <div className="container relative z-10 mx-auto px-4 py-20 md:py-32 md:px-6">
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left order-2 lg:order-1">
            <div className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1 text-sm font-medium text-slate-300 backdrop-blur-sm mb-6 animate-fade-in-up">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              AI-Powered Career Intelligence
            </div>
            
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Find your <br className="hidden lg:block"/> 
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-primary">Vijayam</span>
            </h1>
            
            <p className="mb-10 max-w-2xl text-lg text-slate-400 sm:text-xl">
              Upload your resume and let our advanced AI simulate your career trajectory, analyze skills gaps, predict salary growth, and generate a personalized learning roadmap.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/select-path"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-primary px-8 py-4 font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-600 hover:shadow-[0_0_40px_8px_rgba(59,130,246,0.3)]"
              >
                <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></span>
                Start Your Journey
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:bg-slate-700 hover:border-slate-500"
              >
                View Demo Dashboard
              </Link>
            </div>
          </div>

          <div className="relative order-1 lg:order-2 flex justify-center items-center min-h-[400px]">
            {/* Glow effect behind mascot */}
            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse-glow max-w-[400px] max-h-[400px] m-auto"></div>
            
            {/* Code-only Animated Mascot */}
            <div className="relative z-10 flex items-center justify-center animate-float">
              {/* Orbital Rings */}
              <div className="absolute w-64 h-64 border border-blue-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute w-72 h-72 border border-indigo-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute w-80 h-80 border border-primary/10 rounded-full border-dashed animate-[spin_20s_linear_infinite]"></div>
              
              {/* Mascot Body (Bot Icon) */}
              <div className="relative w-32 h-32 bg-slate-800/80 backdrop-blur-xl border border-slate-600 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                <Bot className="w-16 h-16 text-primary animate-[pulse_3s_ease-in-out_infinite]" />
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-indigo-500/20 p-2 rounded-full backdrop-blur-sm border border-indigo-500/30 animate-bounce">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-blue-500/20 p-2 rounded-full backdrop-blur-sm border border-blue-500/30 animate-[bounce_2s_ease-in-out_infinite_reverse]">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-left">
          {[
            { icon: Briefcase, title: "ATS Resume Scoring", desc: "Get a market-relevance score instantly." },
            { icon: Compass, title: "Role Suggestions", desc: "Discover the top 5 roles that fit your profile." },
            { icon: TrendingUp, title: "Salary Prediction", desc: "See your 5-year salary growth trajectory." },
            { icon: Activity, title: "Automation Risk", desc: "Know the future stability of your chosen field." }
          ].map((feature, i) => (
            <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:-translate-y-2 hover:border-slate-700">
              <feature.icon className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>

      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]"></div>
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
