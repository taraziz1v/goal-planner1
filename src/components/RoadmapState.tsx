import React, { useState } from 'react';
import { Download, Printer, RotateCcw, CheckCircle, Award, Calendar, Sparkles } from 'lucide-react';
import type { GoalPlan, Task } from '../utils/ai';
import confetti from 'canvas-confetti';

interface RoadmapStateProps {
  plan: GoalPlan;
  onReset: () => void;
  lang: 'en' | 'ar';
}

export const RoadmapState: React.FC<RoadmapStateProps> = ({ plan, onReset, lang }) => {
  // Store task completion in local React state
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  // Calculate counts
  const allTasks: Task[] = plan.milestones.flatMap(m => m.tasks);
  const totalTasksCount = allTasks.length;
  const completedTasksCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Toggle completion status
  const handleToggleTask = (taskId: string) => {
    setCompletedTasks(prev => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      const nextCompletedCount = Object.values(next).filter(Boolean).length;
      if (nextCompletedCount === totalTasksCount && totalTasksCount > 0) {
        triggerConfettiCelebration();
      }
      return next;
    });
  };

  // Spectacular Confetti blast
  const triggerConfettiCelebration = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#fdc000', '#0873df', '#ffffff', '#000000']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#fdc000', '#0873df', '#ffffff', '#000000']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  // Export Plan as Markdown file
  const handleDownloadMarkdown = () => {
    let md = `# ${plan.title}\n\n`;
    md += `**${lang === 'ar' ? 'الإطار الزمني' : 'Timeframe'}:** ${plan.timeframe}\n`;
    md += `**${lang === 'ar' ? 'ملخص الخطة' : 'Summary'}:** ${plan.summary.replace(/<[^>]*>/g, '')}\n\n`;
    md += `## ${lang === 'ar' ? 'المراحل المخصصة وقائمة المهام' : 'Customized Milestones & Checklist'}\n\n`;

    plan.milestones.forEach(m => {
      md += `### ${m.title} (${m.duration})\n\n`;
      m.tasks.forEach(t => {
        const isDone = completedTasks[t.id] ? '[x]' : '[ ]';
        md += `- ${isDone} **${t.text}** — ${t.description}\n`;
      });
      md += `\n`;
    });

    md += `*${lang === 'ar' ? 'تم التوليد بواسطة مخطط الأهداف الذكي.' : 'Generated via AI Goal Planner.'}*\n`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${plan.title.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, '_')}_roadmap.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print roadmap (styled via index.css overrides)
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fadeIn print-container">
      
      {/* Overview Dashboard Card */}
      <div className="bg-white border-[3px] border-black p-6 sm:p-8 hard-shadow relative space-y-6 mb-8 print-card">
        
        <div className={`flex flex-col md:flex-row md:items-start justify-between gap-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="space-y-3.5 flex-1">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-display font-extrabold text-black border-2 border-black bg-white hard-shadow select-none ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
              <Calendar className="h-4 w-4" />
              <span>{lang === 'ar' ? `الإطار الزمني: ${plan.timeframe}` : `Timeframe: ${plan.timeframe}`}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-on-surface leading-tight m-0 print-text-dark">
              {plan.title}
            </h2>
            <p className="text-sm text-on-surface-variant font-medium leading-relaxed m-0 print-text-light" 
               dangerouslySetInnerHTML={{ __html: plan.summary }} 
            />
          </div>

          {/* Progress Circular/Badge Ring (Neo-brutalist customized) */}
          <div className={`flex items-center gap-4 border-[3px] border-black bg-surface-container-low p-4 shrink-0 hard-shadow print-card ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="relative h-16 w-16 shrink-0 flex items-center justify-center border-2 border-black bg-white">
              <span className="text-sm font-display font-extrabold text-on-surface select-none">{progressPercent}%</span>
            </div>
            <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
              <span className="text-[10px] font-display font-extrabold text-outline uppercase tracking-wider block leading-none">
                {lang === 'ar' ? 'مؤشر الإنجاز' : 'Task Meter'}
              </span>
              <span className="text-sm font-display font-extrabold text-on-surface block mt-1.5 print-text-dark">
                {lang === 'ar'
                  ? `${completedTasksCount} من أصل ${totalTasksCount} مكتمل`
                  : `${completedTasksCount} / ${totalTasksCount} Completed`}
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Export Buttons */}
        <div className={`no-print flex flex-wrap gap-3 border-t-2 border-black/10 pt-5 ${lang === 'ar' ? 'justify-start flex-row-reverse' : 'justify-start'}`}>
          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 bg-white border-2 border-black px-4 py-2 text-xs font-display font-extrabold hard-shadow hover:bg-surface-container-low transition-all active:scale-95 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            {lang === 'ar' ? 'تحميل كملف Markdown' : 'Download Markdown'}
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-white border-2 border-black px-4 py-2 text-xs font-display font-extrabold hard-shadow hover:bg-surface-container-low transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            {lang === 'ar' ? 'طباعة / حفظ بصيغة PDF' : 'Print / Save PDF'}
          </button>

          <button
            onClick={onReset}
            className={`flex items-center gap-1.5 bg-secondary-container border-2 border-black px-4 py-2 text-xs font-display font-extrabold hard-shadow hover:hard-shadow-hover transition-all active:scale-95 cursor-pointer ${lang === 'ar' ? 'mr-auto' : 'ml-auto'}`}
          >
            <RotateCcw className="h-4 w-4" />
            {lang === 'ar' ? 'تخطيط هدف جديد' : 'New Goal'}
          </button>
        </div>
      </div>

      {/* Interactive vertical timeline */}
      <div className={`relative space-y-10 py-2 ${
        lang === 'ar' 
          ? 'border-r-[3px] border-black pr-6 sm:pr-8 pl-0 mr-2 sm:mr-3' 
          : 'border-l-[3px] border-black pl-6 sm:pl-8 pr-0 ml-2 sm:ml-3'
      }`}>
        {plan.milestones.map((milestone) => (
          <div key={milestone.id} className="relative space-y-4 print-card">
            
            {/* Timeline Marker Dot */}
            <div className={`no-print absolute top-1.5 flex h-5 w-5 items-center justify-center border-2 border-black bg-white hard-shadow ${
              lang === 'ar' ? '-right-[38px] sm:-right-[46px]' : '-left-[38px] sm:-left-[46px]'
            }`}>
              <div className="h-2 w-2 bg-tertiary-container animate-pulse" />
            </div>

            {/* Milestone Header */}
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${lang === 'ar' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
              <h3 className="text-lg sm:text-xl font-display font-extrabold text-on-surface m-0 flex items-center gap-2 print-text-dark">
                <Sparkles className="h-5 w-5 text-secondary-fixed-dim no-print shrink-0" />
                <span>{milestone.title}</span>
              </h3>
              <span className="inline-flex items-center px-3 py-1 text-xs font-display font-extrabold text-black border-2 border-black bg-white hard-shadow shrink-0 self-start sm:self-center print-card print-text-dark">
                {milestone.duration}
              </span>
            </div>

            {/* Tasks checklist */}
            <div className="grid grid-cols-1 gap-4">
              {milestone.tasks.map((task) => {
                const isChecked = !!completedTasks[task.id];
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => handleToggleTask(task.id)}
                    className={`w-full text-right p-4 border-2 border-black transition-all duration-300 relative flex items-start gap-4 group cursor-pointer ${
                      isChecked 
                        ? 'bg-surface-container-low/50 border-black/35 shadow-inner' 
                        : 'bg-white hard-shadow hover:hard-shadow-hover'
                    } print-card ${lang === 'ar' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}
                  >
                    {/* Checkbox Icon */}
                    <div className="shrink-0 mt-0.5 transition-transform duration-200 active:scale-75 select-none">
                      {isChecked ? (
                        <div className="h-6 w-6 border-2 border-tertiary-container bg-tertiary-container flex items-center justify-center">
                          <CheckCircle className="h-4.5 w-4.5 text-white stroke-[3px]" />
                        </div>
                      ) : (
                        <div className="h-6 w-6 border-2 border-black bg-white group-hover:bg-surface-container-low transition-colors" />
                      )}
                    </div>

                    {/* Text layout */}
                    <div className="flex-1 space-y-1 select-none">
                      <span className={`text-sm sm:text-base font-display font-extrabold block transition-all duration-300 ${
                        isChecked 
                          ? 'text-outline/60 line-through print-text-light' 
                          : 'text-on-surface group-hover:text-black print-text-dark'
                      }`}>
                        {task.text}
                      </span>
                      <p className={`text-xs sm:text-sm leading-relaxed transition-all duration-300 m-0 ${
                        isChecked 
                          ? 'text-outline/50 print-text-light' 
                          : 'text-on-surface-variant font-medium group-hover:text-on-surface print-text-light'
                      }`}>
                        {task.description}
                      </p>
                    </div>

                  </button>
                );
              })}
            </div>

          </div>
        ))}
      </div>

      {/* Completion Trophy Card */}
      {progressPercent === 100 && (
        <div className={`mt-12 p-6 border-[3px] border-black bg-secondary-container text-black hard-shadow flex flex-col sm:flex-row items-center gap-5 animate-[fadeIn_0.5s_ease-out] print-card ${
          lang === 'ar' ? 'text-right sm:flex-row-reverse' : 'text-left sm:flex-row'
        }`}>
          <div className="h-14 w-14 shrink-0 border-2 border-black bg-white flex items-center justify-center text-black shadow-[2px_2px_0px_0px_#000000]">
            <Award className="h-8 w-8 text-black" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-display font-extrabold m-0 print-text-dark">
              {lang === 'ar' ? 'تم إكمال خطة العمل بنجاح!' : 'Roadmap Completed!'}
            </h4>
            <p className="text-sm font-medium leading-relaxed m-0 print-text-light">
              {lang === 'ar'
                ? 'مجهود استثنائي! لقد قمت بإنهاء كافة المهام بنجاح في هذا المخطط. استمر على هذا الأداء العالي!'
                : 'Spectacular effort. You have crossed off every checkpoint on this planner. Keep training!'}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
