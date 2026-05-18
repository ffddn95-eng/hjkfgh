import { useState } from "react";
import { Lock, Unlock, Rocket, PartyPopper } from "lucide-react";
import { ActionCard } from "../types/execution";

export function BuildLock({ actions }: { actions: ActionCard[] }) {
  const [celebrating, setCelebrating] = useState(false);
  const isAllCompleted = actions.length > 0 && actions.every(a => a.status === 'completed');

  if (celebrating) {
    return (
      <div className="mt-12 p-12 border border-[#00ff9d] bg-[#00ff9d]/10 rounded-2xl flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
        <PartyPopper className="w-16 h-16 text-[#00ff9d] mb-6 animate-bounce" />
        <h2 className="text-3xl font-black text-white mb-4 uppercase italic tracking-tighter">Market Validated</h2>
        <p className="text-white/80 max-w-lg mb-10 leading-relaxed text-lg">
          You have successfully navigated the FirstRevenue protocol. 
          The market has spoken. Focus on your <strong className="text-[#00ff9d]">Core Engine</strong> now. 
          Execution is the only priority.
        </p>
        <button 
          onClick={() => setCelebrating(false)} 
          className="text-white/40 hover:text-white uppercase tracking-[3px] text-[10px] font-black transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className={`mt-12 p-8 border rounded-2xl flex flex-col items-center justify-center text-center transition-all ${
      isAllCompleted 
        ? "border-[#00ff9d]/50 bg-[#00ff9d]/10 ring-1 ring-[#00ff9d]/20" 
        : "border-white/10 bg-white/5"
    }`}>
      {isAllCompleted ? (
        <>
          <div className="w-16 h-16 rounded-full bg-[#00ff9d]/20 flex items-center justify-center mb-6 border border-[#00ff9d]/30">
            <Unlock className="w-8 h-8 text-[#00ff9d]" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Build Phase Unlocked</h2>
          <p className="text-[#00ff9d]/80 mb-10 font-mono text-sm max-w-md uppercase tracking-wider">Protocol complete. Market signal confirmed.</p>
          <button 
            onClick={() => setCelebrating(true)}
            className="px-12 py-5 bg-[#00ff9d] text-black font-black uppercase tracking-[2px] text-[14px] rounded-xl hover:bg-[#00e08a] transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(0,255,157,0.3)] flex items-center gap-3"
          >
            <Rocket className="w-5 h-5" /> Initialize Build
          </button>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center border border-white/20 mb-6">
            <Lock className="w-8 h-8 text-white/40" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Build Phase Locked</h2>
          <p className="text-white/40 mb-2 max-w-md">You must complete all day 1-7 execution protocols and log evidence before you are allowed to build.</p>
          <p className="text-[#888] font-mono text-[10px] uppercase tracking-widest">Revenue First. Code Second.</p>
        </>
      )}
    </div>
  );
}
