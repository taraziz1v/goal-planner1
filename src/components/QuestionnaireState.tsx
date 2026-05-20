import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Check, FileText, Loader2 } from 'lucide-react';
import type { Question } from '../utils/ai';

interface QuestionnaireStateProps {
  questions: Question[];
  onSubmit: (answers: Array<{ question: string; answer: string }>) => void;
  isLoadingPlan: boolean;
}

export const QuestionnaireState: React.FC<QuestionnaireStateProps> = ({
  questions,
  onSubmit,
  isLoadingPlan
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [customText, setCustomText] = useState<Record<string, string>>({});
  const [compilingStep, setCompilingStep] = useState(0);

  const COMPILING_STEPS = [
    'Synthesizing selected priorities...',
    'Calibrating schedule commitment multipliers...',
    'Structuring custom milestone phases...',
    'Writing high-impact task instructions...',
    'Decorating glowing roadmap widgets...'
  ];

  // Rotate log statements during plan loading
  React.useEffect(() => {
    if (isLoadingPlan) {
      setCompilingStep(0);
      const interval = setInterval(() => {
        setCompilingStep((prev) => {
          if (prev < COMPILING_STEPS.length - 1) return prev + 1;
          return prev;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoadingPlan]);

  const activeQuestion = questions[currentIdx];
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
      [activeQuestion.id]: text || '' // set to custom text (can be empty initially)
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
        answer: ans.trim() || 'No answer selected'
      };
    });
    onSubmit(payload);
  };

  const isCurrentQuestionAnswered = selectedAnswer.trim().length > 0;
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  if (isLoadingPlan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fadeIn">
        <div className="relative flex items-center justify-center h-28 w-28 rounded-full bg-slate-900 border border-white/10 shadow-2xl mb-8">
          <div className="absolute inset-0 rounded-full border border-brand-secondary/30 animate-ping opacity-75" />
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-brand-secondary/10 to-brand-primary/10 blur-xl animate-pulse" />
          <Loader2 className="h-12 w-12 text-brand-secondary animate-spin" />
        </div>
        <h3 className="text-xl font-semibold text-white tracking-wide mb-2">Compiling Roadmap</h3>
        <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
          AI is assembling your custom plan milestones and checklist...
        </p>

        {/* Action Logger */}
        <div className="w-full max-w-xs rounded-xl bg-slate-950/60 border border-white/5 p-3 text-[11px] font-mono text-left space-y-1">
          {COMPILING_STEPS.map((step, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-2 transition-all duration-300 ${
                idx === compilingStep 
                  ? 'text-brand-primary translate-x-1 font-semibold' 
                  : idx < compilingStep 
                    ? 'text-slate-500' 
                    : 'text-slate-800'
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
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeIn">
      
      {/* Quiz Progress header bar */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold select-none uppercase tracking-wider">
          <span>Questionnaire Tuning</span>
          <span>Question {currentIdx + 1} of {questions.length}</span>
        </div>
        <div className="h-2 w-full bg-slate-900 border border-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="rounded-2xl border border-white/8 bg-slate-900/30 backdrop-blur-md p-6 sm:p-8 shadow-2xl relative space-y-8">
        
        {/* Glow corner accent */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-brand-secondary/5 blur-2xl rounded-br-full pointer-events-none" />

        {/* Title */}
        <div className="space-y-2 relative">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-secondary/15 px-3 py-1 text-[11px] text-brand-secondary font-bold uppercase tracking-wider select-none">
            <Sparkles className="h-3 w-3" />
            Parameter {currentIdx + 1}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-normal leading-snug">
            {activeQuestion.text}
          </h3>
        </div>

        {/* Options Stack (3 AI Choices + 1 Custom input Choice) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Choices 1, 2, 3 */}
          {activeQuestion.choices.map((choice, oIdx) => {
            const isSelected = selectedAnswer === choice && choice !== '';
            return (
              <button
                key={oIdx}
                type="button"
                onClick={() => handleSelectOption(choice)}
                className={`text-left p-5 rounded-xl border text-sm leading-relaxed transition-all duration-300 relative group flex gap-3.5 ${
                  isSelected 
                    ? 'border-brand-primary bg-brand-primary/15 shadow-lg shadow-brand-primary/5 text-white' 
                    : 'border-white/5 bg-slate-900/20 hover:bg-slate-900/60 hover:border-white/12 text-slate-300 hover:text-white'
                }`}
              >
                {/* Selector ring */}
                <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                  isSelected 
                    ? 'bg-brand-primary border-brand-primary' 
                    : 'border-slate-600 group-hover:border-slate-400'
                }`}>
                  {isSelected && <Check className="h-3.5 w-3.5 text-white font-bold" />}
                </div>
                <span>{choice}</span>
              </button>
            );
          })}

          {/* Option 4: Custom Choice Input Box */}
          {(() => {
            // Option 4 is active if selectedAnswer doesn't match any prefilled choice AND selectedAnswer is not empty, OR if textarea has content
            const isPrefilledSelected = activeQuestion.choices.includes(selectedAnswer);
            const isCustomActive = !isPrefilledSelected && selectedAnswer !== '';
            
            return (
              <div 
                className={`text-left p-5 rounded-xl border transition-all duration-300 relative flex gap-3.5 flex-col md:col-span-2 ${
                  isCustomActive 
                    ? 'border-brand-secondary bg-brand-secondary/15 shadow-lg shadow-brand-secondary/5 text-white' 
                    : 'border-white/5 bg-slate-900/20 hover:bg-slate-900/60 hover:border-white/12 text-slate-300'
                }`}
              >
                <div className="flex gap-3.5 items-start">
                  {/* Selection Indicator Ring */}
                  <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                    isCustomActive 
                      ? 'bg-brand-secondary border-brand-secondary' 
                      : 'border-slate-600'
                  }`}>
                    {isCustomActive && <Check className="h-3.5 w-3.5 text-white font-bold" />}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 select-none flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      Option 4: Write Your Own Answer
                    </span>
                    
                    <textarea
                      value={activeCustomText}
                      onChange={(e) => handleCustomTextChange(e.target.value)}
                      placeholder="The options above don't fit? Describe your specific preference or constraint here..."
                      rows={2}
                      className="w-full py-2.5 px-3 rounded-lg glass-input text-slate-100 placeholder-slate-500 text-xs leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            );
          })()}

        </div>

        {/* Navigation bottom bar */}
        <div className="flex justify-between items-center border-t border-white/5 pt-6 select-none">
          <button
            onClick={handleBack}
            disabled={currentIdx === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 active:scale-95 disabled:opacity-0 disabled:cursor-default transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          {currentIdx === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={!isCurrentQuestionAnswered}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 shadow-xl shadow-brand-primary/10 bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all duration-200"
            >
              Submit Answers
              <Check className="h-4 w-4 text-slate-950 font-bold" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xl bg-slate-900 border border-white/5 hover:border-white/15 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 active:scale-95 transition-all duration-200"
            >
              Next Question
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
