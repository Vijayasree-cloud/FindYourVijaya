import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, UserRound, Bell, ChevronDown, LogOut, Settings, User, Sparkles, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-blue-500 to-violet-600 p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <Link to="/" className="self-center whitespace-nowrap text-xl font-bold tracking-tight text-white">
            VIJAYAM
          </Link>
        </div>
        
        {/* Main Navigation - Removed per user request */}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-slate-950"></span>
          </button>

          {/* Auth State Handling */}
          {!user ? (
            <Link 
              to="/login"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90"
            >
              Sign In
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center justify-center h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all border border-slate-200 dark:border-slate-700"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold text-sm uppercase">
                  {user.user_metadata?.username ? user.user_metadata.username.charAt(0) : (user.email ? user.email.charAt(0) : 'U')}
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 origin-top-right z-50">
                  <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.user_metadata?.username || 'User'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>
                  <div className="p-1">
                    <Link to="/upload" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                      <User className="h-4 w-4 text-blue-500" />
                      My Resume
                    </Link>
                    <Link to="/opportunities" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                      <Sparkles className="h-4 w-4 text-violet-500" />
                      Opportunities
                    </Link>
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
                      <Settings className="h-4 w-4 text-slate-500" />
                      Settings
                    </div>
                  </div>
                  <div className="p-1 border-t border-slate-100 dark:border-slate-800">
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 rounded-lg cursor-pointer transition-colors">
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
