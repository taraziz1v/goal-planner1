import React, { useState } from 'react';
import { Target, Calendar, ArrowRight, Loader2, Sparkles, Rocket } from 'lucide-react';

interface InitialStateProps {
  onGenerate: (goal: string, timeframe: string) => void;
  isLoading: boolean;
  lang: 'en' | 'ar';
}

const PRESETS_EN = [
  { goal: 'Run a 10K marathon and build core cardio stamina', timeframe: '60 days', label: '🏃 Fit / 10K Run' },
  { goal: 'Build a production-ready SaaS landing page with React & TS', timeframe: '30 days', label: '💻 Code / React App' },
  { goal: 'Launch a dropshipping shop and run standard social ads', timeframe: '3 months', label: '💰 Business / Shop' },
  { goal: 'Learn fluent conversational French vocabulary & basic speech', timeframe: '6 months', label: '🗣️ Language / French' },
];

const PRESETS_AR = [
  { goal: 'ركض ماراثون 10 كم وبناء اللياقة البدنية والتحمل العضلي', timeframe: '60 يوم', label: '🏃 رياضة / ركض 10 كم' },
  { goal: 'بناء صفحة هبوط جاهزة للإنتاج لمشروع SaaS باستخدام React و TS', timeframe: '30 يوم', label: '💻 برمجة / تطبيق React' },
  { goal: 'إطلاق متجر دروبشيبينغ وإعداد حملات إعلانية متكاملة على شبكات التواصل', timeframe: '3 أشهر', label: '💰 تجارة / متجر إلكتروني' },
  { goal: 'تعلم المحادثة باللغة الفرنسية وبناء المفردات الأساسية والنطق السليم', timeframe: '6 أشهر', label: '🗣️ لغات / الفرنسية' },
];

export const InitialState: React.FC<InitialStateProps> = ({ onGenerate, isLoading, lang }) => {
  const [goal, setGoal] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);

  const presets = lang === 'ar' ? PRESETS_AR : PRESETS_EN;

  const LOADING_STEPS_EN = [
    'Initializing AI Planner Engine...',
    'Analyzing target constraints & timelines...',
    'Structuring cognitive question templates...',
    'Injecting schedule preferences...',
    'Compiling interactive questionnaire wizard...'
  ];

  const LOADING_STEPS_AR = [
    'جاري تشغيل محرك التخطيط الذكي...',
    'تحليل القيود الزمنية والأهداف المطلوبة...',
    'بناء وتنسيق هيكل الأسئلة المخصصة...',
    'حقن تفضيلات الجدولة الزمنية للعمل...',
    'تجميع معالج الاستبيان التفاعلي...'
  ];

  const loadingSteps = lang === 'ar' ? LOADING_STEPS_AR : LOADING_STEPS_EN;

  // Rotate loading steps if loading
  React.useEffect(() => {
    if (isLoading) {
      setLoadingStep(0);
      const interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < loadingSteps.length - 1) return prev + 1;
          return prev;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [isLoading, loadingSteps.length]);

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
      <div className="flex flex-col items-center justify-center min-h-[55vh] text-center px-4 animate-fadeIn">
        <div className="relative flex items-center justify-center h-28 w-28 border-[3px] border-black bg-white hard-shadow mb-8">
          {/* Animated Glow Rings */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-tertiary-container/10 to-secondary-container/10 blur-xl animate-pulse" />
          <Loader2 className="h-12 w-12 text-tertiary-container animate-spin" />
        </div>
        <h3 className="text-2xl font-display font-extrabold text-on-surface mb-2">
          {lang === 'ar' ? 'جاري توليد الأسئلة' : 'Generating Questions'}
        </h3>
        <p className="text-sm font-medium text-on-surface-variant max-w-sm mb-6 leading-relaxed">
          {lang === 'ar' 
            ? 'يقوم الذكاء الاصطناعي بتحليل مدخلاتك لإنشاء أسئلة ضبط مخصصة...' 
            : 'AI is analyzing your parameters to create custom refining questions...'}
        </p>
        
        {/* Loading logs ticker */}
        <div className="w-full max-w-sm border-[3px] border-black bg-white p-4 hard-shadow font-display text-[11px] font-bold text-right space-y-1.5">
          {loadingSteps.map((step, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-2 transition-all duration-300 ${lang === 'ar' ? 'justify-start flex-row-reverse' : 'justify-start'} ${
                idx === loadingStep 
                  ? 'text-tertiary-container font-extrabold scale-[1.02]' 
                  : idx < loadingStep 
                    ? 'text-primary/60' 
                    : 'text-outline/40'
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
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 animate-fadeIn">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 mb-10 select-none">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 border-2 border-black bg-white text-xs font-display font-bold hard-shadow">
          <Sparkles className="h-4.5 w-4.5 text-secondary-fixed-dim" />
          {lang === 'ar' ? 'جزّئ أي هدف أو معلم فوراً' : 'Break down any milestone instantly'}
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-on-surface leading-tight m-0">
          {lang === 'ar' ? 'ضاعف قوة طموحاتك اليوم' : 'Supercharge Your Ambitions'}
        </h2>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-medium">
          {lang === 'ar'
            ? 'افتح خطط عمل معرفية منظمة خطوة بخطوة مصممة خصيصاً لسرعتك، وجدولك، وخبرتك الحالية.'
            : 'Unlock structured, step-by-step cognitive roadmaps tailored specifically to your speed, schedules, and experience. Built entirely in browser state.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Presets Columns */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-display font-extrabold text-outline uppercase tracking-wider mb-2 flex items-center gap-1.5 select-none justify-start">
            <Sparkles className="h-4.5 w-4.5 text-secondary-fixed-dim" />
            {lang === 'ar' ? 'الخطط الجاهزة المقترحة' : 'Popular Presets'}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset.goal, preset.timeframe)}
                className="w-full text-right p-4 border-2 border-black bg-white hard-shadow hover:hard-shadow-hover transition-all group active:scale-[0.99] flex flex-col gap-1 cursor-pointer"
              >
                <span className="text-xs font-display font-extrabold text-tertiary-container group-hover:underline transition-colors">
                  {preset.label}
                </span>
                <span className="text-xs text-on-surface-variant font-semibold line-clamp-1 leading-normal">
                  "{preset.goal}"
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Form Column */}
        <div className="lg:col-span-3">
          <div className="bg-white border-[3px] border-black p-6 sm:p-8 hard-shadow relative">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Field 1: The Goal */}
              <div className="space-y-2">
                <label className="text-sm font-display font-extrabold text-on-surface flex items-center gap-2 select-none justify-start" htmlFor="goal-input">
                  <Target className="h-4.5 w-4.5 text-tertiary-container" />
                  {lang === 'ar' ? 'ما هو هدفك القادم؟' : 'What is your goal?'}
                </label>
                <div className="relative group">
                  <textarea
                    id="goal-input"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثلاً: تعلم تطوير تطبيقات الويب وبناء منتجات حقيقية...' : 'e.g. Learn Python coding basics and build a web scraper...'}
                    required
                    rows={3}
                    className={`w-full py-4 px-4 bg-white border-[3px] border-black hard-shadow focus:outline-none focus:ring-0 focus:border-tertiary-container transition-all text-base sm:text-lg font-bold leading-relaxed text-on-surface ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                  />
                  <div className={`absolute bottom-3 flex items-center pointer-events-none text-outline/40 ${lang === 'ar' ? 'left-3' : 'right-3'}`}>
                    <Rocket className="h-5.5 w-5.5 text-outline-variant" />
                  </div>
                </div>
              </div>

              {/* Field 2: Timeframe */}
              <div className="space-y-2">
                <label className="text-sm font-display font-extrabold text-on-surface flex items-center gap-2 select-none justify-start" htmlFor="timeframe-input">
                  <Calendar className="h-4.5 w-4.5 text-secondary-fixed-dim" />
                  {lang === 'ar' ? 'ما هو الإطار الزمني المقترح؟' : 'What is the timeframe?'}
                </label>
                <input
                  id="timeframe-input"
                  type="text"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثلاً: 30 يوم، 3 أشهر، 6 أسابيع' : 'e.g. 30 days, 3 months, 6 weeks'}
                  required
                  className={`w-full py-2.5 px-4 bg-white border-2 border-black hard-shadow focus:outline-none focus:ring-0 focus:border-tertiary-container transition-all text-sm font-bold text-on-surface ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                />
                
                {/* Short timechips under field */}
                <div className={`flex flex-wrap gap-2 pt-1.5 ${lang === 'ar' ? 'justify-start flex-row-reverse' : 'justify-start'}`}>
                  {(lang === 'ar' ? ['30 يوم', '60 يوم', '3 أشهر', '6 أشهر'] : ['30 days', '60 days', '3 months', '6 months']).map((tChip) => (
                    <button
                      key={tChip}
                      type="button"
                      onClick={() => setTimeframe(tChip)}
                      className="text-[11px] font-display font-extrabold text-on-surface-variant bg-white hover:bg-surface-container-low border-2 border-black hard-shadow px-3 py-1 cursor-pointer transition-all active:scale-95"
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
                className="w-full flex items-center justify-center gap-2 py-4 px-6 border-[3px] border-black bg-secondary-container text-black font-display text-lg font-extrabold hard-shadow hard-shadow-hover transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_#000000] active:scale-[0.98]"
              >
                <span>{lang === 'ar' ? 'تأكيد وتوليد المخطط' : 'Generate Roadmap'}</span>
                <ArrowRight className={`h-5 w-5 font-bold ${lang === 'ar' ? 'rtl-flip' : 'translate-x-0'}`} />
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
