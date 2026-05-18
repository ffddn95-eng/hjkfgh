import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ActionCard as ActionCardType } from "../types/execution";
import { ActionCardView } from "./ActionCardView";

export function ExecutionNavigator({ actions, ideaId }: { actions: ActionCardType[], ideaId: string }) {
  const steps = [1, 2, 3, 4, 5, 6, 7];

  const allCompleted = actions.length > 0 && actions.every(a => a.status === 'completed');
  
  const completedActions = actions.filter(a => a.status === 'completed');
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  useEffect(() => {
    if (allCompleted && completedActions.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlideIdx(prev => (prev + 1) % completedActions.length);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [allCompleted, completedActions.length]);

  // Use today's date for simplicity, formatting it nicely
  const completionDate = allCompleted ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date()) : "";

  return (
    <div className="relative overflow-hidden w-full min-h-[600px]">
      <AnimatePresence mode="wait">
        {allCompleted ? (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 80, damping: 20 }}
            className="flex flex-col items-center text-center max-w-5xl mx-auto py-16 px-6 gap-8 bg-[#0a0a0a] rounded-3xl border border-[#00ff9d]/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00ff9d]/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="w-16 h-16 bg-[#00ff9d]/10 rounded-full flex items-center justify-center mb-2 border border-[#00ff9d]/30 relative z-10">
               <span className="text-2xl">🚀</span>
            </div>
            
            <div className="relative z-10 space-y-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Protocol Complete <br/>
                <span className="text-[#00ff9d]">Mission Accomplished.</span>
              </h1>
              <p className="text-white/60 text-lg">
                축하합니다! 당신은 <strong className="text-[#00ff9d]">{completionDate}</strong>에 모든 검증 프로토콜을 완수했습니다. 
                이제 실전 빌드 단계로 나아갈 준비가 되었습니다.
              </p>
            </div>

            {completedActions.length > 0 && (
              <div className="relative w-full max-w-4xl h-[400px] mt-4 flex items-center justify-center z-10">
                 <AnimatePresence mode="wait">
                    <motion.div 
                      key={currentSlideIdx}
                      initial={{ opacity: 0, x: 50, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -50, scale: 0.95 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full flex flex-col md:flex-row bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                    >
                      <div className="flex-1 p-8 flex flex-col justify-center text-left">
                        <span className="text-[12px] font-mono font-bold uppercase tracking-widest text-[#00ff9d] mb-4">
                          Step {completedActions[currentSlideIdx].day}
                        </span>
                        <h3 className="text-2xl font-bold text-white mb-4 leading-snug">
                          {completedActions[currentSlideIdx].title}
                        </h3>
                        <p className="text-white/60 text-[15px] leading-relaxed line-clamp-4">
                          {completedActions[currentSlideIdx].objective}
                        </p>
                      </div>
                      <div className="flex-1 relative bg-black flex items-center justify-center border-l border-white/10">
                        {completedActions[currentSlideIdx].evidence?._photo ? (
                          <img 
                            src={completedActions[currentSlideIdx].evidence!._photo} 
                            alt="Evidence" 
                            className="w-full h-full object-cover opacity-80"
                          />
                        ) : (
                          <div className="text-white/20 font-bold uppercase tracking-widest text-sm flex flex-col items-center gap-4">
                             <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">📷</div>
                             No Photo Evidence
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      </div>
                    </motion.div>
                 </AnimatePresence>

                 {/* Pagination Dots */}
                 <div className="absolute -bottom-8 left-0 w-full flex justify-center gap-2">
                   {completedActions.map((_, i) => (
                     <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === currentSlideIdx ? 'bg-[#00ff9d] w-8' : 'bg-white/20 w-2'}`} />
                   ))}
                 </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="navigator"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="flex gap-8 items-start w-full"
          >
            {/* Timeline sidebar */}
            <div className="hidden lg:flex flex-col gap-6 w-38 shrink-0 sticky top-32">
              {actions.map((action, idx) => (
                <div key={action.id || idx} className="flex items-center gap-4 group cursor-pointer relative">
                  <div className={`w-8 h-8 rounded flex items-center justify-center border font-mono text-[10px] uppercase font-bold tracking-wider z-10 transition-colors
                    ${action.status === 'completed' ? 'bg-[#00ff9d] text-black border-[#00ff9d]' 
                      : action.status === 'todo' ? 'bg-white/10 text-white border-white/20'
                      : 'bg-transparent text-white/30 border-white/10'}`}
                  >
                    S{action.day}
                  </div>
                  {idx !== actions.length - 1 && (
                    <div className="absolute top-8 left-4 w-px h-10 bg-white/10 z-0" />
                  )}
                  <span className={`text-[12px] uppercase tracking-widest font-bold ${action.status === 'completed' ? 'text-white' : action.status === 'todo' ? 'text-white/80' : 'text-white/30'}`}>
                    Step {action.day}
                  </span>
                </div>
              ))}
            </div>

            <section className="flex-1 max-w-3xl flex flex-col gap-12">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  7-Step First Revenue Execution Plan
                </h2>
                <p className="text-white/60">
                  각 단계는 실제 사이트에서 수행할 행동으로 구성됩니다.
                </p>
              </div>

              {steps.map((stepNum) => {
                const dayActions = actions.filter((action) => action.day === stepNum);
                if (dayActions.length === 0) return null;

                return (
                  <div key={stepNum} className="flex flex-col gap-12">
                    {dayActions.map((action) => (
                      <React.Fragment key={action.id}>
                        <ActionCardView action={action} ideaId={ideaId} />
                      </React.Fragment>
                    ))}
                  </div>
                );
              })}
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
