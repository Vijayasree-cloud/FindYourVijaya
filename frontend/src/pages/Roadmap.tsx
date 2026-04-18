import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowDown, Map as MapIcon, Loader2, BookOpen, Youtube, Globe, GraduationCap, Github, Briefcase, ExternalLink, Sparkles } from 'lucide-react';
import { getRoadmap } from '@/services/api';

export default function Roadmap() {
  const { role } = useParams();
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const titleCaseRole = role?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Career Role';
        const res = await getRoadmap(titleCaseRole);
        setRoadmap(res.roadmap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [role]);

  if (loading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 bg-slate-950 text-slate-200 rounded-2xl w-full">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-500/20 blur-[50px] rounded-full animate-pulse"></div>
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 relative z-10" />
        </div>
        <p className="text-lg text-slate-400 animate-pulse font-medium">Generating AI Roadmap for {role}...</p>
      </div>
    );
  }

  const formatRole = role?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen py-12 px-4 sm:px-6 md:px-12 rounded-3xl shadow-2xl relative overflow-hidden animate-fade-in-up border border-slate-800/50">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-50">
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-slate-900 border border-slate-700 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <MapIcon className="h-10 w-10 text-blue-400 animate-[bounce_3s_infinite]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Your 6-Month <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Roadmap</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Personalized learning path and milestones to master your career as a <strong className="text-white font-semibold">{formatRole}</strong>.
          </p>
        </div>

        <div className="relative pl-8 md:pl-0 mt-12">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-indigo-500/50 to-violet-500/50 -translate-x-1/2"></div>
          
          {/* Month 1 */}
          <div className="relative flex flex-col md:flex-row items-center justify-start group mb-8 md:mb-0 z-10 pointer-events-none">
            <div className="absolute left-8 md:left-1/2 h-8 w-8 rounded-full bg-slate-900 border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] -translate-x-1/2 flex items-center justify-center text-white z-50 transition-transform group-hover:scale-125 duration-300">
              <span className="text-[11px] font-bold text-blue-400">M1</span>
            </div>
            
            <div className="w-full md:w-[45%] pl-12 md:pl-0 md:pr-12 text-left md:text-right relative">
              <div className="rounded-2xl border border-blue-500/20 bg-slate-900/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)] relative z-10 pointer-events-auto">
                <h3 className="flex items-center md:justify-end gap-2 text-2xl font-bold text-white">
                  Foundation <span className="text-sm font-medium text-slate-500 ml-2">(Month 1)</span>
                </h3>
                <p className="text-md text-blue-400 font-medium mt-1 mb-5">{roadmap?.month1?.focus || "Core Basics"}</p>
                
                <div className="mb-5 text-left bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500"/> Skills to Learn</h4>
                  <ul className="space-y-2">
                    {(roadmap?.month1?.skillsToLearn || ["HTML", "CSS", "JS basics"]).map((skill: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300 font-medium">
                        <Circle className="h-2 w-2 text-blue-500 shrink-0 mt-1.5 fill-blue-500/20" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="rounded-xl bg-slate-800/50 p-4 text-left border border-slate-700/50">
                  <h4 className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-2"><Sparkles className="w-3 h-3 text-yellow-500"/> Project Milestone</h4>
                  <p className="text-sm font-bold text-white">{roadmap?.month1?.project || "Simple Landing Page"}</p>
                </div>
                
                {roadmap?.month1?.resources && roadmap.month1.resources.length > 0 && (
                  <div className="mt-4 border-t border-slate-800 pt-4 text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Learning Resources</h4>
                    <ul className="space-y-3">
                      {roadmap.month1.resources.map((res: any, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(res.link?.startsWith('http') ? res.link : `https://www.youtube.com/results?search_query=${encodeURIComponent(res.name + ' tutorial')}`, '_blank');
                            }}
                            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors font-semibold relative z-20 cursor-pointer"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {res.name}
                          </button>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${res.type === 'Free' || res.type === 'free' ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-amber-900/30 text-amber-400 border-amber-800'}`}>
                            {res.type || 'Free'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Month 3 */}
          <div className="relative flex flex-col md:flex-row items-center md:justify-end group mb-8 md:-mt-32 z-20 pointer-events-none">
            <div className="absolute left-8 md:left-1/2 h-8 w-8 rounded-full bg-slate-900 border-2 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] -translate-x-1/2 flex items-center justify-center text-white z-50 transition-transform group-hover:scale-125 duration-300">
              <span className="text-[11px] font-bold text-indigo-400">M3</span>
            </div>
            
            <div className="w-full md:w-[45%] pl-12 md:pr-0 md:pl-12 text-left relative">
              <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-indigo-500/50 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.3)] relative z-20 shadow-2xl pointer-events-auto">
                <h3 className="flex items-center gap-2 text-2xl font-bold text-white">
                  Intermediate <span className="text-sm font-medium text-slate-500 ml-2">(Month 2-3)</span>
                </h3>
                <p className="text-md text-indigo-400 font-medium mt-1 mb-5">{roadmap?.month3?.focus || "Frameworks & Logic"}</p>
                
                <div className="mb-5 bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500"/> Skills to Learn</h4>
                  <ul className="space-y-2">
                    {(roadmap?.month3?.skillsToLearn || ["React", "API integration", "Git"]).map((skill: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300 font-medium">
                        <Circle className="h-2 w-2 text-indigo-500 shrink-0 mt-1.5 fill-indigo-500/20" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="rounded-xl bg-slate-800/50 p-4 border border-slate-700/50">
                  <h4 className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-2"><Sparkles className="w-3 h-3 text-yellow-500"/> Project Milestone</h4>
                  <p className="text-sm font-bold text-white">{roadmap?.month3?.project || "Dynamic Web App with API"}</p>
                </div>
                
                {roadmap?.month3?.resources && roadmap.month3.resources.length > 0 && (
                  <div className="mt-4 border-t border-slate-800 pt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Learning Resources</h4>
                    <ul className="space-y-3">
                      {roadmap.month3.resources.map((res: any, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(res.link?.startsWith('http') ? res.link : `https://www.youtube.com/results?search_query=${encodeURIComponent(res.name + ' tutorial')}`, '_blank');
                            }}
                            className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 hover:underline transition-colors font-semibold relative z-20 cursor-pointer"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {res.name}
                          </button>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${res.type === 'Free' || res.type === 'free' ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-amber-900/30 text-amber-400 border-amber-800'}`}>
                            {res.type || 'Free'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Month 6 */}
          <div className="relative flex flex-col md:flex-row items-center justify-start group md:-mt-32 z-30 pointer-events-none">
            <div className="absolute left-8 md:left-1/2 h-10 w-10 rounded-full bg-slate-900 border-2 border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.6)] -translate-x-1/2 flex items-center justify-center text-white z-50 transition-transform group-hover:scale-125 duration-300">
              <span className="text-[13px] font-extrabold text-violet-400">M6</span>
            </div>
            
            <div className="w-full md:w-[45%] pl-12 md:pl-0 md:pr-12 text-left md:text-right relative">
              <div className="rounded-2xl border border-violet-500/30 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-violet-400/60 hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.4)] relative z-30 pointer-events-auto">
                <h3 className="flex items-center md:justify-end gap-2 text-2xl font-bold text-white">
                  Advanced <span className="text-sm font-medium text-slate-500 ml-2">(Month 4-6)</span>
                </h3>
                <p className="text-md text-violet-400 font-medium mt-1 mb-5">{roadmap?.month6?.focus || "Architecture & Polish"}</p>
                
                <div className="mb-5 text-left bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-500"/> Skills to Learn</h4>
                  <ul className="space-y-2">
                    {(roadmap?.month6?.skillsToLearn || ["System Design", "Cloud/Vercel", "Testing"]).map((skill: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300 font-medium">
                        <Circle className="h-2 w-2 text-violet-500 shrink-0 mt-1.5 fill-violet-500/20" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="rounded-xl bg-violet-950/40 p-4 text-left border border-violet-500/30">
                  <h4 className="text-xs font-semibold text-violet-300 mb-1 flex items-center gap-2"><Sparkles className="w-3 h-3 text-yellow-400"/> Final Capstone</h4>
                  <p className="text-sm font-extrabold text-white">{roadmap?.month6?.project || "Full Stack Application ready for Recruiter Review"}</p>
                </div>
                
                {roadmap?.month6?.resources && roadmap.month6.resources.length > 0 && (
                  <div className="mt-4 border-t border-slate-800 pt-4 text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Learning Resources</h4>
                    <ul className="space-y-3">
                      {roadmap.month6.resources.map((res: any, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(res.link?.startsWith('http') ? res.link : `https://www.youtube.com/results?search_query=${encodeURIComponent(res.name + ' tutorial')}`, '_blank');
                            }}
                            className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 hover:underline transition-colors font-semibold relative z-20 cursor-pointer"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {res.name}
                          </button>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${res.type === 'Free' || res.type === 'free' ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-amber-900/30 text-amber-400 border-amber-800'}`}>
                            {res.type || 'Free'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Resource Recommender System */}
        <div className="mt-24 pt-12 relative border-t border-slate-800">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-4">
            <BookOpen className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold mb-10 text-center text-white">
            Essential Resource Directory
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* YouTube Channels */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(239,68,68,0.2)] group">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-xl bg-red-500/10 text-red-500 group-hover:scale-110 transition-transform"><Youtube className="h-6 w-6" /></div>
                <h3 className="font-bold text-lg text-white">YouTube Channels</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-400 font-medium">
                <li>
                  <a href="https://www.youtube.com/c/Freecodecamp" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group/link cursor-pointer hover:text-red-400 transition-colors relative z-50">
                    <span>FreeCodeCamp</span> <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/c/TraversyMedia" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group/link cursor-pointer hover:text-red-400 transition-colors relative z-50">
                    <span>Traversy Media</span> <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/c/Fireship" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group/link cursor-pointer hover:text-red-400 transition-colors relative z-50">
                    <span>Fireship (Quick Concepts)</span> <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Free Platforms */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-green-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(34,197,94,0.2)] group">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-xl bg-green-500/10 text-green-500 group-hover:scale-110 transition-transform"><Globe className="h-6 w-6" /></div>
                <h3 className="font-bold text-lg text-white">Free Platforms</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-400 font-medium">
                <li>
                  <a href="https://www.coursera.org/courses?query=free" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group/link cursor-pointer hover:text-green-400 transition-colors relative z-50">
                    <span>Coursera (Audit Mode)</span> <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="https://www.edx.org/search" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group/link cursor-pointer hover:text-green-400 transition-colors relative z-50">
                    <span>edX Free Courses</span> <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="https://www.codecademy.com/catalog/subject/all" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group/link cursor-pointer hover:text-green-400 transition-colors relative z-50">
                    <span>Codecademy (Basic)</span> <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Paid Courses */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(234,179,8,0.2)] group">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-500 group-hover:scale-110 transition-transform"><GraduationCap className="h-6 w-6" /></div>
                <h3 className="font-bold text-lg text-white">Paid Certifications</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-400 font-medium">
                <li>
                  <a href="https://www.udemy.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group/link cursor-pointer hover:text-yellow-400 transition-colors relative z-50">
                    <span>Udemy Complete Bootcamp</span> <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="https://aws.amazon.com/certification/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group/link cursor-pointer hover:text-yellow-400 transition-colors relative z-50">
                    <span>AWS/Azure Certification</span> <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="https://www.pluralsight.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group/link cursor-pointer hover:text-yellow-400 transition-colors relative z-50">
                    <span>Pluralsight Paths</span> <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </li>
              </ul>
            </div>

            {/* GitHub Projects */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-slate-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(148,163,184,0.2)] group">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-xl bg-slate-700/50 text-slate-300 group-hover:scale-110 transition-transform"><Github className="h-6 w-6" /></div>
                <h3 className="font-bold text-lg text-white">GitHub Practice</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-400 font-medium">
                <li>
                  <a href="https://github.com/topics/resume-parser" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group/link cursor-pointer hover:text-slate-300 transition-colors relative z-50">
                    <span>Build a Resume Parser</span> <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="https://opensource.guide/how-to-contribute/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group/link cursor-pointer hover:text-slate-300 transition-colors relative z-50">
                    <span>Contribute to Open Source</span> <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="https://github.com/topics/100daysofcode" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group/link cursor-pointer hover:text-slate-300 transition-colors relative z-50">
                    <span>100 Days of Code Repo</span> <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Internships */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.2)] group">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform"><Briefcase className="h-6 w-6" /></div>
                <h3 className="font-bold text-lg text-white">Paid Internships</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-400 font-medium">
                <li>
                  <a href="https://wellfound.com/jobs" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group/link cursor-pointer hover:text-blue-400 transition-colors relative z-50">
                    <span>Wellfound (AngelList)</span> <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="https://www.ycombinator.com/jobs" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group/link cursor-pointer hover:text-blue-400 transition-colors relative z-50">
                    <span>Y Combinator Jobs</span> <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/jobs/internship-jobs/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group/link cursor-pointer hover:text-blue-400 transition-colors relative z-50">
                    <span>LinkedIn Entry Level Filters</span> <ExternalLink className="h-4 w-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
