import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { SettingsModal } from './components/SettingsModal';
import { InitialState } from './components/InitialState';
import { QuestionnaireState } from './components/QuestionnaireState';
import { RoadmapState } from './components/RoadmapState';
import { 
  getApiConfig, 
  saveApiConfig, 
  fetchAIQuestions, 
  fetchGoalPlan, 
} from './utils/ai';
import type { ApiConfig, Question, GoalPlan } from './utils/ai';
import { AlertCircle, RotateCcw, HelpCircle } from 'lucide-react';

function App() {
  // Config state
  const [config, setConfig] = useState<ApiConfig>(getApiConfig());
  const [settingsOpen, setSettingsOpen] = useState(false);

  // App core state
  const [appState, setAppState] = useState<'input' | 'questionnaire' | 'roadmap'>('input');
  const [goal, setGoal] = useState('');
  const [timeframe, setTimeframe] = useState('');

  // Loaded details
  const [questions, setQuestions] = useState<Question[]>([]);
  const [plan, setPlan] = useState<GoalPlan | null>(null);

  // Load/Error states
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle saving API configurations
  const handleSaveConfig = (newConfig: ApiConfig) => {
    saveApiConfig(newConfig);
    setConfig(newConfig);
  };

  // State 1 Action: Generate clarifying questions
  const handleGenerateRoadmap = async (userGoal: string, userTimeframe: string) => {
    setGoal(userGoal);
    setTimeframe(userTimeframe);
    setIsLoading(true);
    setError(null);

    try {
      const qs = await fetchAIQuestions(userGoal, userTimeframe, config);
      setQuestions(qs);
      setAppState('questionnaire');
    } catch (err: any) {
      console.error(err);
      setError(
        err.message || 
        'Failed to connect to the AI service. Please verify your internet connection or API settings.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // State 2 Action: Submit answers and generate final plan
  const handleSubmitAnswers = async (answersList: Array<{ question: string; answer: string }>) => {
    setIsLoadingPlan(true);
    setError(null);

    try {
      const generatedPlan = await fetchGoalPlan(goal, timeframe, answersList, config);
      setPlan(generatedPlan);
      setAppState('roadmap');
    } catch (err: any) {
      console.error(err);
      setError(
        err.message || 
        'Failed to generate the roadmap plan. Please verify your credentials or try again.'
      );
    } finally {
      setIsLoadingPlan(false);
    }
  };

  // State 3 Action: Reset app back to initial input
  const handleReset = () => {
    setAppState('input');
    setGoal('');
    setTimeframe('');
    setQuestions([]);
    setPlan(null);
    setError(null);
  };

  // Automatic error recovery: quick toggle back to Mock Mode if live API fails
  const handleQuickEnableMockMode = () => {
    const updated = { ...config, mockMode: true };
    handleSaveConfig(updated);
    setError(null);
  };

  return (
    <div className="flex-grow flex flex-col min-h-screen relative bg-slate-950 overflow-x-hidden selection:bg-brand-primary selection:text-white">
      
      {/* Dynamic Background pulsators */}
      <div className="no-print absolute top-[-10%] left-[-10%] h-[50vh] w-[50vw] rounded-full bg-gradient-to-tr from-brand-primary/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="no-print absolute bottom-[-10%] right-[-10%] h-[50vh] w-[50vw] rounded-full bg-gradient-to-tr from-brand-secondary/10 to-transparent blur-[120px] pointer-events-none" />

      {/* Header bar */}
      <Navbar 
        config={config} 
        onOpenSettings={() => setSettingsOpen(true)} 
        onReset={handleReset}
        showReset={appState !== 'input'}
      />

      {/* Settings Modal overlay */}
      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        config={config} 
        onSave={handleSaveConfig}
      />

      {/* Error alert banner */}
      {error && (
        <div className="no-print mx-auto max-w-2xl w-full px-4 mt-6 animate-fadeIn">
          <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 backdrop-blur-md p-4 text-sm text-slate-300 flex items-start gap-3.5 shadow-lg shadow-rose-950/10">
            <AlertCircle className="h-5.5 w-5.5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-3 flex-grow">
              <div>
                <span className="font-bold text-white block">Engine Operation Interrupted</span>
                <p className="mt-1 leading-relaxed text-slate-300">{error}</p>
              </div>
              
              <div className="flex flex-wrap gap-2.5">
                {/* Retry action */}
                <button
                  onClick={appState === 'questionnaire' ? () => setAppState('input') : handleReset}
                  className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-white rounded-lg px-3 py-1.5 text-xs font-semibold border border-white/5 transition-all"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Try Again
                </button>

                {/* Turn on mock mode toggle helper */}
                {!config.mockMode && (
                  <button
                    onClick={handleQuickEnableMockMode}
                    className="flex items-center gap-1 bg-brand-secondary/10 hover:bg-brand-secondary/20 text-brand-secondary rounded-lg px-3 py-1.5 text-xs font-bold border border-brand-secondary/20 transition-all"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    Switch to Mock Simulation (Instant)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col justify-center py-6 sm:py-12 relative z-10">
        
        {(() => {
          switch (appState) {
            case 'input':
              return (
                <InitialState 
                  onGenerate={handleGenerateRoadmap} 
                  isLoading={isLoading} 
                />
              );
            case 'questionnaire':
              return (
                <QuestionnaireState 
                  questions={questions} 
                  onSubmit={handleSubmitAnswers} 
                  isLoadingPlan={isLoadingPlan}
                />
              );
            case 'roadmap':
              return plan ? (
                <RoadmapState 
                  plan={plan} 
                  onReset={handleReset} 
                />
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-400">Roadmap was missing or failed to compile.</p>
                  <button onClick={handleReset} className="mt-4 px-4 py-2 bg-brand-primary rounded-xl text-white shadow-lg shadow-brand-primary/20">
                    Return Home
                  </button>
                </div>
              );
            default:
              return null;
          }
        })()}

      </main>

      {/* Sleek Footer */}
      <footer className="no-print border-t border-white/5 py-6 text-center text-xs text-slate-500 select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-1">
          <p>© 2026 Goal Planner AI. Licensed under standard web sandbox parameters.</p>
          <p className="text-[10px] text-slate-600">
            Powered by standard client-side state hooks. Zero database footprints.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;
