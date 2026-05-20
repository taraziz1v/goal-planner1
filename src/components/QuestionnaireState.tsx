import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, FileText, Loader2 } from 'lucide-react';
import type { Question } from '../utils/ai';

interface QuestionnaireStateProps {
  questions: Question[];
  onSubmit: (answers: Array<{ question: string; answer: string }>) => void;
  isLoadingPlan: boolean;
  lang: 'en' | 'ar';
}

export const QuestionnaireState: React.FC<QuestionnaireStateProps> = ({
  questions,
  onSubmit,
  isLoadingPlan,
  lang
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [customText, setCustomText] = useState<Record<string, string>>({});
  const [compilingStep, setCompilingStep] = useState(0);

  const COMPILING_STEPS_EN = [
    'Synthesizing selected priorities...',
    'Calibrating schedule commitment multipliers...',
    'Structuring custom milestone phases...',
    'Writing high-impact task instructions...',
    'Decorating glowing roadmap widgets...'
  ];

  const COMPILING_STEPS_AR = [
    'جاري دمج الأولويات المحددة...',
    'ضبط مؤشرات التزام الوقت والجدول الزمنية...',
    'بناء وهيكلة مراحل الإنجاز المخصصة...',
    'كتابة تفاصيل وإرشادات المهام بدقة...',
    'تجهيز وتزيين المخطط التفاعلي الإجمالي...'
  ];

  const compilingSteps = lang === 'ar' ? COMPILING_STEPS_AR : COMPILING_STEPS_EN;

  // Rotate log statements during plan loading
  React.useEffect(() => {
    if (isLoadingPlan) {
      setCompilingStep(0);
      const interval = setInterval(() => {
        setCompilingStep((prev) => {
          if (prev < compilingSteps.length - 1) return prev + 1;
          return prev;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoadingPlan, compilingSteps.length]);

  if (questions.length === 0) {
    return (
      <div className="text-center py-10 font-bold">
        {lang === 'ar' ? 'جاري تحميل الأسئلة...' : 'Loading questions...'}
      </div>
    );
  }

  const activeQuestion = questions[currentIdx] || { id: '', text: '', choices: ['', '', ''] };
  const selectedAnswer = answers[activeQuestion.id] || '';
  const activeCustomText = customText[activeQuestion.id] || '';

  // Select Option 1, 2, or 3
  const handleSelectOption = (optionText: string) => {
    setAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: optionText
    }));
  };

  // Type in custom Option 4 input
  const handleCustomTextChange = (text: string) => {
    setCustomText(prev => ({
      ...prev,
      [activeQuestion.id]: text
    }));
    
    // Automatically select Option 4 when they start typing
    setAnswers(prev => ({
      ...prev,
      [activeQuestion.id]: text || ''
    }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Compile QA payload
    const payload = questions.map(q => {
      const ans = answers[q.id] || '';
      return {
        question: q.text,
        answer: ans.trim() || (lang === 'ar' ? 'لا توجد إجابة محددة' : 'No answer selected')
      };
    });
    onSubmit(payload);
  };

  const isCurrentQuestionAnswered = selectedAnswer.trim().length > 0;
  const stepNumber = String(currentIdx + 1).padStart(2, '0');
  const totalSteps = String(questions.length).padStart(2, '0');

  if (isLoadingPlan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh] text-center px-4 animate-fadeIn">
        <div className="relative flex items-center justify-center h-28 w-28 border-[3px] border-black bg-white hard-shadow mb-8">
          <div className="absolute -inset-4 bg-gradient-to-tr from-secondary-container/10 to-tertiary-container/10 blur-xl animate-pulse" />
          <Loader2 className="h-12 w-12 text-secondary-fixed-dim animate-spin" />
        </div>
        <h3 className="text-2xl font-display font-extrabold text-on-surface mb-2">
          {lang === 'ar' ? 'تجميع خطة العمل' : 'Compiling Roadmap'}
        </h3>
        <p className="text-sm font-medium text-on-surface-variant max-w-sm mb-6 leading-relaxed">
          {lang === 'ar'
            ? 'يقوم الذكاء الاصطناعي ببناء معالم الخطة المخصصة وقائمة المهام التفاعلية...'
            : 'AI is assembling your custom plan milestones and checklist...'}
        </p>

        {/* Action Logger */}
        <div className="w-full max-w-sm border-[3px] border-black bg-white p-4 hard-shadow font-display text-[11px] font-bold text-right space-y-1.5">
          {compilingSteps.map((step, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-2 transition-all duration-300 ${lang === 'ar' ? 'justify-start flex-row-reverse' : 'justify-start'} ${
                idx === compilingStep 
                  ? 'text-tertiary-container font-extrabold scale-[1.02]' 
                  : idx < compilingStep 
                    ? 'text-primary/60' 
                    : 'text-outline/40'
              }`}
            >
              <span>{idx < compilingStep ? '✓' : idx === compilingStep ? '➜' : '◦'}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 animate-fadeIn">
      
      {/* Quiz Progress header bar */}
      <section className="w-full max-w-2xl mx-auto bg-white border-[3px] border-black hard-shadow p-6 sm:p-8 flex flex-col gap-6 transition-all">
        
        {/* Step Header */}
        <div className={`flex items-center justify-between border-b-[3px] border-black/10 pb-4 ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
          <span className="bg-tertiary-container/10 text-tertiary-container px-3.5 py-1 text-xs font-display font-extrabold tracking-wider border-2 border-tertiary-container">
            {lang === 'ar' ? `خطوة ${stepNumber}/${totalSteps}` : `Step ${stepNumber}/${totalSteps}`}
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-extrabold m-0 text-on-surface">
            {lang === 'ar' ? 'تحليل المسار وتخصيص الخطة' : 'Path Analysis & Tuning'}
          </h2>
        </div>

        {/* Question Text */}
        <div className="min-h-[120px] flex flex-col justify-center">
          <p className="font-headline text-lg sm:text-xl font-bold text-on-surface leading-relaxed text-right mb-6">
            {activeQuestion.text}
          </p>

          {/* Options Stack (3 choices) */}
          <div className="grid grid-cols-1 gap-4">
            {activeQuestion.choices.map((choice, oIdx) => {
              if (!choice) return null;
              const isSelected = selectedAnswer === choice;
              
              return (
                <button
                  key={oIdx}
                  type="button"
                  onClick={() => handleSelectOption(choice)}
                  className={`question-option flex items-center justify-between px-6 py-4 border-2 border-black transition-all text-right group active:scale-[0.98] cursor-pointer ${
                    isSelected 
                      ? 'bg-surface-container-low border-tertiary-container active-glow' 
                      : 'bg-white hover:bg-tertiary-container/5 hover:border-tertiary-container'
                  } ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <span className={`font-display text-sm font-bold ${isSelected ? 'text-tertiary-container font-extrabold' : 'text-on-surface'}`}>
                    {choice}
                  </span>
                  
                  {/* Custom Checkbox */}
                  <div className={`w-6 h-6 border-2 shrink-0 flex items-center justify-center transition-colors ${
                    isSelected 
                      ? 'border-tertiary-container bg-tertiary-container' 
                      : 'border-black group-hover:bg-tertiary-container/15'
                  }`}>
                    {isSelected && <Check className="h-4 w-4 text-white font-bold stroke-[3px]" />}
                  </div>
                </button>
              );
            })}

            {/* Option 4: Custom Choice Input Box */}
            {(() => {
              const isPrefilledSelected = activeQuestion.choices.includes(selectedAnswer);
              const isCustomActive = !isPrefilledSelected && selectedAnswer !== '';
              
              return (
                <div 
                  className={`flex flex-col gap-3 p-5 border-2 border-black bg-white transition-all ${
                    isCustomActive ? 'border-secondary-container bg-surface-container-low active-glow' : ''
                  }`}
                >
                  <div className={`flex gap-3 items-start ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                    
                    {/* Custom Checkbox */}
                    <div className={`w-6 h-6 border-2 shrink-0 flex items-center justify-center mt-1 transition-colors ${
                      isCustomActive 
                        ? 'border-secondary-container bg-secondary-container' 
                        : 'border-black'
                    }`}>
                      {isCustomActive && <Check className="h-4 w-4 text-black font-bold stroke-[3px]" />}
                    </div>

                    <div className="flex-1 space-y-2 text-right">
                      <span className={`text-xs font-display font-extrabold uppercase tracking-wider text-outline flex items-center gap-1.5 ${lang === 'ar' ? 'justify-start flex-row-reverse' : 'justify-start'}`}>
                        <FileText className="h-4 w-4 text-outline" />
                        {lang === 'ar' ? 'الخيار الرابع: اكتب تفضيلاتك الخاصة' : 'Option 4: Write Your Own Answer'}
                      </span>
                      
                      <textarea
                        value={activeCustomText}
                        onChange={(e) => handleCustomTextChange(e.target.value)}
                        placeholder={lang === 'ar' ? 'هل الخيارات أعلاه لا تناسبك؟ اكتب تفضيلك أو قيدك الزمني المحدد هنا...' : "The options above don't fit? Describe your specific preference or constraint here..."}
                        rows={2}
                        className={`w-full py-2.5 px-3 bg-white border-2 border-black focus:outline-none focus:border-tertiary-container text-xs font-bold leading-relaxed text-on-surface ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Navigation bottom bar */}
        <div className={`flex justify-between items-center border-t-[3px] border-black/10 pt-6 select-none ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <button
            onClick={handleBack}
            disabled={currentIdx === 0}
            className="flex items-center gap-1.5 px-5 py-2.5 border-2 border-black bg-white text-xs font-display font-extrabold hard-shadow hover:bg-surface-container-low transition-all active:scale-95 disabled:opacity-0 disabled:cursor-default cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 font-bold" />
            {lang === 'ar' ? 'السابق' : 'Back'}
          </button>

          {currentIdx === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!isCurrentQuestionAnswered}
              className="flex items-center gap-1.5 px-6 py-3 border-[3px] border-black bg-secondary-container text-black text-sm font-display font-extrabold hard-shadow hover:hard-shadow-hover transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_#000000] cursor-pointer"
            >
              <span>{lang === 'ar' ? 'تأكيد وصياغة الخطة' : 'Submit Answers'}</span>
              <Check className="h-4 w-4 font-bold stroke-[3px]" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered}
              className="flex items-center gap-1.5 px-5 py-2.5 border-2 border-black bg-white text-xs font-display font-extrabold hard-shadow hover:bg-surface-container-low transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_#000000] cursor-pointer"
            >
              <span>{lang === 'ar' ? 'السؤال التالي' : 'Next Question'}</span>
              <ChevronRight className="h-4 w-4 font-bold" />
            </button>
          )}
        </div>

      </section>
    </div>
  );
};
