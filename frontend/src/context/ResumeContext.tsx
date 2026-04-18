import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface RoleRecommendation {
  roleName: string;
  category: string;
  matchPercentage: number;
  requiredSkills: string[];
  whyRecommended: string;
}

export interface ResumeScore {
  score: number;
  missingKeywords: string[];
  matchedSkills: string[];
  feedback: string;
  improvements: string[];
}

interface ResumeContextType {
  resumeText: string | null;
  setResumeText: (text: string | null) => void;
  resumeScore: ResumeScore | null;
  setResumeScore: (score: ResumeScore | null) => void;
  recommendedRoles: RoleRecommendation[];
  setRecommendedRoles: (roles: RoleRecommendation[]) => void;
  clearResumeData: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeText, setResumeTextState] = useState<string | null>(() => {
    return localStorage.getItem('resumeText');
  });
  
  const [resumeScore, setResumeScoreState] = useState<ResumeScore | null>(() => {
    try {
      const saved = localStorage.getItem('resumeScore');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse resumeScore from localStorage", e);
      return null;
    }
  });

  const [recommendedRoles, setRecommendedRolesState] = useState<RoleRecommendation[]>(() => {
    try {
      const saved = localStorage.getItem('recommendedRoles');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (e) {
      console.error("Failed to parse recommendedRoles from localStorage", e);
      return [];
    }
  });

  const setResumeText = (text: string | null) => {
    setResumeTextState(text);
    if (text) {
      localStorage.setItem('resumeText', text);
    } else {
      localStorage.removeItem('resumeText');
    }
  };

  const setResumeScore = (score: ResumeScore | null) => {
    setResumeScoreState(score);
    if (score) {
      localStorage.setItem('resumeScore', JSON.stringify(score));
    } else {
      localStorage.removeItem('resumeScore');
    }
  };

  const setRecommendedRoles = (roles: RoleRecommendation[]) => {
    setRecommendedRolesState(roles);
    if (roles.length > 0) {
      localStorage.setItem('recommendedRoles', JSON.stringify(roles));
    } else {
      localStorage.removeItem('recommendedRoles');
    }
  };

  const clearResumeData = () => {
    setResumeText(null);
    setResumeScore(null);
    setRecommendedRoles([]);
  };

  return (
    <ResumeContext.Provider 
      value={{ 
        resumeText, 
        setResumeText, 
        resumeScore, 
        setResumeScore,
        recommendedRoles,
        setRecommendedRoles,
        clearResumeData
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
