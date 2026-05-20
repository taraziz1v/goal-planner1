import React from 'react';
import { Compass, Settings, RotateCcw } from 'lucide-react';
import type { ApiConfig } from '../utils/ai';

interface NavbarProps {
  config: ApiConfig;
  onOpenSettings: () => void;
  onReset: () => void;
  showReset: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ config, onOpenSettings, onReset, showReset }) => {
  return (
    <header className="no-print glass-panel sticky top-0 z-40 w-full border-b border-white/5 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onReset}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 shadow-lg shadow-violet-500/20">
            <Compass className="h-5.5 w-5.5 text-white animate-pulse-slow" />
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 transition-opacity hover:opacity-100" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent m-0 select-none">
              Goal Planner <span className="text-xs font-semibold text-violet-400">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium m-0 leading-tight select-none">
              Roadmap Generator
            </p>
          </div>
        </div>

        {/* System Settings & Badge info */}
        <div className="flex items-center gap-3">
          
          {/* Simulation mode indicator badge */}
          {config.mockMode ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-medium text-cyan-400 border border-cyan-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Mock Simulation
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-400 border border-violet-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              Live AI Mode
            </span>
          )}

          {/* Reset Button */}
          {showReset && (
            <button
              onClick={onReset}
              className="flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all active:scale-95 duration-200"
              title="Start Over"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          )}

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all active:scale-95 duration-200 bg-slate-900/50"
            title="Configure AI API Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

      </div>
    </header>
  );
};
