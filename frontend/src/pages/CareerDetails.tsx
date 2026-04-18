import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldAlert, BookOpen, ExternalLink, Activity, ToggleLeft, ToggleRight, Briefcase } from 'lucide-react';
import { getRoles, getRoleDetails } from '@/services/api';
import { useResume } from '../context/ResumeContext';

export default function CareerDetails() {
  const { role } = useParams();
  const [roleData, setRoleData] = useState<any>(null);
  const [isGovernment, setIsGovernment] = useState(false);
  const [loading, setLoading] = useState(true);
  const { resumeText } = useResume();

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const rolesRes = await getRoles();
        let found = rolesRes.find((r: any) => 
          r.roleName.toLowerCase().replace(/ /g, '-') === role
        );
        
        // If not found in local JSON, it's a dynamic AI role from the dashboard
        const roleNameQuery = found ? found.roleName : (role ? role.replace(/-/g, ' ') : 'Role');
        
        // Fetch detailed AI description
        const detailedData = await getRoleDetails(roleNameQuery, resumeText);
        
        // Merge local static data (if any) with dynamic AI data
        setRoleData({
          ...(found || rolesRes[0]),
          roleName: roleNameQuery,
          description: detailedData.description,
          responsibilities: detailedData.responsibilities,
          dayInTheLife: detailedData.dayInTheLife,
          demandScore: detailedData.demandScore || found?.demandScore || 85,
          automationRiskScore: detailedData.automationRiskScore || found?.automationRiskScore || 40,
          typicalPrivateRoles: detailedData.typicalPrivateRoles || [],
          typicalGovtRoles: detailedData.typicalGovtRoles || [],
          roleSpecificSkills: detailedData.roleSpecificSkills || null
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoleData();
  }, [role]);

  if (loading || !roleData) return <div className="flex h-full items-center justify-center">Loading career insights...</div>;

  const mockMissingSkills = ["Cloud Computing", "Kubernetes", "Advanced System Design"];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
              {roleData.category}
            </span>
            <span className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
              Demand: {roleData.demandScore}/100
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{roleData.roleName}</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">{roleData.description}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            to={`/roadmap/${role}`}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Generate Learning Roadmap
          </Link>
        </div>
      </div>


      {/* Private vs Government Path Toggle */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 flex items-center justify-between shadow-sm">
        <div>
          <h3 className="font-semibold text-lg">Career Path Strategy</h3>
          <p className="text-sm text-muted-foreground">Toggle to view insights for Government vs Private sector roles.</p>
        </div>
        <button 
          onClick={() => setIsGovernment(!isGovernment)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800"
        >
          <span className={!isGovernment ? "font-bold text-primary" : "text-slate-500"}>Private</span>
          {isGovernment ? <ToggleRight className="h-6 w-6 text-primary" /> : <ToggleLeft className="h-6 w-6 text-slate-400" />}
          <span className={isGovernment ? "font-bold text-primary" : "text-slate-500"}>Government</span>
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Skills Gap Analyzer */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-slate-800 bg-slate-900/50 p-4">
            <h3 className="font-semibold">Skills Gap Analyzer (Based on Resume)</h3>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Skills You Have (Matched)</h4>
              <div className="flex flex-wrap gap-2">
                {roleData.roleSpecificSkills?.matchedSkills && roleData.roleSpecificSkills.matchedSkills.length > 0 ? (
                  roleData.roleSpecificSkills.matchedSkills.map((skill: string, i: number) => (
                    <span key={i} className="inline-flex rounded-md bg-green-50 border border-green-200 px-3 py-1 text-xs font-semibold text-green-700">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">No matched skills detected for this specific role.</span>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
                Missing Skills to Learn
                <span className="ml-2 inline-flex items-center justify-center rounded-full bg-red-100 h-5 w-5 text-[10px] text-red-700 font-bold">
                  {roleData.roleSpecificSkills?.missingSkills?.length || 0}
                </span>
              </h4>
              <div className="space-y-3">
                {roleData.roleSpecificSkills?.missingSkills && roleData.roleSpecificSkills.missingSkills.length > 0 ? (
                  roleData.roleSpecificSkills.missingSkills.map((skill: string, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-red-100 bg-red-50/30">
                      <span className="font-medium text-sm">{skill}</span>
                      <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">Priority {i + 1}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm text-slate-500">No missing skills detected!</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Future Risk & Stability & Available Roles */}
        <div className="space-y-8">
          
          {/* Available Roles */}
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-slate-800 bg-slate-900/50 p-4">
              <h3 className="font-semibold text-primary">Typical {isGovernment ? 'Government' : 'Private'} Roles</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {isGovernment ? (
                  roleData.typicalGovtRoles?.map((r: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="mt-0.5 bg-primary/10 p-1.5 rounded-md text-primary"><Briefcase className="h-4 w-4" /></div> 
                      <div>
                        <strong className="text-white block mb-1">{r.title}</strong> 
                        {r.description}
                      </div>
                    </li>
                  ))
                ) : (
                  roleData.typicalPrivateRoles?.map((r: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="mt-0.5 bg-primary/10 p-1.5 rounded-md text-primary"><Briefcase className="h-4 w-4" /></div> 
                      <div>
                        <strong className="text-white block mb-1">{r.title}</strong> 
                        {r.description}
                      </div>
                    </li>
                  ))
                )}
                
                {/* Fallbacks if AI hasn't returned them yet */}
                {isGovernment && (!roleData.typicalGovtRoles || roleData.typicalGovtRoles.length === 0) && (
                  <li className="text-slate-500 text-sm italic">Loading government roles from AI...</li>
                )}
                {!isGovernment && (!roleData.typicalPrivateRoles || roleData.typicalPrivateRoles.length === 0) && (
                  <li className="text-slate-500 text-sm italic">Loading private roles from AI...</li>
                )}
              </ul>
            </div>
          </div>
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-slate-800 bg-slate-900/50 p-4">
              <h3 className="font-semibold flex items-center">
                <Activity className="h-4 w-4 mr-2 text-orange-500" />
                Future Job Risk & Stability
              </h3>
            </div>
            <div className="p-6">
              <div className="mb-2 flex justify-between items-center text-sm">
                <span className="font-medium">Automation Risk Score</span>
                <span className="font-bold text-orange-600">{roleData.automationRiskScore}/100</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden mb-6">
                <div 
                  className={`h-full rounded-full ${roleData.automationRiskScore > 50 ? 'bg-red-500' : 'bg-orange-400'}`} 
                  style={{ width: `${roleData.automationRiskScore}%` }}
                ></div>
              </div>
              
              <div className="rounded-lg bg-slate-900 p-4 text-sm border border-slate-800 text-slate-300">
                <ShieldAlert className="h-5 w-5 mb-2 text-slate-500" />
                <p className="text-muted-foreground">
                  {roleData.automationRiskScore < 30 ? "This role is highly secure against near-term AI automation." : 
                   roleData.automationRiskScore < 60 ? "Moderate risk. Focus on complex problem-solving rather than repetitive tasks to stay relevant." : 
                   "High risk. Certain aspects of this role will be fully automated in 5 years. Transition planning advised."}
                </p>
              </div>
            </div>
          </div>

          {/* Government vs Private Comparison Block */}
          {isGovernment && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 shadow-sm overflow-hidden animate-fade-in-up">
              <div className="border-b border-primary/10 bg-primary/10 p-4">
                <h3 className="font-semibold text-primary">Government vs Private Comparison</h3>
              </div>
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 bg-slate-900 border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-2">Metric</th>
                        <th className="px-4 py-2 font-semibold text-primary">Government</th>
                        <th className="px-4 py-2 font-semibold text-slate-700">Private</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                      <tr>
                        <td className="px-4 py-3 font-medium">Job Security</td>
                        <td className="px-4 py-3 text-green-600 font-medium">Very High</td>
                        <td className="px-4 py-3 text-orange-500 font-medium">Low/Medium</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Growth Speed</td>
                        <td className="px-4 py-3">Slow (Time-based)</td>
                        <td className="px-4 py-3 text-green-600 font-medium">Fast (Skill-based)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Salary Stability</td>
                        <td className="px-4 py-3 text-green-600 font-medium">High</td>
                        <td className="px-4 py-3">Variable (Market-dependent)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Work-life Balance</td>
                        <td className="px-4 py-3 text-green-600 font-medium">Excellent</td>
                        <td className="px-4 py-3 text-orange-500">Often Demanding</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Entry Barrier</td>
                        <td className="px-4 py-3 text-red-500 font-medium">High (Tough Exams)</td>
                        <td className="px-4 py-3 text-blue-500">Medium (Skills/Interviews)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 rounded border border-slate-800 bg-slate-900 p-3 text-xs text-slate-400">
                  <span className="font-semibold text-slate-900 block mb-1">Timeline Strategy for Government Exams:</span>
                  12-18 months of rigorous preparation required (e.g., UPSC, SSC CGL, GATE). Focus heavily on General Studies, Quantitative aptitude, and domain-specific mains.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
