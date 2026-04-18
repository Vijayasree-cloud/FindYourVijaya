import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Briefcase, TrendingUp, CheckCircle, AlertTriangle, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getRecommendations, getSalaryProgression } from '@/services/api';
import { useResume } from '../context/ResumeContext';

export default function Dashboard() {
  const [roles, setRoles] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { resumeText, resumeScore, recommendedRoles, setRecommendedRoles } = useResume();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let currentRoles = recommendedRoles;
        
        // If we don't have roles cached in context, fetch them
        if (!currentRoles || currentRoles.length === 0) {
          if (!resumeText) {
            setError("No resume text found. Please go back to the Upload page.");
            setLoading(false);
            return;
          }
          const rolesRes = await getRecommendations(resumeText);
          if (rolesRes.error) {
            throw new Error(rolesRes.error);
          }
          currentRoles = rolesRes.recommendations || [];
          setRecommendedRoles(currentRoles);
        }
        
        if (currentRoles && currentRoles.length > 0) {
          const salaryRes = await getSalaryProgression(currentRoles[0].roleName);
          setChartData(salaryRes.progression || []);
        } else {
          setError("AI could not extract any suitable roles from this resume.");
        }
      } catch (err: any) {
        console.error("Error fetching dashboard data", err);
        setError(err.response?.data?.error || err.message || "Failed to load dashboard data. Is your Gemini API key valid?");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center">Loading your personalized dashboard...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Career Dashboard</h1>
          <p className="text-muted-foreground mt-1">Based on your resume, here is your career intelligence overview.</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-green-900/20 px-4 py-2 text-green-400 border border-green-800/50">
          <CheckCircle className="h-5 w-5" />
          <span className="font-semibold text-white">ATS Score: {resumeScore?.score || '--'}/100</span>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-400 flex items-start gap-3">
          <AlertTriangle className="h-6 w-6 shrink-0" />
          <div>
            <h3 className="font-bold text-red-300">Analysis Failed</h3>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-sm mt-2 font-semibold">Please check your backend .env file and ensure GROQ_API_KEY is configured correctly. You may need to restart your backend server!</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm text-muted-foreground">Top Role Match</h3>
            <Briefcase className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold">{recommendedRoles[0]?.roleName || 'Machine Learning Engineer'}</h2>
            <p className="text-sm font-medium text-green-600 mt-1">{recommendedRoles[0]?.matchPercentage || 85}% match</p>
          </div>
          <div className="absolute right-0 bottom-0 h-24 w-24 translate-x-8 translate-y-8 rounded-full bg-primary/10 blur-xl"></div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm text-muted-foreground">Year 5 Salary Potential</h3>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold">{chartData.length > 0 ? `$${chartData[4]?.salary?.toLocaleString()}` : '--'}</h2>
            <p className="text-sm font-medium text-primary mt-1">
              {chartData.length > 0 
                ? `+${(  ((chartData[4]?.salary - chartData[0]?.salary) / (chartData[0]?.salary || 1)) * 100 ).toFixed(1)}% Growth`
                : 'Data unavailable'}
            </p>
          </div>
          <div className="absolute right-0 bottom-0 h-24 w-24 translate-x-8 translate-y-8 rounded-full bg-green-500/10 blur-xl"></div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm text-muted-foreground">Automation Risk</h3>
            <Activity className="h-4 w-4 text-orange-500" />
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-orange-600">Low to Medium</h2>
            <p className="text-sm font-medium mt-1 flex items-center text-muted-foreground">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Requires upskilling
            </p>
          </div>
          <div className="absolute right-0 bottom-0 h-24 w-24 translate-x-8 translate-y-8 rounded-full bg-orange-500/10 blur-xl"></div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Salary Chart */}
        <div className="md:col-span-2 rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Salary Progression Prediction</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Salary']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="salary" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  activeDot={{ r: 8, fill: "hsl(var(--primary))" }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Matches */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Top Suggested Roles</h3>
          <div className="space-y-4">
            {recommendedRoles && recommendedRoles.map((role: any, index: number) => (
              <Link to={`/career/${role.roleName?.toLowerCase().replace(/ /g, '-') || 'role'}`} key={index} className="block group">
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900 transition-colors group-hover:border-primary/50 group-hover:bg-primary/5">
                  <div>
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{role.roleName}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{role.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-full bg-green-900/30 px-2.5 py-0.5 text-xs font-semibold text-green-400 border border-green-800/50">
                      {role.matchPercentage}%
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Gap Analyzer */}
      {resumeScore && (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Skill Gap Analyzer
            </h3>
            <span className="text-sm text-muted-foreground bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              Based on your resume vs. target roles
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-green-900/30 bg-green-900/10 p-5">
              <h4 className="font-semibold text-green-400 mb-4 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Acquired Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {resumeScore.matchedSkills?.length > 0 ? (
                  resumeScore.matchedSkills.map((skill: string, idx: number) => (
                    <span key={idx} className="inline-flex items-center rounded-md bg-green-500/20 px-2.5 py-1 text-xs font-medium text-green-300 border border-green-500/30">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No specific matched skills detected.</p>
                )}
              </div>
            </div>
            
            <div className="rounded-lg border border-orange-900/30 bg-orange-900/10 p-5">
              <h4 className="font-semibold text-orange-400 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Skills to Learn (Gap)
              </h4>
              <div className="flex flex-wrap gap-2">
                {resumeScore.missingKeywords?.length > 0 ? (
                  resumeScore.missingKeywords.map((skill: string, idx: number) => (
                    <span key={idx} className="inline-flex items-center rounded-md bg-orange-500/20 px-2.5 py-1 text-xs font-medium text-orange-300 border border-orange-500/30">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No major skill gaps detected!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Improvement Suggestions (if available) */}
      {resumeScore?.improvements && resumeScore.improvements.length > 0 && (
        <div className="rounded-xl border border-blue-800 bg-blue-900/20 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Resume Improvement Suggestions
          </h3>
          <ul className="space-y-3">
            {resumeScore.improvements.map((suggestion: string, idx: number) => (
              <li key={idx} className="flex gap-3 text-blue-200">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-800 text-xs font-bold text-blue-100">
                  {idx + 1}
                </span>
                <p className="text-sm">{suggestion}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
