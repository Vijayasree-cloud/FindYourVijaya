import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileUp, Compass, Map, Briefcase, BellRing, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useResume } from '../../context/ResumeContext';

export default function Sidebar() {
  const { recommendedRoles } = useResume();
  
  // Create a URL-friendly slug from the top recommended role, or default to data-analyst
  const topRole = recommendedRoles && recommendedRoles.length > 0 && recommendedRoles[0]?.roleName
    ? recommendedRoles[0].roleName.toLowerCase().replace(/\s+/g, '-') 
    : 'data-analyst';

  const navItems = [
    { name: 'Upload Resume', icon: FileUp, path: '/upload' },
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Career Paths', icon: Compass, path: `/career/${topRole}` },
    { name: 'Roadmap', icon: Map, path: `/roadmap/${topRole}` },
    { name: 'Opportunities', icon: Briefcase, path: '/opportunities' },
    { name: 'Mock Interview', icon: Video, path: '/mock-interview' },
    { name: 'Notifications', icon: BellRing, path: '/notifications' },
  ];

  return (
    <aside className="w-64 border-r bg-muted/40 hidden md:block">
      <div className="h-full px-3 py-4 flex flex-col gap-2">
        <h2 className="mb-2 px-4 text-xs font-semibold uppercase tracking-tight text-muted-foreground">
          Navigation
        </h2>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
