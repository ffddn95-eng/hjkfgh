import { ArrowRight, RotateCcw } from "lucide-react";
import { PivotOption } from "../types/execution";

export function PivotGenerator({ pivots }: { pivots: PivotOption[] }) {
  if (!pivots || pivots.length === 0) return null;

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Emergency Pivot Protocol</h2>
        <p className="text-white/50 text-lg">If validation fails, use these alternative structural pivots designed for faster revenue.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pivots.map((pivot, i) => (
          <div key={i} className="border border-[#ffdd00]/20 bg-gradient-to-br from-[#151515] to-[#0a0a0a] p-8 rounded-3xl relative overflow-hidden group hover:border-[#ffdd00]/40 transition-all shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500">
              <RotateCcw className="w-48 h-48 text-[#ffdd00]" />
            </div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-8 gap-4">
                 <h3 className="text-2xl font-bold tracking-tight text-[#ffdd00] leading-snug">{pivot.title}</h3>
                 <span className="shrink-0 text-[10px] uppercase font-bold tracking-widest bg-[#ffdd00]/10 border border-[#ffdd00]/20 px-3 py-1.5 rounded-full text-[#ffdd00]">
                   {pivot.difficulty}
                 </span>
              </div>
              
              <div className="space-y-6 flex-1 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                    <span className="text-white/40 uppercase tracking-widest text-[10px] font-bold">The Reason</span>
                  </div>
                  <div className="text-white/80 leading-relaxed text-[15px]">{pivot.reason}</div>
                </div>
                <div>
                   <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                    <span className="text-white/40 uppercase tracking-widest text-[10px] font-bold">New Target</span>
                  </div>
                  <div className="text-white/80 leading-relaxed text-[15px]">{pivot.newTargetCustomer}</div>
                </div>
                <div>
                   <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d]/50"></span>
                    <span className="text-white/40 uppercase tracking-widest text-[10px] font-bold">Monetization Path</span>
                  </div>
                  <div className="text-white/90 font-medium leading-relaxed text-[15px] p-4 bg-white/5 rounded-xl border border-white/5">{pivot.monetizationPath}</div>
                </div>
              </div>
              
              <button 
                className="w-full py-4 bg-[#ffdd00]/10 hover:bg-[#ffdd00]/20 transition-colors border border-[#ffdd00]/20 rounded-xl text-[12px] uppercase tracking-widest font-black text-[#ffdd00] flex items-center justify-center gap-3 mt-auto"
                onClick={() => {
                  const query = encodeURIComponent(pivot.title + ": " + pivot.monetizationPath);
                  window.location.href = `/?idea=${query}`;
                }}
              >
                 Accept Pivot Protocol <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
