import { useState, useEffect } from 'react';
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

  // Language state - defaults to 'ar' (Arabic Focused Interface) with fallback to local storage
  const [lang, setLang] = useState<'en' | 'ar'>(() => {
    const saved = localStorage.getItem('goal_planner_lang');
    return (saved === 'en' || saved === 'ar') ? saved : 'ar';
  });

  // Persist language preference
  useEffect(() => {
    localStorage.setItem('goal_planner_lang', lang);
    // Apply styling on HTML tag to ensure consistent fonts and directions
    const htmlEl = document.documentElement;
    if (lang === 'ar') {
      htmlEl.setAttribute('dir', 'rtl');
      htmlEl.setAttribute('lang', 'ar');
      htmlEl.className = 'light';
    } else {
      htmlEl.setAttribute('dir', 'ltr');
      htmlEl.setAttribute('lang', 'en');
      htmlEl.className = 'light';
    }
  }, [lang]);

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
      const qs = await fetchAIQuestions(userGoal, userTimeframe, config, lang);
      setQuestions(qs);
      setAppState('questionnaire');
    } catch (err: any) {
      console.error(err);
      setError(
        lang === 'ar'
          ? (err.message || 'فشل الاتصال بخدمة الذكاء الاصطناعي. يرجى التحقق من اتصال الإنترنت أو إعدادات المفتاح.')
          : (err.message || 'Failed to connect to the AI service. Please verify your internet connection or API settings.')
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
      const generatedPlan = await fetchGoalPlan(goal, timeframe, answersList, config, lang);
      setPlan(generatedPlan);
      setAppState('roadmap');
    } catch (err: any) {
      console.error(err);
      setError(
        lang === 'ar'
          ? (err.message || 'فشل توليد خطة العمل. يرجى التحقق من إعدادات المفتاح أو المحاولة مجدداً.')
          : (err.message || 'Failed to generate the roadmap plan. Please verify your credentials or try again.')
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
    <div className="flex-grow flex flex-col min-h-screen relative bg-background text-on-surface select-none">
      
      {/* Decorative Neo-brutalist Background Canvas Rings */}
      <div className="no-print absolute top-[-5%] left-[-5%] h-[40vh] w-[40vw] rounded-full bg-gradient-to-tr from-tertiary-container/5 to-transparent blur-[100px] pointer-events-none" />
      <div className="no-print absolute bottom-[-5%] right-[-5%] h-[40vh] w-[40vw] rounded-full bg-gradient-to-tr from-secondary-container/5 to-transparent blur-[100px] pointer-events-none" />

      {/* Header bar */}
      <Navbar 
        config={config} 
        lang={lang}
        setLang={setLang}
        onOpenSettings={() => setSettingsOpen(true)} 
        onReset={handleReset}
        showReset={appState !== 'input'}
      />

      {/* Settings Modal overlay */}
      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        config={config} 
        lang={lang}
        onSave={handleSaveConfig}
      />

      {/* Error alert banner */}
      {error && (
        <div className="no-print mx-auto max-w-2xl w-full px-4 mt-6 animate-fadeIn">
          <div className="bg-white border-[3px] border-black hard-shadow p-5 flex items-start gap-4 transition-all">
            <div className="bg-error/10 p-2 border-2 border-error text-error shrink-0">
              <AlertCircle className="h-6 w-6 text-error" />
            </div>
            <div className="space-y-4 flex-grow text-right">
              <div>
                <span className="font-display text-lg font-bold text-error block">
                  {lang === 'ar' ? 'حدث خطأ أثناء الاتصال' : 'Engine Operation Interrupted'}
                </span>
                <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant font-medium">{error}</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {/* Retry action */}
                <button
                  onClick={appState === 'questionnaire' ? () => setAppState('input') : handleReset}
                  className="flex items-center gap-1.5 px-4 py-2 border-2 border-black font-display text-xs font-bold bg-white hard-shadow hover:bg-surface-container-low transition-all active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  {lang === 'ar' ? 'حاول مجدداً' : 'Try Again'}
                </button>

                {/* Turn on mock mode toggle helper */}
                {!config.mockMode && (
                  <button
                    onClick={handleQuickEnableMockMode}
                    className="flex items-center gap-1.5 px-4 py-2 border-2 border-black font-display text-xs font-bold bg-secondary-container hard-shadow hover:hard-shadow-hover transition-all active:scale-95 cursor-pointer"
                  >
                    <HelpCircle className="h-4 w-4" />
                    {lang === 'ar' ? 'تفعيل محاكاة الذكاء الاصطناعي (فوري)' : 'Switch to Mock Simulation (Instant)'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col justify-center py-6 sm:py-10 relative z-10">
        
        {(() => {
          switch (appState) {
            case 'input':
              return (
                <InitialState 
                  onGenerate={handleGenerateRoadmap} 
                  isLoading={isLoading} 
                  lang={lang}
                />
              );
            case 'questionnaire':
              return (
                <QuestionnaireState 
                  questions={questions} 
                  onSubmit={handleSubmitAnswers} 
                  isLoadingPlan={isLoadingPlan}
                  lang={lang}
                />
              );
            case 'roadmap':
              return plan ? (
                <RoadmapState 
                  plan={plan} 
                  onReset={handleReset} 
                  lang={lang}
                />
              ) : (
                <div className="text-center py-12 px-4 max-w-md mx-auto bg-white border-[3px] border-black hard-shadow">
                  <p className="text-on-surface-variant font-medium">
                    {lang === 'ar' 
                      ? 'مخطط العمل مفقود أو فشل تجميعه.' 
                      : 'Roadmap was missing or failed to compile.'}
                  </p>
                  <button 
                    onClick={handleReset} 
                    className="mt-6 px-6 py-3 bg-secondary-container border-2 border-black font-display text-sm font-bold hard-shadow hover:hard-shadow-hover transition-all cursor-pointer"
                  >
                    {lang === 'ar' ? 'العودة للرئيسية' : 'Return Home'}
                  </button>
                </div>
              );
            default:
              return null;
          }
        })()}

      </main>

      {/* Sleek Footer */}
      <footer className="no-print border-t border-black/10 py-6 text-center text-xs text-on-surface-variant select-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-1.5">
          <p className="font-medium">
            {lang === 'ar' 
              ? '© 2026 مخطط الأهداف الذكي. مرخص بموجب معايير حماية الويب القياسية.' 
              : '© 2026 Goal Planner AI. Licensed under standard web sandbox parameters.'}
          </p>
          <p className="text-[10px] text-outline font-semibold">
            {lang === 'ar' 
              ? 'يعمل بواسطة خطافات الحالة المحلية في المتصفح بالكامل. صفر قواعد بيانات.' 
              : 'Powered by standard client-side state hooks. Zero database footprints.'}
          </p>
        </div>
      </footer>

    </div>
  );
}

export default App;
