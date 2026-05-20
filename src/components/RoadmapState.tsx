import React, { useState } from 'react';
import { Download, Printer, RotateCcw, CheckCircle, Circle, Award, Calendar, Sparkles } from 'lucide-react';
import type { GoalPlan, Task } from '../utils/ai';
import confetti from 'canvas-confetti';

interface RoadmapStateProps {
  plan: GoalPlan;
  onReset: () => void;
}

export const RoadmapState: React.FC<RoadmapStateProps> = ({ plan, onReset }) => {
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
      
      // Trigger full confetti if this action makes completed === total count
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
        colors: ['#ff2d78', '#00ffcc', '#ffffff']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff2d78', '#00ffcc', '#ffffff']
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
    md += `**Timeframe:** ${plan.timeframe}\n`;
    md += `**Summary:** ${plan.summary}\n\n`;
    md += `## Customized Milestones & Checklist\n\n`;

    plan.milestones.forEach(m => {
      md += `### ${m.title} (${m.duration})\n\n`;
      m.tasks.forEach(t => {
        const isDone = completedTasks[t.id] ? '[x]' : '[ ]';
        md += `- ${isDone} **${t.text}** — ${t.description}\n`;
      });
      md += `\n`;
    });

    md += `*Generated via AI Goal Planner.*\n`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${plan.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_roadmap.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print roadmap (styled via index.css overrides)
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn print-container">
      
      {/* Decorative Blob */}
      <div className="absolute top-40 right-10 -z-10 h-64 w-64 rounded-full bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 blur-3xl opacity-50 pointer-events-none" />

      {/* Overview Dashboard Card */}
      <div className="rounded-2xl border border-white/8 bg-slate-900/30 backdrop-blur-md p-6 sm:p-8 shadow-2xl relative space-y-6 mb-8 print-card">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 blur-2xl rounded-bl-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2.5 flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs text-brand-primary font-bold select-none border border-brand-primary/15">
              <Calendar className="h-3.5 w-3.5" />
              Timeframe: {plan.timeframe}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug m-0 print-text-dark">
              {plan.title}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed m-0 print-text-light" 
               dangerouslySetInnerHTML={{ __html: plan.summary }} 
            />
          </div>

          {/* Progress Circular/Badge Ring */}
          <div className="flex items-center gap-4 bg-slate-950/40 border border-white/5 rounded-2xl p-4 shrink-0 shadow-inner print-card">
            <div className="relative h-16 w-16 shrink-0 flex items-center justify-center">
              {/* Ring Background */}
              <svg className="absolute transform -rotate-95 h-full w-full">
                <circle cx="32" cy="32" r="28" className="stroke-slate-800" strokeWidth="4" fill="transparent" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  className="stroke-brand-primary transition-all duration-500" 
                  strokeWidth="4" 
                  fill="transparent" 
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - progressPercent / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-sm font-extrabold text-white select-none">{progressPercent}%</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Task Meter</span>
              <span className="text-sm font-bold text-white block mt-1.5 print-text-dark">
                {completedTasksCount} / {totalTasksCount} Completed
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Export Buttons */}
        <div className="no-print flex flex-wrap gap-3 border-t border-white/5 pt-5">
          <button
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/12 text-slate-300 hover:text-white rounded-xl px-4 py-2 text-xs font-semibold transition-all active:scale-95 duration-200"
          >
            <Download className="h-4 w-4" />
            Download Markdown
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/12 text-slate-300 hover:text-white rounded-xl px-4 py-2 text-xs font-semibold transition-all active:scale-95 duration-200"
          >
            <Printer className="h-4 w-4" />
            Print / Save PDF
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 ml-auto bg-slate-900 border border-white/5 hover:border-white/10 text-slate-400 hover:text-white rounded-xl px-4 py-2 text-xs font-semibold transition-all active:scale-95 duration-200"
          >
            <RotateCcw className="h-4 w-4" />
            New Goal
          </button>
        </div>
      </div>

      {/* Interactive vertical timeline */}
      <div className="relative pl-6 sm:pl-8 border-l border-slate-800 space-y-10 py-2">
        {plan.milestones.map((milestone) => (
          <div key={milestone.id} className="relative space-y-4 print-card">
            
            {/* Timeline Marker Dot */}
            <div className="no-print absolute -left-[31px] sm:-left-[39px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950 border-2 border-brand-primary shadow-md shadow-brand-primary/20">
              <div className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
            </div>

            {/* Milestone Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <h3 className="text-lg font-bold text-white tracking-tight m-0 flex items-center gap-2 print-text-dark">
                <Sparkles className="h-4 w-4 text-brand-secondary no-print" />
                {milestone.title}
              </h3>
              <span className="inline-flex items-center rounded-lg bg-brand-secondary/10 px-2.5 py-1 text-xs font-bold text-brand-secondary border border-brand-secondary/15 shrink-0 self-start sm:self-center print-card print-text-dark">
                {milestone.duration}
              </span>
            </div>

            {/* Tasks checklist */}
            <div className="grid grid-cols-1 gap-3.5">
              {milestone.tasks.map((task) => {
                const isChecked = !!completedTasks[task.id];
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => handleToggleTask(task.id)}
                    className={`w-full text-left p-4.5 rounded-xl border transition-all duration-300 relative flex items-start gap-4 group cursor-pointer ${
                      isChecked 
                        ? 'border-brand-primary/30 bg-brand-primary/10 shadow-inner' 
                        : 'border-white/5 bg-slate-900/15 hover:bg-slate-900/50 hover:border-white/10'
                    } print-card`}
                  >
                    {/* Left Custom Checkbox Button Icon */}
                    <div className="shrink-0 mt-0.5 transition-transform duration-200 active:scale-75 select-none">
                      {isChecked ? (
                        <CheckCircle className="h-5.5 w-5.5 text-brand-primary filter drop-shadow-[0_0_8px_rgba(255,45,120,0.3)] animate-[scaleIn_0.2s_ease-out]" />
                      ) : (
                        <Circle className="h-5.5 w-5.5 text-slate-500 group-hover:text-slate-400 transition-colors" />
                      )}
                    </div>

                    {/* Right text layout */}
                    <div className="flex-1 space-y-1 select-none">
                      <span className={`text-sm font-bold block transition-all duration-300 ${
                        isChecked 
                          ? 'text-slate-500 line-through print-text-light' 
                          : 'text-slate-200 group-hover:text-white print-text-dark'
                      }`}>
                        {task.text}
                      </span>
                      <p className={`text-xs leading-relaxed transition-all duration-300 m-0 ${
                        isChecked 
                          ? 'text-slate-600 print-text-light' 
                          : 'text-slate-400 group-hover:text-slate-300 print-text-light'
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
        <div className="mt-12 p-6 rounded-2xl border border-brand-secondary/20 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 backdrop-blur-md flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left animate-[fadeIn_0.5s_ease-out] print-card">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-slate-950 shadow-lg font-bold">
            <Award className="h-6 w-6 text-slate-950" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white m-0 print-text-dark">Roadmap Completed!</h4>
            <p className="text-xs text-slate-400 mt-1 m-0 print-text-light">
              Spectacular effort. You have crossed off every checkpoint on this planner. Keep training!
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
