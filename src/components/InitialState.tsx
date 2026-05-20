import React, { useState } from 'react';
import { Target, Calendar, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface InitialStateProps {
  onGenerate: (goal: string, timeframe: string) => void;
  isLoading: boolean;
}

const PRESETS = [
  { goal: 'Run a 10K marathon and build core cardio stamina', timeframe: '60 days', label: '🏃 Fit / 10K Run' },
  { goal: 'Build a production-ready SaaS landing page with React & TS', timeframe: '30 days', label: '💻 Code / React App' },
  { goal: 'Launch a dropshipping shop and run standard social ads', timeframe: '3 months', label: '💰 Business / Shop' },
  { goal: 'Learn fluent conversational French vocabulary & basic speech', timeframe: '6 months', label: '🗣️ Language / French' },
];

export const InitialState: React.FC<InitialStateProps> = ({ onGenerate, isLoading }) => {
  const [goal, setGoal] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  // Creative logging statements to display during load states
  const LOADING_STEPS = [
    'Initializing AI Planner Engine...',
    'Analyzing target constraints & timelines...',
    'Structuring cognitive question templates...',
    'Injecting schedule preferences...',
    'Compiling interactive questionnaire wizard...'
  ];

  // Rotate loading steps if loading
  React.useEffect(() => {
    if (isLoading) {
      setLoadingStep(0);
      const interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < LOADING_STEPS.length - 1) return prev + 1;
          return prev;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim() && timeframe.trim()) {
      onGenerate(goal.trim(), timeframe.trim());
    }
  };

  const handleApplyPreset = (presetGoal: string, presetTime: string) => {
    setGoal(presetGoal);
    setTimeframe(presetTime);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fadeIn">
        <div className="relative flex items-center justify-center h-28 w-28 rounded-full bg-slate-900 border border-white/10 shadow-2xl mb-8">
          {/* Animated Glow Rings */}
          <div className="absolute inset-0 rounded-full border border-violet-500/30 animate-ping opacity-75" />
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-violet-600/10 to-cyan-500/10 blur-xl animate-pulse" />
          <Loader2 className="h-12 w-12 text-violet-400 animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-white tracking-wide mb-2">Generating Questions</h3>
        <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
          AI is analyzing your parameters to create custom refining questions...
        </p>
        
        {/* Loading logs ticker */}
        <div className="w-full max-w-xs rounded-xl bg-slate-950/60 border border-white/5 p-3 text-[11px] font-mono text-left space-y-1">
          {LOADING_STEPS.map((step, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-2 transition-all duration-300 ${
                idx === loadingStep 
                  ? 'text-cyan-400 translate-x-1 font-semibold' 
                  : idx < loadingStep 
                    ? 'text-slate-500' 
                    : 'text-slate-800'
              }`}
            >
              <span>{idx < loadingStep ? '✓' : idx === loadingStep ? '➜' : '◦'}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16 animate-fadeIn">
      
      {/* Decorative Blob */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 -z-10 h-72 w-72 rounded-full bg-gradient-to-tr from-violet-600/10 to-cyan-500/10 blur-3xl opacity-60 animate-pulse-slow" />

      {/* Hero Header */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs text-violet-300 font-medium select-none shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          Break down any milestone instantly
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-b from-white via-slate-100 to-slate-300 bg-clip-text text-transparent m-0">
          Supercharge Your Ambitions
        </h2>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Unlock structured, step-by-step cognitive roadmaps tailored specifically to your speed, schedules, and experience. Built entirely in browser state.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Presets Columns */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 select-none">
            <Sparkles className="h-4 w-4 text-violet-400" />
            Popular Presets
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset.goal, preset.timeframe)}
                className="w-full text-left p-3.5 rounded-xl border border-white/5 hover:border-white/15 bg-slate-900/30 hover:bg-slate-900/70 transition-all duration-200 group active:scale-[0.99] flex flex-col gap-1 shadow-sm"
              >
                <span className="text-xs font-semibold text-slate-300 group-hover:text-violet-300 transition-colors">
                  {preset.label}
                </span>
                <span className="text-xs text-slate-400 line-clamp-1 leading-normal">
                  "{preset.goal}"
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Form Column */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-white/8 bg-slate-900/30 backdrop-blur-md p-6 sm:p-8 shadow-2xl relative">
            
            {/* Corner Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 blur-2xl rounded-bl-full pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Field 1: The Goal */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2 select-none">
                  <Target className="h-4 w-4 text-violet-400" />
                  What is your goal?
                </label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Learn Python coding basics and build a web scraper..."
                  required
                  rows={3}
                  className="w-full py-3 px-4 rounded-xl glass-input text-slate-100 placeholder-slate-500 text-sm leading-relaxed"
                />
              </div>

              {/* Field 2: Timeframe */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2 select-none">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  What is the timeframe?
                </label>
                <input
                  type="text"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  placeholder="e.g. 30 days, 3 months, 6 weeks"
                  required
                  className="w-full py-2.5 px-4 rounded-xl glass-input text-slate-100 placeholder-slate-500 text-sm"
                />
                
                {/* Short timechips under field */}
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {['30 days', '60 days', '3 months', '6 months'].map((tChip) => (
                    <button
                      key={tChip}
                      type="button"
                      onClick={() => setTimeframe(tChip)}
                      className="text-[11px] font-semibold text-slate-400 bg-white/5 hover:bg-white/10 hover:text-white rounded-lg px-2.5 py-1 border border-white/5 transition-all"
                    >
                      {tChip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate CTA Button */}
              <button
                type="submit"
                disabled={!goal.trim() || !timeframe.trim()}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-sm font-bold text-white shadow-xl shadow-violet-500/10 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 group active:scale-[0.98]"
              >
                Generate Roadmap
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
