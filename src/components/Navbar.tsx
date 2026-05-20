import React from 'react';
import { Compass, Settings, RotateCcw, Globe } from 'lucide-react';
import type { ApiConfig } from '../utils/ai';

interface NavbarProps {
  config: ApiConfig;
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
  onOpenSettings: () => void;
  onReset: () => void;
  showReset: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  config, 
  lang, 
  setLang, 
  onOpenSettings, 
  onReset, 
  showReset 
}) => {
  const toggleLanguage = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="no-print bg-surface text-on-surface sticky top-0 z-40 w-full border-b-[3px] border-black py-3 px-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black bg-secondary-container hard-shadow">
            <Compass className="h-5.5 w-5.5 text-black font-bold" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-display font-extrabold tracking-tight text-on-surface m-0 leading-tight">
              {lang === 'ar' ? 'مخطط الأهداف' : 'Goal Planner'}{' '}
              <span className="text-xs font-bold text-tertiary-container">
                {lang === 'ar' ? 'الذكي' : 'AI'}
              </span>
            </h1>
            <p className="text-[9px] text-outline font-bold tracking-wider uppercase m-0 leading-none">
              {lang === 'ar' ? 'مولد خطط العمل التفاعلية' : 'Roadmap Generator'}
            </p>
          </div>
        </div>

        {/* Right Side: Control Stack */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          
          {/* Status Indicator Badge */}
          <div className="hidden md:inline-flex">
            {config.mockMode ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-black border-2 border-black bg-white hard-shadow">
                <span className="h-2 w-2 rounded-full bg-secondary-container" />
                {lang === 'ar' ? 'محاكاة سريعة' : 'Mock Mode'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-black border-2 border-black bg-tertiary-container/10 hard-shadow">
                <span className="h-2 w-2 rounded-full bg-tertiary-container animate-pulse" />
                {lang === 'ar' ? 'ذكاء مباشر' : 'Live AI'}
              </span>
            )}
          </div>

          {/* Bilingual Language Switcher Button (Stitch inspired) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black font-display text-xs font-bold bg-white hard-shadow hover:bg-surface-container-low transition-all active:scale-95 cursor-pointer"
            title={lang === 'ar' ? 'Switch to English' : 'تحويل للغة العربية'}
          >
            <Globe className="h-4 w-4 text-black" />
            <span className="font-extrabold">{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Reset / Return Button */}
          {showReset && (
            <button
              onClick={onReset}
              className="px-3.5 py-1.5 border-2 border-black font-display text-xs font-bold bg-white hard-shadow hover:bg-surface-container-low transition-all active:scale-95 cursor-pointer flex items-center gap-1"
              title={lang === 'ar' ? 'البدء من جديد' : 'Start Over'}
            >
              <RotateCcw className="h-4 w-4 text-black" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'الخطة' : 'The Plan'}</span>
            </button>
          )}

          {/* Settings Trigger Icon (Neo-brutalist CTA) */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 border-2 border-black bg-secondary-container hard-shadow hover:hard-shadow-hover transition-all active:scale-95 cursor-pointer flex items-center justify-center"
            title={lang === 'ar' ? 'إعدادات محرك الذكاء الاصطناعي' : 'Configure API Engine'}
          >
            <Settings className="h-4.5 w-4.5 text-black" />
          </button>

        </div>

      </div>
    </header>
  );
};
