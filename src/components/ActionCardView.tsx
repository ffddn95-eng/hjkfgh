import React from "react";
import { Target } from "lucide-react";
import { ActionCard as ActionCardType } from "../types/execution";
import { CopyBlock } from "./execution/CopyBlock";
import { ProofChecklist } from "./execution/ProofChecklist";

export function ActionCardView({ action, ideaId }: { action: ActionCardType, ideaId: string }) {
  return (
    <div className={`border border-white/10 rounded-[24px] overflow-hidden bg-gradient-to-b from-[#111] to-[#0a0a0a] shadow-2xl transition-all ${action.status === 'locked' ? 'opacity-50 grayscale pointer-events-none hover:grayscale-0 hover:opacity-100 transition-all duration-500' : ''}`}>
      {/* Card Header */}
      <div className="p-8 md:p-10 border-b border-white/5 bg-[#151515]">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-[10px] px-2 py-0.5 bg-white/10 rounded-md font-mono uppercase font-bold tracking-widest text-white/90">Step {action.day}</span>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[2px] text-[#00ff9d] bg-[#00ff9d]/10 px-3 py-1 rounded-full border border-[#00ff9d]/20 overflow-hidden max-w-[200px]">
               <Target className="w-3 h-3 shrink-0" /> 
               <span className="truncate whitespace-nowrap">target: {action.targetSite?.name || 'Local / Other'}</span>
            </div>
          </div>
          <div className="text-[10px] text-white/40 font-mono font-medium">{action.estimatedMinutes || 0}m est.</div>
        </div>
        <h2 className="text-2xl font-extrabold mb-4 tracking-tight leading-tight line-clamp-2">{action.title}</h2>
        <p className="text-white/60 leading-relaxed text-[16px] max-w-2xl">{action.objective}</p>
        
        {/* URL Target site if it exists */}
        {action.targetSite?.url && (
            <div className="mt-8">
              <a href={action.targetSite.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-[2px] rounded-full transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                Launch {action.targetSite.name!}
              </a>
            </div>
        )}
      </div>
      
      {/* Card Body */}
      <div className="p-8 md:p-10 space-y-12">
        
        {/* Steps protocol */}
        <div className="bg-[#050505] p-8 rounded-2xl border border-white/5">
          <h4 className="text-[11px] font-black uppercase tracking-[3px] text-white/30 mb-6 flex items-center gap-4">
            <span className="w-8 h-[1px] bg-white/20"></span> Executive Protocol
          </h4>
          <ol className="flex flex-col gap-5 ml-1 text-[16px] text-white/80 leading-relaxed font-medium">
            {action.steps?.map((step, i) => (
              <li key={i} className="flex gap-5 items-start relative pl-8">
                <span className="absolute left-0 top-0.5 text-white/20 font-mono text-[12px] font-bold">0{i+1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Resources / Copy Texts */}
        {action.copyTexts && action.copyTexts.length > 0 && (
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[3px] text-[#00ff9d] mb-6 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-[#00ff9d]/30"></span> Approved Copy
            </h4>
            <div className="grid gap-6">
              {action.copyTexts.map((copy, i) => (
                <React.Fragment key={i}>
                  <CopyBlock label={copy.label} text={copy.text} />
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
        
        {/* Search Queries */}
        {action.searchQueries && action.searchQueries.length > 0 && (
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[3px] text-blue-400 mb-6 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-blue-400/30"></span> Search Queries
              </h4>
              <div className="grid gap-6">
                {action.searchQueries.map((query, i) => (
                  <React.Fragment key={i}>
                    <CopyBlock label={`Query ${i + 1}`} text={query} />
                  </React.Fragment>
                ))}
              </div>
            </div>
        )}

        <div className="flex gap-8 flex-col sm:flex-row bg-[#080808] p-8 rounded-2xl border border-white/5">
            {/* Success criteria */}
            {action.successCriteria && action.successCriteria.length > 0 && (
              <div className="flex-1">
                <h4 className="text-[11px] font-black uppercase tracking-[3px] text-[#00ff9d] mb-5">Success Signals</h4>
                <ul className="flex flex-col gap-4">
                    {action.successCriteria.map((criteria, i) => (
                    <li key={i} className="text-[14px] text-white/70 pl-6 relative before:content-[''] before:w-1.5 before:h-1.5 before:bg-[#00ff9d] before:rounded-full before:absolute before:left-0 before:top-1.5">
                        {criteria}
                    </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Failure signals */}
            {action.failureSignals && action.failureSignals.length > 0 && (
              <div className="flex-1">
                <h4 className="text-[11px] font-black uppercase tracking-[3px] text-red-500 mb-5">Failure Signals</h4>
                <ul className="flex flex-col gap-4">
                    {action.failureSignals.map((signal, i) => (
                    <li key={i} className="text-[14px] text-white/70 pl-6 relative before:content-[''] before:w-1.5 before:h-1.5 before:bg-red-500 before:rounded-full before:absolute before:left-0 before:top-1.5">
                        {signal}
                    </li>
                    ))}
                </ul>
              </div>
            )}
        </div>
        
        {/* Evidence Collection */}
        <div className="pt-6 border-t border-white/10">
          <h4 className="text-[11px] font-black uppercase tracking-[3px] text-white/50 mb-6 text-center">Protocol Verification</h4>
          <div className="max-w-xl mx-auto bg-[#050505] p-8 rounded-2xl border border-white/10 shadow-lg">
            <ProofChecklist 
                ideaId={ideaId} 
                actionId={action.id || ''} 
                requiredInputs={action.requiredInputs || []} 
                status={action.status} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
