import { useState } from 'react';
import { BellRing, Mail, MapPin, Briefcase, CheckCircle2 } from 'lucide-react';
import { subscribeToJobs } from '@/services/api';

export default function Notifications() {
  const [formData, setFormData] = useState({
    email: '',
    role: 'Data Analyst',
    location: 'Remote'
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await subscribeToJobs(formData);
      setTimeout(() => {
        setStatus('success');
      }, 800);
    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center pb-6">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <BellRing className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Stay Ahead of the Curve</h1>
        <p className="text-muted-foreground mt-2">Get notified about the latest jobs that match your career path.</p>
      </div>

      <div className="rounded-xl border bg-card p-6 md:p-8 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-12 animate-fade-in-up">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">You're Subscribed!</h2>
            <p className="text-muted-foreground mb-6">
              We'll send curated {formData.role} opportunities in {formData.location} to {formData.email}.
            </p>
            <button 
              onClick={() => setStatus('idle')}
              className="px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200"
            >
              Configure Another Alert
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  required
                  className="flex h-12 w-full rounded-md border border-input bg-blue-950 text-white px-3 pl-10 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Target Role</label>
                <div className="relative flex items-center">
                  <Briefcase className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <select
                    className="flex h-12 w-full rounded-md border border-input bg-blue-950 text-white px-3 pl-10 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Cloud Engineer">Cloud Engineer</option>
                    <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                    <option value="Civil Services">Civil Services</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Location Preference</label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 h-5 w-5 text-muted-foreground" />
                  <select
                    className="flex h-12 w-full rounded-md border border-input bg-blue-950 text-white px-3 pl-10 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  >
                    <option value="Remote">Remote</option>
                    <option value="United States">United States</option>
                    <option value="Europe">Europe</option>
                    <option value="India">India</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-center rounded-lg bg-primary h-12 px-8 text-sm font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              {status === 'loading' ? 'Saving Preferences...' : 'Subscribe to Alerts'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
