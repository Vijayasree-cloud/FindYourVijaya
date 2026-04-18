import { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Building, Filter, AlertTriangle } from 'lucide-react';
import { getAiOpportunities } from '@/services/api';
import { useResume } from '../context/ResumeContext';

export default function Opportunities() {
  const { recommendedRoles } = useResume();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (!recommendedRoles || recommendedRoles.length === 0) {
          setError("No resume data found. Please upload a resume first.");
          setLoading(false);
          return;
        }
        
        const roleNames = recommendedRoles.map(r => r.roleName);
        const res = await getAiOpportunities(roleNames);
        setJobs(res);
      } catch (err) {
        console.error(err);
        setError("Failed to generate personalized opportunities.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [recommendedRoles]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = (job?.role?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (job?.companyName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || job.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Opportunities</h1>
          <p className="text-muted-foreground mt-1">Discover roles matched to your simulated career path.</p>
        </div>
      </div>

      {/* Job Trend Intelligence (Simulated AI Feed) */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <h3 className="font-semibold text-blue-900">AI Trend Prediction</h3>
          </div>
          <p className="text-sm text-blue-800 mb-3">
            Our AI simulator predicts a <span className="font-bold">24% surge</span> in demand for data-centric roles in the next 18 months due to widespread LLM adoption.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-slate-900 text-blue-300 px-2 py-1 rounded border border-blue-900/50">#AI Engineering</span>
            <span className="text-xs bg-slate-900 text-blue-300 px-2 py-1 rounded border border-blue-900/50">#Prompt Engineering</span>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="font-semibold text-emerald-900">Emerging Fields Alerts</h3>
          </div>
          <p className="text-sm text-emerald-800 mb-3">
            We are tracking early signals for massive growth in specific cross-disciplinary sectors. Early upskilling recommended.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-slate-900 text-emerald-300 px-2 py-1 rounded border border-emerald-900/50">#Green Tech Roles</span>
            <span className="text-xs bg-slate-900 text-emerald-300 px-2 py-1 rounded border border-emerald-900/50">#Cybersecurity Automation</span>
            <span className="text-xs bg-slate-900 text-emerald-300 px-2 py-1 rounded border border-emerald-900/50">#Robotics</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-red-400 flex items-start gap-3 mb-8">
          <AlertTriangle className="h-6 w-6 shrink-0" />
          <div>
            <h3 className="font-bold text-red-300">Could Not Load Opportunities</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search roles or companies..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Private', 'Government'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                filterType === type 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">Loading opportunities...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.length > 0 ? filteredJobs.map((job, idx) => (
            <div key={idx} className="group flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    job.type === 'Government' ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {job.type}
                  </span>
                  <span className="text-xs text-muted-foreground">{job.postedDate}</span>
                </div>
                
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{job.role}</h3>
                
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4" /> {job.companyName}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" /> {job.location}
                  </div>
                  <div className="flex items-center text-slate-700 font-medium mt-1">
                    <DollarSign className="mr-2 h-4 w-4 text-green-600" /> {job.salaryRange}
                  </div>
                </div>
              </div>
              
              <a 
                href={`https://www.linkedin.com/jobs/search?keywords=${encodeURIComponent(job.role || 'Job')}&location=${encodeURIComponent(job.location || '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-6 block w-full text-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-primary hover:text-white relative z-10"
              >
                Apply Now
              </a>
            </div>
          )) : (
            <div className="col-span-full py-12 text-center border border-slate-800 rounded-xl bg-slate-900/50 text-slate-400">
              No opportunities found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
